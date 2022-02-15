<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">공지사항</h1>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="field">
                <label class="label is-medium">제목</label>
                <div class="control">
                    <input
                        class="input is-medium"
                        type="text"
                        maxlength="40"
                        v-model="title"
                    />
                    <p class="help is-danger">
                        제목은 최대 40자까지 입력 가능합니다.
                    </p>
                </div>
            </div>

            <div class="field">
                <label class="label is-medium">본문</label>
                <div class="control">
                    <textarea class="textarea" v-model="text"></textarea>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div>
                <button
                    class="button is-link is-large is-fullwidth"
                    @click="btnHandle()"
                >
                    저장하기
                </button>
            </div>
        </div>
    </section>
</template>

<script>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import { api } from "@/config";
import { getToken, defaultError } from "@/utils";

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const id = route.params.id;
        const title = ref("");
        const text = ref("");

        const fetchNotice = () => {
            axios({
                method: "GET",
                url: `${api.host}/notice/${id}`,
            })
                .then((e) => {
                    const data = e.data;
                    title.value = data.data.title;
                    text.value = data.data.text;
                })
                .catch((e) => defaultError(e));
        };

        fetchNotice();

        const btnHandle = () => {
            axios({
                method: "POST",
                url: `${api.host}/notice/${id}`,
                headers: {
                    Authorization: getToken(),
                },
                data: {
                    title: title.value,
                    text: text.value,
                },
            })
                .then((e) => {
                    const data = e.data;
                    Swal.fire({
                        icon: "success",
                        text: data.meta.message,
                        timer: 2022,
                        timerProgressBar: true,
                    }).then(() => {
                        router.push({
                            name: "Notice.View",
                            params: {
                                id: id,
                            },
                        });
                    });
                })
                .catch((e) => defaultError(e));
        };

        return {
            title,
            text,
            btnHandle,
        };
    },
};
</script>
