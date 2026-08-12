<script setup>
import api from '@/api';
import PostCard from '@/components/PostCard.vue';
import { useUserStore } from '@/stores/user';
import { Notyf } from 'notyf';
import { onMounted, reactive, ref } from 'vue';

const posts = reactive({ data: [] })

const notyf = new Notyf();
const user = useUserStore().user;

const title = ref('');
const content = ref('');
const addVisible = ref(false);

const fetchPosts = async() => {
    let { data } = await api.get("/posts/all");
    posts.data = data.posts;
    console.log(posts.data);
}

function showAddForm () {
    addVisible.value = !addVisible.value;
}

function addPost () {
    api.post('/posts/', {
        title: title.value,
        content: content.value
    })
    .then(response => {
        if(response){
            // Clear input fields after submission
            title.value = '';
            content.value = '';

            notyf.success("Post Added Successful")

            fetchPosts();
        }
    })
    .catch(error => {
        console.error(error);
        const message = error.response?.data?.message;
        notyf.error('Something Happened. Try Again');
    });
}

onMounted(fetchPosts)
</script>

<template>
    <div class="d-flex flex-column align-items-center p-5 gap-5">
        <div class="d-flex flex-column align-items-center">
            <button class="btn btn-primary mb-5" v-on:click="showAddForm" style="width: 30vw;" v-if="user.id">Add Post</button>

            <form @submit.prevent="addPost" :hidden="!addVisible" style="width: 30vw;">
                <div class="mb-3">
                    <label for="title" class="form-label">Title</label>
                    <input type="text" class="form-control" id="title" v-model="title">
                </div>
                <div class="mb-3">
                    <label for="content" class="form-label">Content</label>
                    <input type="text" class="form-control" id="content" v-model="content">
                </div>
                <button type="submit" class="btn btn-warning">Add Movie</button>
            </form>
        </div>

        <PostCard v-for="post in posts.data" :postData="post"/>
    </div>
</template>
