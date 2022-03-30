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

    // ToS part
    {
        path: "/tos",
        name: "ToS.View",
        component: () =>
            import(/* webpackChunkName: "tos" */ "@/views/ToS/View.vue"),
    },

    // Privacy part
    {
        path: "/privacy",
        name: "Privacy.View",
        component: () =>
            import(
                /* webpackChunkName: "privacy" */ "@/views/Privacy/View.vue"
            ),
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
            import(/* webpackChunkName: "memo" */ "@/views/Memo/Memo.vue"),
    },

    // Dashboard part
    {
        path: "/dashboard",
        name: "Dashboard.View",
        component: () =>
            import(
                /* webpackChunkName: "dashboard" */ "@/views/Dashboard/View.vue"
            ),
    },
    {
        path: "/dashboard/clear-memo",
        name: "Dashboard.Clear",
        component: () =>
            import(
                /* webpackChunkName: "dashboard" */ "@/views/Dashboard/Clear.vue"
            ),
    },
    {
        path: "/dashboard/delete-user",
        name: "Dashboard.Delete",
        component: () =>
            import(
                /* webpackChunkName: "dashboard" */ "@/views/Dashboard/Delete.vue"
            ),
    },

    // Admin part
    {
        path: "/admin/users",
        name: "Admin.Users",
        component: () =>
            import(/* webpackChunkName: "admin" */ "@/views/Admin/Users.vue"),
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
    scrollBehavior() {
        return { top: 0 };
    },
});

export default router;
