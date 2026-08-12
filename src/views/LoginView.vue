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
    const password = ref('');

    // A computed property to determine if the submit button should be enabled
    const isActive = computed(() => {
        return email.value !== '' && password.value !== '';
    });

    function authenticate() {
        api.post('/users/login', {
            email: email.value,
            password: password.value
        })
        .then(response => {
            if(response.data.access !== undefined){
                localStorage.setItem('token', response.data.access);
                retrieveUserDetails(response.data.access);

                // Clear input fields after submission
                email.value = '';
                password.value = '';

                notyf.success('Successful Login');
            }
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

    function retrieveUserDetails(token) {
        // The token will be sent as part of the request's header information
        api.get('/users/details')
        .then(response => {
            console.log(response.data);

            // Changes the global user state in Pinia to store the id
            userStore.setUser({
                id: response.data.user._id,
                username: response.data.user.username,
                isAdmin: response.data.user.isAdmin
            });

            console.log(userStore.user);
            
            // Redirect to a different page after successful login
            router.push('/');
        })
        .catch(error => {
            console.error("Failed to retrieve user details:", error);
            notyf.error("Could not fetch user details.");
        });
    };

    // If the user is already logged in, redirect them away from the login page.
    onMounted(() => {
        if (userStore.user.id) {
            router.push('/');
        }
    });
</script>

<template>
    <div class="m-5 p-5 justify-content-center">
        <form @submit.prevent="authenticate">
            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" aria-describedby="emailHelp" v-model="email">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="password">
            </div>
            <button :disabled="!isActive" type="submit" class="btn btn-primary" :class="isActive ? 'btn-primary' : 'btn-danger'">Login</button>
        </form>
    </div>
</template>
