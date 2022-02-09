<template>
    <div>
        <h1>개발중!</h1>
        <p>메모 서비스 개발중입니다...</p>
    </div>
</template>

<script>
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { login } from "@/utils";

export default {
    setup() {
        if (login()) {
            const router = useRouter();

            Swal.fire({
                icon: "question",
                title: "반가워요!",
                text: "메모를 확인하러 갈까요?",
                confirmButtonText: "네!",
                showCloseButton: true,
                timer: 2022,
                timerProgressBar: true,
            }).then((e) => {
                if (e.isConfirmed) {
                    router.push({ name: "Memo" });
                }
            });
        }
    },
};
</script>
