<template>
    <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
    </div>
    <router-view />
</template>

<script>
import { ref, watch } from "vue";
import { useLoading } from "vue-loading-overlay";
import axios from "axios";

export default {
    setup() {
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
        // 오류나거나 요청이 끝나면 스피터 숨기기
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

        axios.interceptors.response.use(
            (response) => {
                spinner.value = false;
                return response;
            },
            (error) => {
                spinner.value = false;
                return Promise.reject(error);
            }
        );
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
</style>
