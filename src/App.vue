<template>
    <router-view />

    <footer class="footer">
        <div class="container">
            <div class="columns">
                <div class="column">
                    <div class="column">&copy; Calico Cheese</div>
                    <div class="column">
                        <a :href="home.github.profile">Github</a>
                    </div>
                </div>
                <div class="column">
                    <div class="column">
                        <router-link :to="{ name: 'Home' }">홈</router-link>
                    </div>
                    <div class="column">
                        <router-link
                            v-if="isLogin != true"
                            :to="{ name: 'Auth' }"
                        >
                            로그인
                        </router-link>
                        <router-link v-else :to="{ name: 'Logout' }">
                            로그아웃
                        </router-link>
                    </div>
                    <div class="column">
                        <router-link :to="{ name: 'Invite' }">
                            봇 초대
                        </router-link>
                    </div>
                </div>
                <div class="column">
                    <div class="column">
                        <router-link :to="{ name: 'NoticeList' }">
                            공지사항
                        </router-link>
                    </div>
                    <div class="column">
                        <router-link :to="{ name: 'ToS' }">
                            서비스 이용약관
                        </router-link>
                    </div>
                    <div class="column">
                        <router-link :to="{ name: 'Privacy' }">
                            개인정보 처리방침
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
import { ref, watch } from "vue";
import { useLoading } from "vue-loading-overlay";
import axios from "axios";
import { home } from "@/config";
import { login } from "@/utils";

export default {
    setup() {
        // 푸터 로그인/로그아웃을 위한 변수
        const isLogin = ref(login());

        // 스피너 객체를 보관하는 변수
        const loading = useLoading();
        let loadingObj = undefined;

        // 스피너가 돌아야 하는지 여부를 저장하는 변수
        const spinner = ref();

        // 스피너 핸들러
        watch(spinner, (need_spin) => {
            if (need_spin) {
                loadingObj = loading.show({
                    color: "#FFCC4D",
                    canCancel: false,
                });
            } else {
                if (loadingObj != undefined) {
                    loadingObj.hide();
                }
            }
        });

        // axios 요청 시작시 스피너 보이기
        axios.interceptors.request.use(
            (config) => {
                spinner.value = true;
                return config;
            },
            (error) => {
                spinner.value = false;
                return Promise.reject(error);
            }
        );

        // 오류나거나 요청이 끝나면 스피터 숨기기
        axios.interceptors.response.use(
            (response) => {
                setTimeout(() => {
                    // 로그인 변수 갱신하기
                    isLogin.value = login();
                }, 3500);

                spinner.value = false;
                return response;
            },
            (error) => {
                spinner.value = false;
                return Promise.reject(error);
            }
        );

        return {
            home,
            isLogin,
        };
    },
};
</script>

<style>
html,
body {
    height: 100%;
    background-color: #fafafa !important;
}

#app {
    background-color: white;
}
</style>
