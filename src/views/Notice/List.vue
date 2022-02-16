<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">공지사항</h1>
            <div v-if="isAdmin == true">
                <router-link
                    class="button is-info is-medium"
                    :to="{ name: 'Notice.New' }"
                >
                    작성하기
                </router-link>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="content is-large">
                <p v-for:="notice in notices">
                    <router-link
                        :to="{ name: 'Notice.View', params: { id: notice.id } }"
                    >
                        <span class="has-text-dark">
                            {{ getDate(notice.date) }}
                        </span>

                        <span v-if="notice.type == 0">
                            {{ notice.title }}
                        </span>
                        <b v-else>
                            {{ notice.title }}
                        </b>
                    </router-link>
                </p>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <button
                class="button is-link is-large is-fullwidth"
                @click="fetchNotice()"
            >
                더 불러오기
            </button>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { api } from "@/config";
import { defaultError, getDate } from "@/utils";
import { isAdmin } from "@/utils";

export default {
    setup() {
        const lastId = ref(0);
        const notices = ref([]);

        const fetchNotice = () => {
            axios({
                method: "GET",
                url: `${api.host}/notice`,
                params: {
                    after: lastId.value,
                },
            })
                .then((e) => {
                    const data = e.data;

                    data.data.notice.forEach((n) => {
                        notices.value.push(n);
                        lastId.value = n.id;
                    });
                })
                .catch((e) => defaultError(e));
        };

        fetchNotice();

        return {
            isAdmin: isAdmin(),
            fetchNotice,
            notices,
            getDate,
        };
    },
};
</script>

<style scoped>
span {
    margin-right: 5px;
}
</style>
