<template>
    <div>
        <h1>잠시만요...</h1>
        <p>로그인 페이지로 이동중입니다...</p>
    </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import config from "@/config";

export default {
    setup() {
        axios({
            url: `${config.api.host}/auth/get-url`,
        })
            .then((e) => {
                const data = e.data;
                const url = data.data.auth;

                window.location.replace(url);
            })
            .catch((e) => {
                const data = e.response.data;
                Swal.fire({
                    title: data.meta.code,
                    text: data.meta.message,
                });
            });
    },
};
</script>
