<template>
    <section class="section" v-for:="memo in memos">
        <div class="container">
            <p>{{ memo.text }}</p>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";
import config from "@/config";
import { getToken, login } from "@/utils";

export default {
    setup() {
        const router = useRouter();
        const memos = ref([]);
        const fetchMemo = (after) => {
            console.log(after);

            for (let i = 1; i <= 100; i++) {
                memos.value.push({
                    id: i,
                    edit: Date.now() / 1000,
                    text: `# ${i} 번째 메모 입니다.\n\n[ ] ${i}번째 메모의 할일`,
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
        };
    },
};
</script>
