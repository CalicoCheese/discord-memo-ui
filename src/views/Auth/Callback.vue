<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">잠시만요...</h1>
            <p>로그인 요청 처리중입니다...</p>
        </div>
    </section>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import { defaultError } from "@/utils";
import { token } from "@/config";

export default {
    name: "auth-callback-from-discord-oauth",
    setup() {
        const route = useRoute();
        const router = useRouter();
        const code = route.query.code;

        if (code == undefined) {
            Swal.fire({
                icon: "error",
                text: "올바른 접근이 아닙니다.",
                timer: 2022,
                timerProgressBar: true,
            }).then(() => {
                router.push({ name: "Home" });
            });
        } else {
            axios({
                url: "/auth/callback",
                params: {
                    code: code,
                },
            })
                .then((resp) => {
                    const data = resp.data;

                    // 토큰 저장
                    localStorage.setItem(token.key, data.data.token);

                    if (data.meta.code == 201) {
                        router.push({ name: "Memo" });
                    } else {
                        Swal.fire({
                            icon: "info",
                            text: data.meta.message,
                            timer: 2022,
                            timerProgressBar: true,
                        }).then(() => {
                            router.push({ name: "Auth.Update" });
                        });
                    }
                })
                .catch((err) => defaultError(err));
        }
    },
};
</script>
