<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">개발중</h1>
            <p>
                <a
                    href="https://github.com/CalicoCheese/discord-memo-ui"
                    target="_blank"
                >
                    discord-memo-ui
                </a>
            </p>
            <p>
                <a
                    href="https://github.com/CalicoCheese/discord-memo-api"
                    target="_blank"
                >
                    discord-memo-api
                </a>
            </p>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <router-link class="button is-info" :to="{ name: 'Auth' }">
                로그인
            </router-link>
            &nbsp;
            <router-link class="button is-dark" :to="{ name: 'Logout' }">
                로그아웃
            </router-link>

            <p>* 로컬환경에서 개발서버를 켜야합니다.</p>
        </div>
    </section>
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
