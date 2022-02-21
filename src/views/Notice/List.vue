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
            <nav class="pagination is-centered">
                <ul class="pagination-list">
                    <li v-for:="p in pages">
                        <button
                            v-if="p == page"
                            class="pagination-link is-current"
                            @click="setPage(p)"
                        >
                            {{ p }}
                        </button>
                        <button
                            v-else
                            class="pagination-link"
                            @click="setPage(p)"
                        >
                            {{ p }}
                        </button>
                    </li>
                </ul>
            </nav>
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
        const notices = ref([]);
        const page = ref(0);
        const max_page = ref(0);
        const pages = ref([]);

        const updatePages = () => {
            pages.value = [];

            if (page.value != 1) {
                let min = page.value - 5;
                while (min <= 0) {
                    min += 1;
                }

                for (
                    let numberOfPage = min;
                    numberOfPage < page.value;
                    numberOfPage++
                ) {
                    pages.value.push(numberOfPage);
                }
            }

            let max = max_page.value - 5;
            while (max - page.value <= 5) {
                max += 1;
            }
            while (max - page.value > 5) {
                max -= 1;
            }

            if (max > max_page.value) {
                max -= max - max_page.value;
            }

            for (
                let numberOfPage = page.value;
                numberOfPage <= max;
                numberOfPage++
            ) {
                pages.value.push(numberOfPage);
            }
        };

        const fetchNotice = () => {
            axios({
                method: "GET",
                url: `${api.host}/notice`,
                params: {
                    page: page.value,
                },
            })
                .then((resp) => {
                    const data = resp.data;

                    Object.assign(notices.value, data.data.notice);

                    page.value = data.data.page.this;
                    max_page.value = data.data.page.max;

                    updatePages();
                })
                .catch((err) => defaultError(err));
        };

        fetchNotice();

        return {
            isAdmin: isAdmin(),
            notices,
            getDate,
            page,
            pages,
            setPage: (newPageNumber) => {
                page.value = newPageNumber;
                fetchNotice();
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
