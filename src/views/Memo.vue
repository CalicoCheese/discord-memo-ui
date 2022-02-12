<template>
    <section class="section" v-for:="memo in memos">
        <div class="container">
            <p>{{ memo.text }}</p>

    <section class="section">
        <div class="container">
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
import config from "@/config";
import { getToken, login, logout } from "@/utils";

export default {
    setup() {
        const router = useRouter();
        const memos = ref([]);
        const lastId = ref(0);

        const fetchMemo = () => {
            for (let i = lastId.value + 10; lastId.value <= i; lastId.value++) {
                memos.value.push({
                    id: lastId.value,
                    edit: Date.now() / 1000,
                    text: `# 테스트 메모`,
                });
            }
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
                url: `${config.api.host}/auth/check`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((e) => {
                    const data = e.data;
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
                .catch((e) => {
                    if (e.response == undefined) {
                        Swal.fire({
                            icon: "error",
                            text: "알 수 없는 오류가 발생했습니다.",
                            timer: 2022,
                            timerProgressBar: true,
                        }).then(() => {
                            router.push({ name: "Home" });
                        });
                    } else {
                        const data = e.response.data;

                        if (data.meta.code == 401) {
                            logout();
                        }

                        Swal.fire({
                            icon: "error",
                            title: data.meta.code,
                            text: data.meta.message,
                            timer: 2022,
                            timerProgressBar: true,
                        }).then(() => {
                            router.push({ name: "Home" });
                        });
                    }
                });
        }

        return {
            memos,
            lastId,
            fetchMemo,
        };
    },
};
</script>
