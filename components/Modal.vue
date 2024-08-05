<template>
  <div
    id="Modal"
    class="fixed grid place-items-center h-screen z-50 left-0 bottom-0 bg-black bg-opacity-50 backdrop-blur-md w-full"
  >
    <div
      class="bg-black w-full max-w-[300px] rounded-lg text-white border border-gray-600 py-2"
    >
      <button
        @click="callbacks.closeModal"
        class="flex items-center justify-between bg-black w-full p-3"
      >
        <span>Close Modal</span>
        <Icon name="mdi:close" size="25" />
      </button>
      <div class="border-b border-b-gray-700 my-1"></div>
      <button class="flex items-center justify-between bg-black w-full p-3">
        <div>Log Out</div>
        <Icon name="ph:sign-out" size="25" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

// const client = useSupabaseClient();

const callbacks = {
  closeModal: async () => {
    // client.auth.signOut();
    userStore.isLogoutOverlay = false;
    return navigateTo('/');
  },
};
</script>
