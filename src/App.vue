<template>
    <router-view />

    <footer class="footer">
        <div class="container">
            <div class="columns">
                <div class="column">
                    <div class="column">&copy; Calico Cheese</div>
                    <div class="column">
                        <a :href="home.profile">Github</a>
                    </div>
                </div>
                <div class="column">
                    <div class="column">
                        <router-link :to="{ name: 'Memo' }">
                            메모 관리
                        </router-link>
                    </div>
                    <div class="column">
                        <router-link :to="{ name: 'Dashboard.View' }">
                            계정 관리
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
                        <router-link :to="{ name: 'Notice.List' }">
                            공지사항
                        </router-link>
                    </div>
                    <div class="column">
                        <router-link :to="{ name: 'ToS.View' }">
                            서비스 이용약관
                        </router-link>
                    </div>
                    <div class="column">
                        <router-link :to="{ name: 'Privacy.View' }">
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
import { home, api } from "@/config";
import { getPayload } from "@/utils";
import { updateToken } from "@/login";
import { log } from "@/logger";

export default {
    setup() {
        // 스피너 객체를 보관하는 변수
        const loading = useLoading();
        let loadingObj = undefined;

        // 스피너가 돌아야 하는지 여부를 저장하는 변수
        const spinner = ref();

        // 스피너 핸들러
        watch(spinner, () => {
            if (spinner.value) {
                loadingObj = loading.show({
                    color: "#FFCC4D",
                    canCancel: false,
                });
            } else {
                if (loadingObj != undefined) {
                    loadingObj.hide();
                } else {
                    log("App.vue", "경고! 등록된 스피너가 없습니다.");
                }
            }
        });

        const getUrl = (config) => {
            return `${config.baseURL}${config.url}`;
        };

        // axios 전역 설정
        axios.defaults.baseURL = api.host;

        // axios 요청 시작시 스피너 보이기
        axios.interceptors.request.use(
            (config) => {
                log("axios", `요청 생성 ${getUrl(config)}`, "#ADD8E6");

                spinner.value = true;
                return config;
            },
            (error) => {
                log("axios", `요청 실패 ${error}`, "#FF7F50");

                spinner.value = false;
                return Promise.reject(error);
            }
        );

        // 오류나거나 요청이 끝나면 스피터 숨기기
        axios.interceptors.response.use(
            (response) => {
                log("axios", `요청 성공 ${getUrl(response.config)}`, "#AAF0D1");

                spinner.value = false;

                // 토큰 만료까지 1시간 남았다면 토큰 연장하기
                const payload = getPayload();

                if (payload != undefined) {
                    const now = Date.now() / 1000;
                    if (payload.time.exp - now <= 3600) {
                        updateToken();
                    }
                }

                return response;
            },
            (error) => {
                log("axios", `요청 실패 ${getUrl(error.config)}`, "#FF7F50");
                log("axios", `isAxiosError: ${error.isAxiosError}`, "#FF7F50");
                log("axios", error, "#FF7F50");

                spinner.value = false;
                return Promise.reject(error);
            }
        );

        return {
            home,
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
