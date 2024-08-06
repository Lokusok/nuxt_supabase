<template>
  <div id="IndexPage" class="w-full overflow-auto">
    <div class="mx-auto max-w-[500px] overflow-hidden">
      <div id="Posts" class="px-4 max-w-[600px] mx-auto">
        <template v-if="isPosts">
          <div v-for="post in posts" :key="post" class="text-white">
            <Post :post="post" @isDeleted="posts = []" />
          </div>
        </template>

        <div v-else>
          <ClientOnly>
            <div
              v-if="isLoading"
              class="mt-20 w-full flex items-center justify-center mx-auto"
            >
              <div
                class="text-white mx-auto flex flex-col items-center justify-center"
              >
                <Icon
                  name="eos-icons:bubble-loading"
                  size="50"
                  style="color: white"
                />
                <div class="w-full mt-1">Loading...</div>
              </div>
            </div>

            <div
              v-else
              class="mt-20 w-full flex items-center justify-center mx-auto"
            >
              <div
                class="text-white mx-auto flex flex-col items-center justify-center"
              >
                <Icon name="tabler:mood-empty" size="50" style="color: white" />
                <div class="w-full">Make the first post!</div>
              </div>
            </div>
          </ClientOnly>
        </div>
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
const user = useSupabaseUser();

watchEffect(() => {
  if (!user.value) {
    return navigateTo('/auth');
  }
});

const posts = ref([]);
const isPosts = ref(false);
const isLoading = ref(false);

onBeforeMount(async () => {
  try {
    isLoading.value = true;
    await userStore.getAllPosts();
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});

watchEffect(() => {
  if (!userStore.posts?.length) return;

  posts.value = userStore.posts;
  isPosts.value = true;
});

// For PWA issues
watch(
  () => posts.value,
  () => {
    if (!userStore.posts?.length) return;

    posts.value = userStore.posts;
    isPosts.value = true;
  },
  { deep: true },
);
</script>
