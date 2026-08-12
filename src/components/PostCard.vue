<script setup>
    import router from '@/router';

    function postDetails(id) {
        router.push(`/post/${id}`)
    }
</script>

<script>
    export default {
        props: {
            postData: Object
        }
    }
</script>

<template>
    <div class="card col-12" style="width: 30vw;" v-on:click="postDetails(postData._id)">
        <div class="card-body">
            <h5 class="card-title">{{ postData.title }}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">{{ postData.authorInfo }}</h6>
            <hr>
            <p class="card-text">{{ postData.content }}</p>
        </div>
    </div>
</template>