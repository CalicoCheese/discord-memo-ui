<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">계정 관리 메뉴</h1>
            <div class="content is-large" v-if="display == true">
                <p>
                    현재
                    <b class="has-text-link">
                        {{ userInfo.username }}#{{ userInfo.discriminator }}
                    </b>
                    유저로 로그인되어 있습니다.
                </p>
            </div>
        </div>
    </section>

    <section class="section" v-if="display == true">
        <div class="container">
            <h2 class="title is-2">계정 정보</h2>
            <div class="content is-large">
                <p>
                    <span class="has-text-link">
                        {{ userInfo.username }}
                    </span>
                    님은
                    <span class="has-text-link">
                        {{ getDate(creation_date) }}
                    </span>
                    에 계정을 등록했습니다.
                </p>
                <p>
                    <span class="has-text-link">
                        {{ userInfo.username }}
                    </span>
                    님은
                    <span class="has-text-link">
                        {{ getDate(tos_agree_date) }}
                    </span>
                    에 서비스 이용약관에 동의했습니다.
                </p>
                <p>
                    <span class="has-text-link">
                        {{ userInfo.username }}
                    </span>
                    님은 총
                    <span class="has-text-link">{{ memo_count }}</span>
                    개의 메모를 등록했습니다.
                </p>
            </div>
        </div>
    </section>

    <section class="section" v-if="display == true">
        <div class="container">
            <h2 class="title is-2">기타</h2>

            <button class="button is-warning is-medium">모든 메모 삭제</button>
            <button class="button is-danger is-medium">계정 삭제</button>
        </div>
    </section>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { api } from "@/config";
import { getToken, getPayload, getDate } from "@/utils";
import { defaultError } from "@/utils";

export default {
    setup() {
        const router = useRouter();
        const payload = getPayload();

        if (payload == undefined) {
            router.push({ name: "Home" });

            return {
                display: false,
            };
        }

        const creation_date = ref(0);
        const tos_agree_date = ref(0);
        const memo_count = ref(0);

        axios({
            method: "GET",
            url: `${api.host}/dashboard`,
            headers: {
                Authorization: getToken(),
            },
        })
            .then((e) => {
                const data = e.data;

                creation_date.value = data.data.creation_date;
                tos_agree_date.value = data.data.tos_agree_date;
                memo_count.value = data.data.memo_count;
            })
            .catch((e) => defaultError(e));

        return {
            display: true,
            userInfo: payload.user,
            getDate,
            creation_date,
            tos_agree_date,
            memo_count,
        };
    },
};
</script>

<style scoped>
.button {
    margin-right: 10px;
}
</style>
