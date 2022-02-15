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
        path: "/notice",
        name: "Notice.List",
        component: () =>
            import(/* webpackChunkName: "notice" */ "@/views/Notice/List.vue"),
    },
    {
        path: "/notice/:id",
        name: "Notice.View",
        component: () =>
            import(/* webpackChunkName: "notice" */ "@/views/Notice/View.vue"),
        props: true,
    },
    {
        path: "/notice/:id/edit",
        name: "Notice.Edit",
        component: () =>
            import(/* webpackChunkName: "notice" */ "@/views/Notice/Edit.vue"),
        props: true,
    },
    {
        path: "/notice/:id/delete",
        name: "Notice.Delete",
        component: () =>
            import(
                /* webpackChunkName: "notice" */ "@/views/Notice/Delete.vue"
            ),
        props: true,
    },
    {
        path: "/notice/new",
        name: "Notice.New",
        component: () =>
            import(/* webpackChunkName: "notice" */ "@/views/Notice/New.vue"),
        props: true,
    },

    // ToS and Privacy part
    {
        path: "/tos",
        name: "ToS.View",
        component: () =>
            import(/* webpackChunkName: "tos" */ "@/views/ToS/View.vue"),
    },
    {
        path: "/tos/add",
        name: "ToS.Add",
        component: () =>
            import(/* webpackChunkName: "tos" */ "@/views/ToS/Add.vue"),
    },
    {
        path: "/tos/:id/delete",
        name: "ToS.Delete",
        component: () =>
            import(/* webpackChunkName: "tos" */ "@/views/ToS/Delete.vue"),
    },

    // Privacy part
    {
        path: "/privacy",
        name: "Privacy",
        component: () =>
            import(/* webpackChunkName: "privacy" */ "@/views/Privacy.vue"),
        props: true,
    },

    // Auth part
    {
        path: "/auth",
        name: "Auth.Move",
        component: () =>
            import(/* webpackChunkName: "auth" */ "@/views/Auth/Move.vue"),
    },
    {
        path: "/auth/logout",
        name: "Auth.Logout",
        component: () =>
            import(/* webpackChunkName: "auth" */ "@/views/Auth/Logout.vue"),
    },
    {
        path: "/auth/update",
        name: "Auth.Update",
        component: () =>
            import(/* webpackChunkName: "auth" */ "@/views/Auth/Update.vue"),
    },
    {
        path: "/auth/callback",
        // name: "Auth.Callback",  // name is not required!
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
        name: "Memo.Password",
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
