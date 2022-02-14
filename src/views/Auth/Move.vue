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
import { useRouter } from "vue-router";
import { api } from "@/config";
import { login } from "@/utils";

import { defaultError } from "@/utils";
export default {
    setup() {
        const router = useRouter();

        if (login()) {
            router.push({ name: "Memo" });
        } else {
            axios({
                url: `${api.host}/auth/get-url`,
            })
                .then((e) => {
                    const data = e.data;
                    const url = data.data.auth;

                    window.location.replace(url);
                })
                .catch((e) => defaultError(e));
        }
    },
};
</script>
