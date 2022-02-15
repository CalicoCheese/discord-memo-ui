<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">서비스 이용약관</h1>
        </div>
    </section>

    <section class="section">
        <div class="container">
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
            <div class="columns">
                <div class="column">
                    <button
                        class="button is-info is-large is-fullwidth"
                        @click="btnHandle('edit')"
                    >
                        수정하기
                    </button>
                </div>

                <div class="column">
                    <button
                        class="button is-primary is-large is-fullwidth"
                        @click="btnHandle('new')"
                    >
                        등록하기
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { api } from "@/config";
import { getToken, defaultError } from "@/utils";

export default {
    setup() {
        const id = ref(0);
        const text = ref("");

        const fetchToS = () => {
            axios({
                method: "GET",
                url: `${api.host}/tos`,
                headers: {
                    "x-tos-before": Date.now() / 1000,
                },
            })
                .then((e) => {
                    const data = e.data;
                    id.value = data.data.id;
                    text.value = data.data.text;
                })
                .catch((e) => defaultError(e));
        };

        fetchToS();

        const btnHandle = (mode) => {
            let url = `${api.host}/tos/${id.value}`;
            if (mode == "new") {
                url = `${api.host}/tos`;
            } else if (id.value == 0){
                url = `${api.host}/tos`;
            }

            axios({
                method: "POST",
                url: url,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
                data: {
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
                    });
                })
                .catch((e) => defaultError(e));
        };

        return {
            text,
            btnHandle,
        };
    },
};
</script>
