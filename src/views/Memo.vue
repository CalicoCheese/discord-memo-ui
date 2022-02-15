<template>
    <section class="section">
        <div class="container" v-if="showButton == true && showResetButton()">
            <button
                class="button is-danger is-light is-fullwidth"
                @click="reset()"
            >
                전체 메모 다시 불러오기
            </button>
        </div>
    </section>

    <section class="section" v-for:="memo in memos">
        <div class="container">
            <h1 class="title is-4">{{ getDate(memo.edit) }}</h1>
            <textarea
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
import { getPassword, getMemoKey } from "@/utils";
import { defaultError } from "@/utils";
import { setAdmin, notAdmin } from "@/utils";
import { saveMemo } from "@/memo";

export default {
    setup() {
        const router = useRouter();
        const showButton = ref(false);
        const memos = ref({});
        const lastId = ref(0);

        let password = getPassword();
        let passwordSetup = false;

        // 메모 복호화 키 발급
        /* const memoKey = */ getMemoKey();

        const reset = () => {
            memos.value = {};
            lastId.value = 0;

            fetchMemo();
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
            if (passwordSetup == true || password == undefined) {
                Swal.fire({
                    icon: "warning",
                    text: "메모 비밀번호가 입력되지 않았습니다!",
                    timer: 2022,
                    timerProgressBar: true,
                }).then(() => {
                    router.push({ name: "Password" });
                });
            } else {
                axios({
                    method: "GET",
                    url: `${api.host}/memo`,
                    params: {
                        after: lastId.value,
                    },
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
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
                                memos.value[e.id] = e;
                                this_last_id = e.id;
                            });

                            lastId.value = this_last_id;
                        }
                    })
                    .catch((e) => defaultError(e));
            }

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
            const token = getToken();

            axios({
                method: "GET",
                url: `${api.host}/auth/check`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((e) => {
                    const data = e.data;
                    passwordSetup = data.data.password;

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
                            router.push({ name: "Update" });
                        });
                    } else {
                        fetchMemo();
                    }
                })
                .catch((e) => defaultError(e));
        }

        return {
            showButton,
            showResetButton: () => {
                return Object.keys(memos.value).length > 0;
            },
            reset,
            memos,
            lastId,
            onBlur,
            fetchMemo,
            getDate: (ts) => {
                // ts == TimeStamp
                let d = new Date(ts * 1000);
                return d.toLocaleDateString();
            },
        };
    },
};
</script>
