<template>
    <section class="section" v-for:="memo in memos">
        <div class="container">
            <h1 class="title is-4">{{ getDate(memo.edit) }}</h1>

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

            <button
                v-if="memo.encrypted == false && memo.display == true"
                class="button is-info is-light is-fullwidth dmui-m-t"
                @click="encryptMemo(memo.id)"
            >
                메모 암호화 하기
            </button>
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
                class="button is-danger is-light is-fullwidth dmui-m-t"
                @click="reset()"
            >
                전체 메모 다시 불러오기
            </button>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "@/config";
import { getToken, login } from "@/utils";
import { defaultError, getDate } from "@/utils";
import { setAdmin, notAdmin } from "@/utils";
import { saveMemo } from "@/memo";

export default {
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

        const decryptMemo = (i) => {
            const p = passwords.value[i];

            if (p == undefined) {
                needPassword(i, ENCRYPT);
            } else {
                alert("암호화 기능은 아직 구현되지 않았습니다.");
            }
        };

        const encryptMemo = (i) => {
            const p = passwords.value[i];

            if (p == undefined) {
                needPassword(i, ENCRYPT);
            } else {
                alert("암호화 기능은 아직 구현되지 않았습니다.");
            }
        };

        const needPassword = (i, cb) => {
            Swal.fire({
                icon: "question",
                text: "비밀번호를 입력해주세요.",
                input: "password",
                inputAutoTrim: true,
            }).then((e) => {
                if (e.value == null || e.value.length == 0) {
                    Swal.fire({
                        icon: "error",
                        text: "비밀번호를 입력해주세요!",
                        timer: 2022,
                        timerProgressBar: true,
                    });
                } else {
                    passwords.value[i] = e.value;

                    if (cb == DECRYPT) {
                        decryptMemo(i);
                    } else if (cb == ENCRYPT) {
                        encryptMemo(i);
                    }
                }
            });
        };

        const onBlur = (i) => {
            Swal.fire({
                icon: "question",
                text: "메모를 저장할까요?",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "네",
                cancelButtonText: "아니요",
                timer: 2077,
                timerProgressBar: true,
            }).then((e) => {
                if (e.isConfirmed) {
                    saveMemo(memos.value[i], memos);
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
                .then((e) => {
                    const data = e.data;

                    if (lastId.value == 0 && data.data.length == 0) {
                        Swal.fire({
                            icon: "info",
                            text: "저장된 메모가 없습니다!",
                            timer: 2022,
                            timerProgressBar: true,
                        });
                    } else {
                        let this_last_id = lastId.value;

                        data.data.forEach((e) => {
                            e.display = !e.encrypted;
                            memos.value[e.id] = e;
                            this_last_id = e.id;
                        });

                        lastId.value = this_last_id;
                    }
                })
                .catch((e) => defaultError(e));

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
                .then((e) => {
                    const data = e.data;

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
                .catch((e) => defaultError(e));
        }

        return {
            decryptMemo,
            encryptMemo,
            showButton,
            reset,
            memos,
            lastId,
            onBlur,
            fetchMemo,
            getDate,
        };
    },
};
</script>

<style scoped>
.dmui-m-t {
    margin-top: 10px;
}
</style>
