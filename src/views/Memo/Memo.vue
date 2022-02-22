<template>
    <section class="section">
        <div class="container" v-if="showButton == true">
            <div class="columns">
                <div class="column">
                    <button
                        class="button is-success is-light is-fullwidth"
                        @click="createMemo()"
                    >
                        새로운 메모 생성하기
                    </button>
                </div>
                <div class="column">
                    <button
                        class="button is-info is-light is-fullwidth"
                        @click="reset()"
                    >
                        전체 메모 다시 불러오기
                    </button>
                </div>
            </div>
        </div>
    </section>

    <section class="section" v-for:="memo in memos">
        <div class="container">
            <h1 class="title is-4">
                {{ getDate(memo.edit) }}
                <span
                    v-if="memo.encrypted == false && memo.display == true"
                    @click="encryptMemo(memo.id)"
                >
                    🔓
                </span>
            </h1>

            <div class="content is-large" v-if="memo.display != true">
                <blockquote @click="decryptMemo(memo.id)">
                    이 메모는 <b>암호화</b>된 메모입니다.<br />
                    메모를 확인하려면 <b>비밀번호</b>를 입력해야합니다.
                </blockquote>
            </div>
            <textarea
                v-else
                class="textarea"
                v-model="memo.text"
                @blur="onBlur(memo.id)"
            ></textarea>
        </div>
    </section>

    <section class="section">
        <div class="container" v-if="showButton == true">
            <button
                class="button is-large is-link is-fullwidth"
                @click="fetchMemo()"
            >
                더 불러오기
            </button>
            <button
                class="button is-link is-light is-fullwidth dmui-m-t"
                @click="TOP()"
            >
                위로 올라가기
            </button>
        </div>
    </section>
</template>

<script>
import { Buffer } from "buffer/";
import axios from "axios";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";
import sha256 from "node-forge/lib/sha256";
import { createBuffer } from "node-forge/lib/util";
import { createCipher, createDecipher } from "node-forge/lib/cipher";
import { getBytesSync } from "node-forge/lib/random";
import { api } from "@/config";
import { getToken, login } from "@/utils";
import { defaultError, getDate } from "@/utils";
import { setAdmin, notAdmin } from "@/utils";
import { createMemo, saveMemo } from "@/memo";

export default {
    name: "view-and-edit",
    setup() {
        const router = useRouter();
        const showButton = ref(false);
        const memos = ref({});
        const lastId = ref(0);
        const passwords = ref({});

        // IF문용 상수
        const DECRYPT = -5; // 아무의미 없음
        const ENCRYPT = 21; // 아무의미 없음

        const reset = () => {
            memos.value = {};
            lastId.value = 0;
            passwords.value = {};

            fetchMemo();
        };

        const decryptMemo = (id) => {
            const password = passwords.value[id];

            if (password == undefined) {
                needPassword(id, DECRYPT);
            } else {
                let SHA256 = sha256.create();
                /* ^•ω•^ */ SHA256.update(password);
                const KEY = SHA256.digest();

                const encPayload = memos.value[id].encCipher.split(".");

                let IV = "";
                Buffer.from(encPayload[0], "hex").forEach((hex) => {
                    IV += String.fromCharCode(hex);
                });

                let encryptedResult = "";
                Buffer.from(encPayload[1], "hex").forEach((hex) => {
                    encryptedResult += String.fromCharCode(hex);
                });

                encryptedResult = createBuffer(encryptedResult, "raw");

                const DECIPHER = createDecipher("AES-CBC", KEY);
                DECIPHER.start({ iv: IV });
                DECIPHER.update(encryptedResult);

                let result = DECIPHER.finish();

                const iamFail = () => {
                    memos.value[id].text = "";
                    memos.value[id].display = false;
                    passwords.value[id] = undefined;

                    Swal.fire({
                        icon: "error",
                        text: "메모 복호화에 실패했습니다.",
                    });
                };

                if (result == true) {
                    try {
                        memos.value[id].text = DECIPHER.output.toString();
                        memos.value[id].display = true;
                    } catch {
                        iamFail();
                    }
                } else {
                    iamFail();
                }
            }
        };

        const encryptMemo = (id) => {
            const password = passwords.value[id];

            if (password == undefined) {
                needPassword(id, ENCRYPT);
            } else {
                let SHA256 = sha256.create();
                /* ^•ω•^ */ SHA256.update(password);
                const KEY = SHA256.digest();
                const IV = getBytesSync(16);

                const TEXT = createBuffer(memos.value[id].text, "utf8");

                const CIPHER = createCipher("AES-CBC", KEY);
                CIPHER.start({ iv: IV });
                CIPHER.update(TEXT);
                CIPHER.finish();

                const encryptedResult = CIPHER.output.toHex();

                let ivHEX = new Uint8Array(16);
                for (let index = 0; index < 16; index++) {
                    ivHEX[index] = IV[index].charCodeAt(0);
                }

                ivHEX = Buffer.from(ivHEX).toString("hex");

                memos.value[id].encrypted = true;
                memos.value[id].encCipher = `${ivHEX}.${encryptedResult}`;
                saveMemo(memos.value[id], memos);
            }
        };

        const needPassword = (id, mode) => {
            Swal.fire({
                icon: "question",
                title: mode == ENCRYPT ? "메모 암호화" : "메모 복호화",
                text: "비밀번호를 입력해주세요.",
                input: "password",
                inputAutoTrim: true,
            }).then((swalResp) => {
                if (swalResp.value == null || swalResp.value.length == 0) {
                    Swal.fire({
                        icon: "error",
                        text: "비밀번호를 입력해주세요!",
                        timer: 2022,
                        timerProgressBar: true,
                    });
                } else {
                    passwords.value[id] = swalResp.value;

                    if (mode == DECRYPT) {
                        decryptMemo(id);
                    } else if (mode == ENCRYPT) {
                        encryptMemo(id);
                    }
                }
            });
        };

        const onBlur = (id) => {
            Swal.fire({
                icon: "question",
                text: "메모를 저장할까요?",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "네",
                cancelButtonText: "아니요",
                timer: 2077,
                timerProgressBar: true,
            }).then((swalResp) => {
                if (swalResp.isConfirmed) {
                    if (memos.value[id].encrypted) {
                        encryptMemo(id);
                    } else {
                        saveMemo(memos.value[id], memos);
                    }
                } else {
                    Swal.fire({
                        icon: "warning",
                        text: "메모를 저장하지 않았습니다",
                        timer: 1984,
                        timerProgressBar: true,
                    });
                }
            });
        };

        const fetchMemo = () => {
            axios({
                method: "GET",
                url: `${api.host}/memo`,
                params: {
                    after: lastId.value,
                },
                headers: {
                    Authorization: getToken(),
                },
            })
                .then((resp) => {
                    const data = resp.data;

                    if (lastId.value == 0 && data.data.length == 0) {
                        Swal.fire({
                            icon: "info",
                            text: "저장된 메모가 없습니다!",
                            timer: 2022,
                            timerProgressBar: true,
                        });
                    } else {
                        let thisLastId = lastId.value;

                        data.data.forEach((ctx) => {
                            if (ctx.encrypted) {
                                ctx.encCipher = ctx.text;
                            }

                            // 암호화라면 숨기고 평문이면 보여주고
                            ctx.display = !ctx.encrypted;

                            memos.value[ctx.id] = ctx;
                            thisLastId = ctx.id;
                        });

                        lastId.value = thisLastId;
                    }
                })
                .catch((err) => defaultError(err));

            // 버튼 보여주기
            showButton.value = true;
        };

        if (!login()) {
            Swal.fire({
                icon: "warning",
                text: "메모를 확인하려면 로그인해야 합니다.",
                timer: 2022,
                timerProgressBar: true,
                showConfirmButton: false,
            }).then(() => {
                router.push({ name: "Home" });
            });
        } else {
            axios({
                method: "GET",
                url: `${api.host}/auth/check`,
                headers: {
                    Authorization: getToken(),
                },
            })
                .then((resp) => {
                    const data = resp.data;

                    if (data.data.admin) {
                        setAdmin();
                    } else {
                        notAdmin();
                    }

                    if (data.data.skipped) {
                        Swal.fire({
                            icon: "warning",
                            text: "등록된 '서비스 이용약관'이 없습니다.",
                            timer: 2022,
                            timerProgressBar: true,
                        }).then(() => {
                            // 메모 불러오기
                            fetchMemo();
                        });
                    } else if (!data.data.passed) {
                        Swal.fire({
                            icon: "error",
                            text: "'서비스 이용약관'이 변경되어 다시 동의해야 합니다.",
                            timer: 2022,
                            timerProgressBar: true,
                        }).then(() => {
                            router.push({ name: "Auth.Update" });
                        });
                    } else {
                        fetchMemo();
                    }
                })
                .catch((err) => defaultError(err));
        }

        return {
            createMemo: () => {
                createMemo()
                    .then(() => {
                        fetchMemo();
                    })
                    .catch((err) => defaultError(err));
            },
            decryptMemo,
            encryptMemo,
            showButton,
            reset,
            memos,
            lastId,
            onBlur,
            fetchMemo,
            getDate,
            TOP: () => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            },
        };
    },
};
</script>

<style scoped>
.dmui-m-t {
    margin-top: 10px;
}
</style>
