<script setup>
    import router from '@/router';
    import { useUserStore } from '@/stores/user';
    import { onMounted } from 'vue';

    const userStore = useUserStore();

    onMounted(() => {
        localStorage.removeItem("token");
        userStore.unsetUser();
        router.push("/")
    })
</script>

<template>

</template>