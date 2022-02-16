<template>
    <section class="section">
        <div class="container">
            <div class="is-hidden-desktop">
                <h1 class="title is-1 nb">비밀번호를</h1>
                <h1 class="title is-1 nu">입력해주세요</h1>
            </div>

            <div class="is-hidden-touch">
                <h1 class="title is-1">비밀번호를 입력해주세요</h1>
            </div>

            <div class="content is-medium">
                <ol>
                    <li>비밀번호의 길이는 <b>6자</b> 이상 이어야 합니다.</li>
                    <li>
                        비밀번호는 클라이언트에 저장됨으로 메모 사용 후 반드시
                        로그아웃 해야 합니다.
                    </li>
                </ol>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="field">
                <input
                    id="pw-box"
                    class="input is-large"
                    type="password"
                    v-model="password"
                    @keypress.enter="onConfirm()"
                />
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <button
                class="button is-info is-large is-fullwidth"
                @click="onConfirm()"
            >
                다음
            </button>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createHash } from "crypto";
import { api } from "@/config";
import { getToken, login } from "@/utils";
import { getPassword, setPassword } from "@/utils";
import { defaultError } from "@/utils";

export default {
    setup() {
        const sha512 = createHash("sha512");

        const router = useRouter();
        const method = ref("GET");
        const password = ref("");

        // 비밀번호를 입력 받았다면 메모 페이지로 이동
        if (getPassword() != undefined) {
            router.push({ name: "Memo" });
        }

        const onConfirm = () => {
            if (password.value.length >= 6) {
                const hash = sha512.update(password.value).digest("hex");

                axios({
                    url: `${api.host}/auth/password`,
                    method: method.value,
                    headers: {
                        Authorization: getToken(),
                        "x-dm-password": hash,
                    },
                })
                    .then((e) => {
                        const data = e.data;
                        setPassword(hash);

                        Swal.fire({
                            icon: "success",
                            text: data.meta.message,
                            timer: 2022,
                            timerProgressBar: true,
                        }).then(() => {
                            router.push({ name: "Memo" });
                        });
                    })
                    .catch((e) => defaultError(e));
            } else {
                Swal.fire({
                    icon: "warning",
                    text: "메모 비밀번호는 6자 이상 길게 설정해야 합니다.",
                    timer: 2022,
                    timerProgressBar: true,
                });
            }
        };

        if (!login()) {
            Swal.fire({
                icon: "warning",
                text: "메모를 확인하려면 로그인해야 합니다.",
                timer: 2022,
                timerProgressBar: true,
                showConfirmButton: false,
            }).then(() => {
                router.push({ name: "Home" });
            });
        } else {
            axios({
                url: `${api.host}/auth/check`,
                method: "GET",
                headers: {
                    Authorization: getToken(),
                },
            })
                .then((e) => {
                    const data = e.data;

                    if (data.data.password) {
                        // 비밀번호 설정이 필요함
                        method.value = "POST";
                    } else {
                        method.value = "GET";
                    }
                })
                .catch((e) => defaultError(e));
        }

        return {
            password,
            onConfirm,
        };
    },
};
</script>

<style scoped>
.nb {
    /* No margin Bottom */
    margin-bottom: 0;
}
.nu {
    /* No margin Up */
    margin-top: 0;
}
</style>
