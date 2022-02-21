<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">잠시만요...</h1>
            <p>봇 초대 링크를 불러오고 있습니다...</p>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { api } from "@/config";

export default {
    setup() {
        const router = useRouter();

        axios({
            url: `${api.host}/bot/get-url`,
        })
            .then((resp) => {
                const data = resp.data;
                const url = data.data.invite;

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
    },
};
</script>
