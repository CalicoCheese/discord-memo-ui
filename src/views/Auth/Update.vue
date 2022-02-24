<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">사용자 등록</h1>
            <div class="content is-large">
                <p>
                    메모 서비스를 이용하려면
                    <b class="has-text-link">서비스 이용약관</b>과
                    <b class="has-text-link">개인정보 처리방침</b>을 읽고
                    동의해야합니다.
                </p>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h1 class="title is-1">서비스 이용약관</h1>
            <div class="content" v-html="tos"></div>
            <div class="field">
                <div class="control">
                    <label class="checkbox">
                        <input type="checkbox" v-model="tos_agree" />
                        나는
                        <b class="has-text-link">서비스 이용약관</b>을
                        <b class="has-text-info">확인</b>하였으며
                        <b class="has-text-info">동의</b>합니다.
                    </label>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h1 class="title is-1">개인정보 처리방침</h1>
            <div class="content" v-html="privacy"></div>
            <div class="field">
                <div class="control">
                    <label class="checkbox">
                        <input type="checkbox" v-model="pri_agree" />
                        나는
                        <b class="has-text-link">개인정보 처리방침</b>을
                        <b class="has-text-info">확인</b>하였으며
                        <b class="has-text-info">동의</b>합니다.
                    </label>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="flied">
                <div class="control">
                    <button
                        class="button is-link is-large is-fullwidth"
                        @click="on_next()"
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { parse } from "marked";
import axios from "axios";
import Swal from "sweetalert2";
import { api } from "@/config";
import { getToken, login } from "@/utils";
import { defaultError } from "@/utils";

export default {
    name: "auth-update",
    setup() {
        const router = useRouter();

        if (!login()) {
            router.push({ name: "Home" });
            return {};
        }

        // flag
        const tos_agree = ref(false);
        const pri_agree = ref(false);

        // data
        const tos_date = ref(0);
        const pri_date = ref(0);

        // html
        const tos = ref("<p>잠시만요! 불러오고 있습니다...</p>");
        const privacy = ref("<p>잠시만요! 불러오고 있습니다...</p>");

        const fetchHTML = () => {
            axios({
                method: "GET",
                baseURL: api.host,
                url: `/tos`,
            })
                .then((resp) => {
                    const data = resp.data;
                    tos.value = parse(data.data.text);
                    tos_date.value = data.data.date;
                })
                .catch((err) => defaultError(err));

            axios({
                method: "GET",
                baseURL: api.host,
                url: `/privacy`,
            })
                .then((resp) => {
                    const data = resp.data;
                    privacy.value = parse(data.data.text);
                    pri_date.value = data.data.date;
                })
                .catch((err) => defaultError(err));
        };

        fetchHTML();

        const on_next = () => {
            const fire = (message) => {
                Swal.fire({
                    icon: "error",
                    text: message,
                    timer: 2022,
                    timerProgressBar: true,
                });
            };

            if (!tos_agree.value) {
                fire("서비스 이용약관에 동의해야합니다.");
            } else if (!pri_agree.value) {
                fire("개인정보 처리방침에 동의해야합니다.");
            } else {
                axios({
                    method: "POST",
                    url: `${api.host}/auth/update`,
                    headers: {
                        Authorization: getToken(),
                    },
                    data: {
                        tos: tos_date.value,
                        privacy: pri_date.value,
                    },
                })
                    .then((resp) => {
                        const data = resp.data;

                        Swal.fire({
                            icon: "success",
                            text: data.meta.message,
                        }).then(() => {
                            router.push({ name: "Memo" });
                        });
                    })
                    .catch((err) => {
                        if (err.response == undefined) {
                            fire("알 수 없는 오류가 발생했습니다.");
                            Swal.fire({
                                icon: "error",
                                text: "알 수 없는 오류가 발생했습니다.",
                                timer: 2022,
                                timerProgressBar: true,
                            }).then(() => {
                                router.push({ name: "Home" });
                            });
                        } else {
                            const data = err.response.data;
                            if (data.data) {
                                Swal.fire({
                                    icon: "info",
                                    text: data.meta.message,
                                    timer: 2022,
                                    timerProgressBar: true,
                                }).then(() => {
                                    router.push({ name: "Memo" });
                                });
                            } else {
                                fire(data.meta.message);
                            }
                        }
                    });
            }
        };

        return {
            tos,
            privacy,
            tos_agree,
            pri_agree,
            on_next,
        };
    },
};
</script>

<style scoped>
label {
    font-size: 20px;
}
</style>
