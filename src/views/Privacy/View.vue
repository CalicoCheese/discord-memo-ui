<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">개인정보 처리방침</h1>
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
    name: "view-privacy",
    setup() {
        const date = ref(0);
        const text = ref("");

        const fetchToS = () => {
            axios({
                method: "GET",
                url: `${api.host}/privacy`,
            })
                .then((resp) => {
                    const data = resp.data;
                    date.value = data.data.date;
                    text.value = parse(data.data.text);
                })
                .catch((err) => defaultError(err));
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
