<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">메모</h1>
            <div class="content is-large">
                <p>디스코드 봇한테 DM을 보내면 메모가 등록됩니다.</p>
            </div>

            <router-link
                class="button is-link is-medium"
                v-if="isLogin == false"
                :to="{ name: 'Auth' }"
            >
                로그인
            </router-link>
            <router-link
                class="button is-dark is-medium"
                v-else-if="isLogin == true"
                :to="{ name: 'Logout' }"
            >
                로그아웃
            </router-link>

            <router-link
                class="button is-info is-medium"
                :to="{ name: 'Invite' }"
                target="_blank"
            >
                봇 초대하기
            </router-link>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h1 class="title is-2">암호화</h1>
            <div class="content is-large"></div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h1 class="title is-2">오픈소스!</h1>
            <div class="content is-large">
                <blockquote>
                    개발이 완료되지 않는 프로젝트는 비공개 상태입니다.
                </blockquote>
                <p>
                    이 메모 프로젝트는 오픈소스 프로젝트 입니다. 다음 링크를
                    확인해주세요.
                </p>
                <ul>
                    <li>
                        <a :href="home.github.ui">UI</a>
                    </li>
                    <li>
                        <a :href="home.github.api">API</a>
                    </li>
                    <li>
                        <a :href="home.github.bot">BOT</a>
                    </li>
                </ul>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h1 class="title is-2">버그 &amp; 피드백</h1>
            <div class="content is-large">
                <p>
                    사용중 버그를 발견했거나 요청하고 싶은 기능이 있다면 다음
                    <a :href="home.email">이메일</a>로 연락해주세요.
                </p>
                <p>
                    또는 <a :href="home.github.profile">Github</a>에 이슈를
                    남겨주세요.
                </p>
            </div>
        </div>
    </section>
</template>

<script>
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { login } from "@/utils";
import config from "@/config";

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

        return {
            isLogin: login(),
            home: config.home,
        };
    },
};
</script>

<style scoped>
.button {
    margin-right: 5px;
}
</style>
