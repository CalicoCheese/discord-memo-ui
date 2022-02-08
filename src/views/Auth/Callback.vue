<template>
    <div>
        <h1>잠시만요...</h1>
        <p>로그인 요청 처리중입니다...</p>
    </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import config from "@/config";

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const code = route.query.code;

        if (code == undefined) {
            Swal.fire({
                title: "?",
                text: "올바른 접근이 아닙니다.",
            }).then(() => {
                router.push({ name: "Home" });
            });
        } else {
            axios({
                url: `${config.api.host}/auth/callback?code=${code}`,
            })
                .then((e) => {
                    const data = e.data;

                    localStorage.setItem(config.token.key, data.data.token);
                    localStorage.setItem(config.token.exp, data.data.exp);

                    Swal.fire({
                        title: data.meta.code,
                        text: data.meta.message,
                    }).then(() => {
                        router.push({ name: "Memo" });
                    });
                })
                .catch((e) => {
                    const data = e.response.data;
                    Swal.fire({
                        title: data.meta.code,
                        text: data.meta.message,
                    }).then(() => {
                        router.push({ name: "Home" });
                    });
                });
        }
    },
};
</script>
