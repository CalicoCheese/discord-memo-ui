<template>
    <section class="section" v-if="show == true">
        <div class="container">
            <p>TODO:메모 api 완성후 작업</p>
        </div>
    </section>
</template>

<script>
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/utils";

export default {
    setup() {
        const router = useRouter();
        const show = ref(false);

        if (!login()) {
            Swal.fire({
                icon: "warning",
                text: "메모를 확인하려면 로그인해야 합니다.",
                timer: 2022,
                timerProgressBar: true,
                showConfirmButton: false,
            }).then(() => {
                router.push({ name: "Home" });
            });
        }

        return {
            show,
        };
    },
};
</script>
