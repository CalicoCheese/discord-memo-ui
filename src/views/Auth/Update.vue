<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">사용자 등록</h1>
            <div class="content is-large">
                <p>
                    메모 서비스를 이용하려면 서비스 이용약관과 개인정보
                    처리방침을 읽고 동의해야합니다.
                </p>
            </div>

            <div class="field">
                <div class="control">
                    <label class="checkbox">
                        <input type="checkbox" v-model="tos_agree" />
                        나는
                        <router-link
                            :to="{ name: 'ToS.View' }"
                            target="_blank"
                            @click="tos_read = true"
                        >
                            서비스 이용약관
                        </router-link>
                        을 읽었으며 동의합니다.
                    </label>
                </div>

                <div class="control is-medium">
                    <label class="checkbox">
                        <input type="checkbox" v-model="pri_agree" />
                        나는
                        <router-link
                            :to="{ name: 'Privacy.View' }"
                            target="_blank"
                            @click="pri_read = true"
                        >
                            개인정보 처리방침
                        </router-link>
                        을 읽었으며 동의합니다.
                    </label>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="flied">
                <div class="control">
                    <button class="button is-link is-medium" @click="on_next()">
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
import axios from "axios";
import Swal from "sweetalert2";
import { api } from "@/config";
import { getToken, login } from "@/utils";

export default {
    name: "auth-update",
    setup() {
        const router = useRouter();
        const tos_agree = ref(false);
        const pri_agree = ref(false);
        const tos_read = ref(false);
        const pri_read = ref(false);

        if (!login()) {
            Swal.fire({
                icon: "error",
                text: "올바른 접근이 아닙니다.",
                timer: 2022,
                timerProgressBar: true,
            }).then(() => {
                router.push({ name: "Home" });
            });
        }

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
            } else if (!tos_read.value) {
                fire("서비스 이용약관을 확인해야합니다.");
            } else if (!pri_agree.value) {
                fire("개인정보 처리방침에 동의해야합니다.");
            } else if (!pri_read.value) {
                fire("개인정보 처리방침을 확인해야합니다.");
            } else {
                axios({
                    method: "POST",
                    url: `${api.host}/auth/update`,
                    headers: {
                        Authorization: getToken(),
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
            tos_agree,
            pri_agree,
            tos_read,
            pri_read,
            on_next,
        };
    },
};
</script>
