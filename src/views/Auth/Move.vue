<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">잠시만요...</h1>
            <p>로그인 페이지로 이동중입니다...</p>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { api } from "@/config";
import { login } from "@/utils";

export default {
    name: "auth-move-to-discord-oauth",
    setup() {
        const router = useRouter();

        if (login()) {
            router.push({ name: "Memo" });
        } else {
            axios({
                url: `${api.host}/auth/get-url`,
            })
                .then((resp) => {
                    const data = resp.data;
                    const url = data.data.auth;

                    window.location.replace(url);
                })
                .catch(() => {
                    Swal.fire({
                        icon: "error",
                        text: "알 수 없는 오류가 발생했습니다.",
                        timer: 2022,
                        timerProgressBar: true,
                    }).then(() => {
                        router.push({ name: "Home" });
                    });
                });
        }
    },
};
</script>
