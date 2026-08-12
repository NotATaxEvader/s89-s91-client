<template>
    <div class="m-5 p-5 justify-content-center">
        <form @submit.prevent="registration">
            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" aria-describedby="emailHelp" v-model="email">
                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" v-model="username">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="password">
            </div>
            <div class="mb-3">
                <label for="conPassword" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="conPassword" v-model="conPassword">
            </div>
            <button :disabled="!isActive" type="submit" class="btn btn-primary" :class="isActive ? 'btn-primary' : 'btn-danger'">Register</button>
        </form>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { Notyf } from 'notyf';
    import axios from 'axios';
    import { useUserStore } from '@/stores/user';
    import api from '@/api';

    const token = localStorage.getItem("token")

    const notyf = new Notyf();
    const router = useRouter();
    const userStore = useUserStore();

    // State for the input fields, using ref for reactivity
    const email = ref('');
    const username = ref('');
    const password = ref('');
    const conPassword = ref('');

    // A computed property to determine if the submit button should be enabled
    const isActive = computed(() => {
        if(email.value !== '' && username.value !== '' && password.value !== ''){
            if(password.value === conPassword.value)
                return true
            else
                return false
        } else
            return false
    });

    function registration() {
        api.post('/users/register', {
            email: email.value,
            username: username.value,
            password: password.value
        })
        .then(response => {
            if(response){
                // Clear input fields after submission
                email.value = '';
                username.value = '';
                password.value = '';
                conPassword.value = '';

                notyf.success("Registration Successful")

                router.push("/login")
            }
        })
        .catch(error => {
            console.error(error);
            const message = error.response?.data?.message;
            console.error(message);
            notyf.error('Something Went Wrong! Try Again');
        });
    }

    // If the user is already logged in, redirect them away from the login page.
    onMounted(() => {
        console.log(token)
        if (userStore.user.id) {
            router.push('/');
        }
    });
</script>