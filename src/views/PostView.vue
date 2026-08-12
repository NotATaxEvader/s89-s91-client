<script setup>

import { reactive, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Notyf } from 'notyf';
import { useUserStore } from '@/stores/user';
import api from '@/api';

const notyf = new Notyf();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const token = localStorage.getItem("token")

const id = route.params.id;

console.log(id)

const post = reactive({data:[]})
const isVisible = ref(false);
const editVisible = ref(false);

const title = ref('');
const content = ref('');
const authorInfo = ref(0);
const creationDate = ref('');

const comment = ref('');

const fetchPost = async () => {
    let { data } = await api.get(`/posts/${id}`);
    post.data = data;
    console.log(post.data)

    title.value = post.data.title;
    content.value = post.data.content;
    authorInfo.value = post.data.authorInfo;
    creationDate.value = post.data.creationDate;
}

function showForm() {
    isVisible.value = !isVisible.value
}

function showEditForm() {
    editVisible.value = !editVisible.value
}

function adminOrUser () {
    if(userStore.user.id){
        if (userStore.user.id === post.data.authorInfo)
            return true;
        else if (userStore.user.isAdmin)
            return true
        else
            return false
    }
}

function deletePost () {
    api.delete(`/posts/delete/${id}`)
        .then(response => {
            if(response.data !== "Action Forbidden"){
                // Clear input fields after submission
                notyf.success("Post Deleted Successful")

                router.push("/");
            } else 
                notyf.error('Invalid Credentials');
        })
        .catch(error => {
            console.error(error);
            const message = error.response?.data?.message;
            notyf.error('Error Deleting Movie. Try Again');
        });
}

function editPost() {
    api.patch(`/posts/update/${id}`, {
        title: title.value,
        content: content.value
    })
    .then(response => {
        if(response){
            // Clear input fields after submission
            title.value = '';
            content.value = '';

            notyf.success("Post Edited Successful")

            fetchPost();
            showEditForm();
        }
    })
    .catch(error => {
        console.error(error);
        const message = error.response?.data?.message;
        notyf.error('Something Happened. Try Again');
    });
}

function addComment() {
    api.patch(`/posts/addComment/${id}`, {
            comment: comment.value
        })
        .then(response => {
            if(response.data !== "Action Forbidden"){
                // Clear input fields after submission
                comment.value = '';

                notyf.success("Comment Added Successful")

                router.go();
            } else 
                notyf.error('Invalid Credentials');
        })
        .catch(error => {
            console.error(error);
            const message = error.response?.data?.message;
            if (message === "Incorrect email or password") {
                notyf.error('Incorrect Credentials. Try Again');
            } else {
                notyf.error('User Not Found. Try Again.');
            }
        });
}

onMounted(fetchPost)
</script>

<template>
    <div class="d-flex flex-column align-items-center">
    <div class="m-5 p-4 border rounded-3" style="width: 46vw;" >
        <h1>{{ post.data.title }}</h1>
        <h5>Author: {{ post.data.authorInfo }}</h5>
        <h5>Created On: {{ post.data.creationDate }}</h5>
        <button class="btn btn-danger" v-on:click="deletePost" v-if="adminOrUser">Delete Post</button>
        <button class="btn btn-warning ms-4" v-on:click="showEditForm" v-if="adminOrUser">Edit Post</button>

        <form @submit.prevent="editPost" class="p-5" :hidden="!editVisible">
            <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input type="text" class="form-control" id="title" aria-describedby="emailHelp" v-model="title">
            </div>
            <div class="mb-3">
                <label for="content" class="form-label">Content</label>
                <input type="text" class="form-control" id="content" :placeholder="post.data.content" v-model="content">
            </div>
            <button type="submit" class="btn btn-warning">Edit Post</button>
        </form>

        <hr>
        <h6 class="mt-3">Content:</h6>
        <p class="mb-3">{{ post.data.content }}</p>
        <hr>
        <h6 class="mt-3">Comments</h6>

        <button class="btn btn-warning" v-on:click="showForm" v-if="userStore.user.id && !userStore.user.isAdmin">Add Comment</button>
        <form @submit.prevent="addComment" class="p-5" :hidden="!isVisible">
            <div class="mb-3">
                <label for="comment" class="form-label">Add Comment</label>
                <textarea type="textarea" class="form-control" id="comment" v-model="comment"></textarea>
            </div>
            <button :disabled="!comment" type="submit" class="btn btn-primary" :class="comment ? 'btn-primary' : 'btn-danger'">Add Comment</button>
        </form>

        <div v-for="comment in post.data.comments" class="p-4">
            <div class="m-1 p-3 border rounded-5">
                <h4>{{ comment.username }}</h4>
                <hr>
                <p>{{ comment.comment }}</p>
            </div>
        </div>
    </div>
    </div>
</template>