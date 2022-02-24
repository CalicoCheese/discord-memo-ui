<template>
    <section class="section">
        <div class="container">
            <h1 class="title is-1">유저 목록</h1>
            <div class="notification is-danger is-hidden-desktop">
                <b>주의!</b> 모바일 환경에서의 접속을 권장하지 않습니다.
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <table class="table is-fullwidth is-hoverable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>유저 식별자</th>
                        <th>메모 사용량</th>
                        <th>서비스 가입일</th>
                        <th>약관 동의일자</th>
                        <th>마지막 로그인 시간</th>
                        <th>마지막 로그인 시점</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for:="user in users">
                        <td v-html="getPermissionText(user.admin)"></td>
                        <td>{{ user.id }}</td>
                        <td>#</td>
                        <td>{{ getDate(user.creation_date) }}</td>
                        <td>{{ getDate(user.tos_agree_date) }}</td>
                        <td>{{ getDate(user.last_login) }}</td>
                        <td>{{ Math.round(user.flow / 86400) }} days</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <button
                class="button is-link is-large is-fullwidth"
                @click="fetchUsers()"
            >
                더 불러오기
            </button>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "@/config";
import { login, getToken } from "@/utils";
import { defaultError, getDate } from "@/utils";

export default {
    name: "admin-user-list",
    setup() {
        const router = useRouter();

        if (!login()) {
            router.push({ name: "Home" });
            return {};
        }

        const lastUserId = ref(0);
        const users = ref([]);

        const fetchUsers = () => {
            axios({
                method: "GET",
                url: `${api.host}/admin/users`,
                headers: {
                    Authorization: getToken(),
                },
                params: {
                    after: lastUserId.value,
                },
            })
                .then((resp) => {
                    const data = resp.data;
                    data.data.forEach((user) => {
                        users.value.push(user);
                        lastUserId.value = user.id;
                    });
                })
                .catch((err) => defaultError(err));
        };

        fetchUsers();

        return {
            users,
            getDate,
            getPermissionText: (is_admin) => {
                if (is_admin) {
                    return `<b class="has-text-danger">관리자</b>`;
                } else {
                    return `<span class="has-text-info">사용자</span>`;
                }
            },
            fetchUsers,
        };
    },
};
</script>
