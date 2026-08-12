import { ref } from 'vue'
import { defineStore } from 'pinia'

// The first argument is a unique id of the store across your application.
export const useUserStore = defineStore('user', () => {
  const user = ref({
    id: null,
    username: null,
    isAdmin: false
  })

  function setUser(userData) {
    user.value.id = userData.id
    user.value.username = userData.username
    user.value.isAdmin = userData.isAdmin
  }

  function unsetUser() {
    user.value.id = null
    user.value.username = null
    user.value.isAdmin = null
    localStorage.clear()
  }

  return { user, setUser, unsetUser }
})
