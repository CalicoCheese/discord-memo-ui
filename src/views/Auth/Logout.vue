<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">잠시만요...</h1>
            <p>로그아웃 요청 처리중입니다...</p>
        </div>
    </section>
</template>

<script>
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { logout } from "@/utils";

export default {
    setup() {
        logout();

        const router = useRouter();
        Swal.fire({
            icon: "info",
            title: "완료",
            text: "저장된 인증 정보를 삭제했습니다.",
            timer: 2022,
            timerProgressBar: true,
            showConfirmButton: false,
        }).then(() => {
            router.push({ name: "Home" });
        });
    },
};
</script>
