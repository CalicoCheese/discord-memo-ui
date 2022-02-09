import { createRouter, createWebHistory } from "vue-router";

const routes = [
    // Home part
    {
        path: "/",
        name: "Home",
        component: () =>
            import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
    },

    // Notice part
    {
        path: "/notice/:id",
        name: "Notice",
        component: () =>
            import(/* webpackChunkName: "notice" */ "@/views/Notice.vue"),
        props: true,
    },

    // ToS part
    {
        path: "/tos",
        name: "ToS",
        component: () =>
            import(/* webpackChunkName: "tos" */ "@/views/Tos.vue"),
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
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
