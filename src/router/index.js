import { createRouter, createWebHistory } from "vue-router";

const routes = [
    // Home part
    {
        path: "/",
        name: "Home",
        component: () =>
            import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
    },
    {
        path: "/invite-bot",
        name: "Invite",
        component: () =>
            import(/* webpackChunkName: "home" */ "@/views/Invite.vue"),
    },

    // Notice part
    {
        path: "/notice/:id",
        name: "Notice",
        component: () =>
            import(/* webpackChunkName: "notice" */ "@/views/Notice.vue"),
        props: true,
    },

    // ToS and Privacy part
    {
        path: "/tos",
        name: "ToS",
        component: () =>
            import(/* webpackChunkName: "tos" */ "@/views/Tos.vue"),
        props: true,
    },
    {
        path: "/privacy",
        name: "privacy",
        component: () =>
            import(/* webpackChunkName: "tos" */ "@/views/Privacy.vue"),
        props: true,
    },

    // Auth part
    {
        path: "/auth",
        name: "Auth",
        component: () =>
            import(/* webpackChunkName: "auth" */ "@/views/Auth/Move.vue"),
    },
    {
        name: "Logout",
        path: "/auth/logout",
        component: () =>
            import(/* webpackChunkName: "auth" */ "@/views/Auth/Logout.vue"),
    },
    {
        name: "Update",
        path: "/auth/update",
        component: () =>
            import(/* webpackChunkName: "auth" */ "@/views/Auth/Update.vue"),
    },
    {
        path: "/auth/callback",
        component: () =>
            import(/* webpackChunkName: "auth" */ "@/views/Auth/Callback.vue"),
    },

    // Memo part
    {
        path: "/memo",
        name: "Memo",
        component: () =>
            import(/* webpackChunkName: "memo" */ "@/views/Memo.vue"),
    },
    {
        path: "/memo/password",
        name: "Password",
        component: () =>
            import(/* webpackChunkName: "memo" */ "@/views/Password.vue"),
    },

    // 404
    {
        path: "/:catchAll(.*)*",
        redirect: "/",
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
