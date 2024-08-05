<template>
  <div id="IndexPage" class="w-full overflow-auto">
    <div class="mx-auto max-w-[500px] overflow-hidden">
      <div id="Posts" class="px-4 max-w-[600px] mx-auto">
        <template v-if="isPosts">
          <div v-for="post in posts" :key="post" class="text-white">
            <Post :post="post" @isDeleted="posts = []" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user';

definePageMeta({
  layout: 'main-layout',
});

const userStore = useUserStore();
// const user = useSupabaseUser();

const posts = ref([]);
const isPosts = ref(true);
const isLoading = ref(false);

onBeforeMount(() => {
  posts.value = [
    {
      name: 'John Weeks Dev',
      image: 'https://placehold.co/100',
      text: 'This is the title',
      picture: 'https://placehold.co/500',
    },
  ];
});
</script>
