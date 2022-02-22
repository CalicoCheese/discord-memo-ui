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
                <router-link
                    class="button is-link is-large is-fullwidth"
                    :to="{ name: 'Auth.Logout' }"
                >
                    로그아웃
                </router-link>
            </div>
            <div class="content is-large" v-else>
                <p>
                    계정 정보를 확인하고 수정하려면
                    <span class="has-text-link">로그인</span>해야 합니다.
                </p>
                <router-link
                    class="button is-link is-large is-fullwidth"
                    :to="{ name: 'Auth.Move' }"
                >
                    로그인
                </router-link>
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

            <router-link
                class="button is-warning is-medium"
                :to="{ name: 'Dashboard.Clear' }"
            >
                모든 메모 삭제
            </router-link>
            <router-link
                class="button is-dark is-medium"
                :to="{ name: 'Dashboard.Delete.@me' }"
            >
                계정 삭제
            </router-link>
            <router-link
                class="button is-primary is-medium"
                :to="{ name: 'Memo' }"
            >
                메모 보러가기
            </router-link>
        </div>
    </section>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { api } from "@/config";
import { getToken, getPayload, getDate } from "@/utils";
import { defaultError } from "@/utils";

export default {
    name: "dashboard-view-my-info",
    setup() {
        const payload = getPayload();

        // 잘못된 인증토큰 또는 로그인 상태가 아님
        if (payload == undefined) {
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
            .then((resp) => {
                const data = resp.data;

                creation_date.value = data.data.creation_date;
                tos_agree_date.value = data.data.tos_agree_date;
                memo_count.value = data.data.memo_count;
            })
            .catch((err) => defaultError(err));

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
    margin-right: 5px;
}
</style>
