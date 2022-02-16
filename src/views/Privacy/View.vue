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
            <div class="content is-large" v-html="text"></div>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { parse } from "marked";
import { api } from "@/config";
import { defaultError } from "@/utils";

export default {
    setup() {
        const date = ref(0);
        const text = ref("");

        const getDate = (ts) => {
            // ts == TimeStamp
            let d = new Date(ts * 1000);
            return d.toLocaleDateString();
        };

        const fetchToS = () => {
            axios({
                method: "GET",
                url: `${api.host}/privacy`,
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
