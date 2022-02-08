<template>
    <h1>
        Callback Code is <b>{{ code }}</b>
    </h1>
</template>

<script>
import { useRoute } from "vue-router";

export default {
    setup() {
        const route = useRoute();

        return {
            code: route.query.code,
        };
    },
};
</script>
