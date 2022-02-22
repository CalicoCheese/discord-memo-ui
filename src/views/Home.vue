<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">메모</h1>
            <div class="content is-medium">
                <p>디스코드 봇한테 DM을 보내면 메모가 등록됩니다.</p>
            </div>

            <div v-if="isLogin == true" class="dmui-m-bt">
                <router-link
                    class="button is-primary is-medium"
                    :to="{ name: 'Memo' }"
                >
                    메모 보러가기
                </router-link>
            </div>

            <div>
                <router-link
                    class="button is-link is-medium"
                    v-if="isLogin == false"
                    :to="{ name: 'Auth.Move' }"
                >
                    로그인
                </router-link>
                <router-link
                    class="button is-dark is-medium"
                    v-else-if="isLogin == true"
                    :to="{ name: 'Auth.Logout' }"
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
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h1 class="title is-2">암호화</h1>
            <div class="content is-medium">
                <p>클라이언트에서 추가적인 <b>암호화</b>가 가능합니다!</p>
                <p>사용자가 입력한 비밀번호는 서버에 저장되지 않습니다.</p>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h1 class="title is-2">오픈소스!</h1>
            <div class="content is-medium">
                <p>이 메모 프로젝트는 <b>오픈소스 프로젝트</b> 입니다.</p>
                <ul>
                    <li v-for:="project in home.projects">
                        <a :href="project.url">{{ project.display }}</a>
                        <span>{{ project.text }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h1 class="title is-2">버그 &amp; 피드백</h1>
            <div class="content is-medium">
                <p>
                    사용중 버그를 발견했거나 요청하고 싶은 기능이 있다면 다음
                    <a :href="home.email">이메일</a>로 연락해주세요.
                </p>
                <p>
                    또는 <a :href="home.profile">Github</a>에 이슈를 남겨주세요.
                </p>
            </div>
        </div>
    </section>
</template>

<script>
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { login } from "@/utils";
import { home } from "@/config";

export default {
    name: "home-sweet-home",
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
            }).then((swalResp) => {
                if (swalResp.isConfirmed) {
                    router.push({ name: "Memo" });
                }
            });
        }

        return {
            isLogin: login(),
            home,
        };
    },
};
</script>

<style scoped>
.dmui-m-bt {
    margin-bottom: 5px;
}

.button {
    margin-right: 5px;
}

li > a {
    display: inline-block;
    width: 45px;
}
</style>
