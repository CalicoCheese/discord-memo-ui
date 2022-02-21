<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">{{ title }}</h1>
            <div class="content is-large">
                <p>{{ date }}</p>
            </div>

            <div v-if="isAdmin == true">
                <router-link
                    class="button is-medium is-info"
                    :to="{ name: 'Notice.Edit', params: { id: id } }"
                    >수정</router-link
                >
                <router-link
                    class="button is-medium is-danger"
                    :to="{ name: 'Notice.Delete', params: { id: id } }"
                >
                    삭제
                </router-link>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="content is-medium" v-html="text"></div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <router-link
                class="button is-link is-large is-fullwidth"
                :to="{ name: 'Notice.List' }"
            >
                목록으로 돌아가기
            </router-link>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { Renderer, parse } from "marked";
import { api } from "@/config";
import { defaultError, getDate } from "@/utils";
import { isAdmin } from "@/utils";

export default {
    setup() {
        const route = useRoute();
        const id = route.params.id;

        const title = ref("공지사항");
        const text = ref();
        const date = ref();

        const renderer = new Renderer();
        renderer.link = (href, title, text) => {
            let url = new URL(href);
            let target = "_blank";
            if (window.location.host == url.host) {
                target = "_self";
            }
            return `<a target="${target}" rel="noreferrer" href="${href}">${text}</a>`;
        };

        const fetchNotice = () => {
            axios({
                method: "GET",
                url: `${api.host}/notice/${id}`,
            })
                .then((resp) => {
                    const data = resp.data;
                    title.value = data.data.title;
                    text.value = parse(data.data.text);
                    date.value = getDate(data.data.date);
                })
                .catch((err) => defaultError(err));
        };

        fetchNotice();

        return {
            id,
            title,
            text,
            date,
            isAdmin: isAdmin(),
        };
    },
};
</script>

<style scoped>
.button {
    margin-right: 5px;
}
</style>
