<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">서비스 이용약관</h1>
            <div class="content is-large">
                <p>{{ getDate(date) }}</p>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="content is-medium" v-html="text"></div>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { parse } from "marked";
import { api } from "@/config";
import { defaultError, getDate } from "@/utils";

export default {
    setup() {
        const date = ref(0);
        const text = ref("");

        const fetchToS = () => {
            axios({
                method: "GET",
                url: `${api.host}/tos`,
            })
                .then((e) => {
                    const data = e.data;
                    date.value = data.data.date;
                    text.value = parse(data.data.text);
                })
                .catch((e) => defaultError(e));
        };

        fetchToS();

        return {
            date,
            getDate,
            text,
        };
    },
};
</script>
