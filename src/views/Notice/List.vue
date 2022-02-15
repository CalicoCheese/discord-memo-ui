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
                        {{ notice.title }}
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
import { defaultError, isAdmin } from "@/utils";

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

                    data.data.forEach((n) => {
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
            getDate: (ts) => {
                // ts == TimeStamp
                let d = new Date(ts * 1000);
                return d.toLocaleDateString();
            },
        };
    },
};
</script>

<style scoped>
span {
    margin-right: 5px;
}
</style>
