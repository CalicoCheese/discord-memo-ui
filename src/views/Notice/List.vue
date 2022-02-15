<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">공지사항</h1>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="content is-large">
                <router-link
                    v-for:="notice in notices"
                    :to="{ name: 'Notice.View', params: { id: notice.id } }"
                >
                    {{ getDate(notice.date) }} {{ notice.title }}
                </router-link>
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
import { defaultError } from "@/utils";

export default {
    setup() {
        const lastId = ref(0);
        const notices = ref({});

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
                    let this_lastId = lastId.value;

                    data.data.forEach((n) => {
                        notices.value[n.id] = n;
                        this_lastId = n.id;
                    });

                    lastId.value = this_lastId;
                })
                .catch((e) => defaultError(e));
        };

        fetchNotice();

        return {
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
