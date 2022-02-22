<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">공지사항</h1>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="field">
                <label class="label is-medium">형식</label>
                <div class="control">
                    <div class="select">
                        <select v-model="type">
                            <option value="0">공지사항</option>
                            <option v-for:="n in notice" :value="n.code">
                                {{ n.text }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

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
                    <textarea
                        class="textarea has-fixed-size"
                        v-model="text"
                    ></textarea>
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
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import { api, notice } from "@/config";
import { getToken, defaultError } from "@/utils";

export default {
    name: "notice-edit",
    setup() {
        const route = useRoute();
        const router = useRouter();
        const id = route.params.id;
        const type = ref(0);
        const title = ref("");
        const text = ref("");

        watch(type, () => {
            if (type.value == 0) {
                title.value = "공지사항";
            } else {
                title.value = notice[type.value - 1].text;
            }
        });

        const fetchNotice = () => {
            axios({
                method: "GET",
                url: `${api.host}/notice/${id}`,
            })
                .then((resp) => {
                    const data = resp.data;
                    type.value = data.data.type;
                    title.value = data.data.title;
                    text.value = data.data.text;
                })
                .catch((err) => defaultError(err));
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
                    type: type.value,
                    title: title.value,
                    text: text.value,
                },
            })
                .then((resp) => {
                    const data = resp.data;
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
                .catch((err) => defaultError(err));
        };

        return {
            notice,
            type,
            title,
            text,
            btnHandle,
        };
    },
};
</script>

<style scoped>
.textarea {
    height: 1200px;
}
</style>
