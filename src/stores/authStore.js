import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const router = useRouter();
    const user = ref(null);
    const token = ref(null);

    const setUserToken = (user_data, token_data) => {
      user.value = user_data;
      token.value = token_data;
    };

    let is_superuser = computed(() => {
      return !!(token.value && user.value.is_superuser);
    });

    let logout = async () => {
      await router.push({ name: "login" }); // Navigate to login page
      user.value = null;
      token.value = null;
    };

    return {
      setUserToken,
      user,
      token,
      is_superuser,
      logout,
    };
  },
  {
    persist: {
      key: "auth", // localStorage 的 key
      storage: localStorage, // 也可用 sessionStorage
    },
  }
);
