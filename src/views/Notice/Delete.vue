<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">잠시만요...</h1>
            <p>삭제 요청 처리중입니다...</p>
        </div>
    </section>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import { getToken, defaultError } from "@/utils";
import { isLogin } from "@/login";

export default {
    name: "notice-delete",
    setup() {
        const router = useRouter();
        if (isLogin()) {
            router.push({ name: "Home" });
            return {};
        }

        const route = useRoute();
        const id = route.params.id;

        axios({
            method: "DELETE",
            url: `/notice/${id}`,
            headers: {
                Authorization: getToken(),
            },
        })
            .then((resp) => {
                const data = resp.data;
                Swal.fire({
                    icon: "success",
                    text: data.meta.message,
                    timer: 2022,
                    timerProgressBar: true,
                }).then(() => {
                    router.push({ name: "Notice.List" });
                });
            })
            .catch((err) => defaultError(err));

        return {};
    },
};
</script>
