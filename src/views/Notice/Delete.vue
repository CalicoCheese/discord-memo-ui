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
import { api } from "@/config";
import { login, getToken, defaultError } from "@/utils";

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const id = route.params.id;

        if (login()) {
            axios({
                method: "DELETE",
                url: `${api.host}/notice/${id}`,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            })
                .then((e) => {
                    const data = e.data;
                    Swal.fire({
                        icon: "success",
                        text: data.meta.message,
                        timer: 2022,
                        timerProgressBar: true,
                    }).then(() => {
                        router.push({ name: "Notice.List" });
                    });
                })
                .catch((e) => defaultError(e));
        } else {
            router.push({ name: "Home" });
        }
    },
};
</script>
