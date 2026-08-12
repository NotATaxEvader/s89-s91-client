<script setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router'

import { useUserStore } from '@/stores/user';

const user = useUserStore().user;

console.log(user)

</script>

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">BirdApp</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <RouterLink class="nav-link active" aria-current="page" to="/">Home</RouterLink>
              </li>
              <li class="nav-item" v-if="!user.id">
                <RouterLink class="nav-link" to="/register">Register</RouterLink>
              </li>
              <li class="nav-item" v-if="!user.id">
                <RouterLink class="nav-link" to="/login">Login</RouterLink>
              </li>
              <li class="nav-item" v-if="user.id">
                <RouterLink class="nav-link" to="/logout">Logout</RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
</template>
