<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">잠시만요...</h1>
            <p>모든 메모 삭제 요청 처리중입니다...</p>
        </div>
    </section>
</template>

<script>
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import axios from "axios";
import { api } from "@/config";
import { login, getToken } from "@/utils";
import { defaultError } from "@/utils";

export default {
    setup() {
        const router = useRouter();

        if (!login()) {
            router.push({ name: "Memo" });
        } else {
            Swal.fire({
                icon: "question",
                text: "모든 메모를 삭제할까요?",
                confirmButtonText: "네",
                cancelButtonText: "아니요",
                showConfirmButton: true,
                showCancelButton: true,
            }).then((swalResp) => {
                if (swalResp.isConfirmed) {
                    axios({
                        method: "DELETE",
                        url: `${api.host}/memo`,
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
                                router.push({ name: "Dashboard.View" });
                            });
                        })
                        .catch((err) => defaultError(err));
                } else {
                    Swal.fire({
                        icon: "info",
                        text: "취소되었습니다.",
                        timer: 2022,
                        timerProgressBar: true,
                    }).then(() => {
                        router.push({ name: "Dashboard.View" });
                    });
                }
            });
        }
    },
};
</script>
