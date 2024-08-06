<template>
  <div class="z-50 bottom-0 h-full w-full">
    <div class="py-2 w-full">
      <div class="flex items-center justify-between">
        <div class="flex items-center text-white">
          <img
            class="rounded-full h-[35px]"
            :src="props.post.image"
            :alt="props.post.name"
          />
          <div class="ml-2 font-semibold text-[18px]">
            {{ props.post.name }}
          </div>
        </div>

        <div
          v-if="user?.identities?.[0]?.user_id === props.post.userId"
          @click="isMenu = !isMenu"
          class="relative"
        >
          <button
            :disabled="isDeleting"
            class="flex items-center text-white p-1 h-[24px] w-[24px] hover:bg-gray-800 rounded-full cursor-pointer"
            :class="isMenu ? 'bg-gray-800' : ''"
          >
            <Icon
              v-if="!isDeleting"
              name="bi:three-dots"
              color="#fffffff"
              size="18"
            />
            <Icon
              v-else
              name="eos-icons:bubble-loading"
              color="#fffffff"
              size="18"
            />
          </button>

          <div
            v-if="isMenu"
            class="absolute border border-gray-600 right-0 z-20 mt-1 rounded"
          >
            <button
              @click="callbacks.deletePost(post.id, post.picture)"
              class="flex items-center rounded gap-2 text-red-500 justify-between bg-black w-full pl-4 pr-3 py-1 hover:bg-gray-900"
            >
              <div>Delete</div>
              <Icon name="solar:trash-bin-trash-broken" size="20" />
            </button>
          </div>
        </div>
      </div>

      <div class="relative flex items-center w-full">
        <div class="w-[42px] mx-auto">
          <div
            class="absolute ml-4 mt-1 top-0 w-[1px] bg-gray-700 h-full"
          ></div>
        </div>

        <div class="bg-black rounded-lg w-[calc(100%-50px)] text-sm font-light">
          <div class="py-2 text-gray-300">{{ props.post.text }}</div>
          <img
            v-if="post && post.picture"
            class="mx-auto w-full mt-2 pr-2 rounded"
            :src="runtimeConfig.public.bucketUrl + post.picture"
          />
          <div class="absolute mt-2 w-full ml-2">
            <button
              @click="callbacks.likesFunc"
              :disabled="isLike"
              class="flex items-center gap-1"
            >
              <Icon
                v-if="!hasLiked"
                class="p-1 text-white hover:bg-gray-800 rounded-full cursor-pointer"
                name="mdi:cards-heart-outline"
                size="28"
              />
              <Icon
                v-else
                class="p-1 text-red-500 hover:bg-gray-800 rounded-full cursor-pointer"
                name="mdi:cards-heart"
                size="28"
              />
            </button>

            <div class="relative text-sm text-gray-500">
              <div>
                <span v-if="!isLike">{{ props.post.likes.length }}</span>
                <span v-else>
                  <Icon
                    name="eos-icons:bubble-loading"
                    style="color: white"
                    size="13"
                  />
                </span>
                likes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative inline-block text-gray-500 pt-1 pb-1.5">
      <div class="flex items-center">
        <div class="flex items-center flex-wrap text-white gap-1 w-[42px]">
          <div class="flex gap-0.5">
            <img
              class="rounded-full h-[14px] mt-2"
              src="https://picsum.photos/id/202/50"
            />
            <img
              class="rounded-full h-[17px] mt-2"
              src="https://picsum.photos/id/223/50"
            />
          </div>

          <div class="flex items-center">
            <img
              class="rounded-full h-[11px] ml-4"
              src="https://picsum.photos/id/99/50"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="h-[1px] bg-gray-800 w-full mt-3"></div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import type { ILike } from '~/types/like';

import type { IPost } from '~/types/post';
import { isLikeGuard } from '~/utils';

const props = defineProps<{
  post: IPost;
}>();

const emit = defineEmits(['isDeleted']);

const userStore = useUserStore();

const runtimeConfig = useRuntimeConfig();

const isMenu = ref(false);
const isLike = ref(false);
const isDeleting = ref(false);

const hasLiked = computed(() => {
  if (!user.value) return;

  let result = false;

  props.post.likes.forEach((like) => {
    if (
      like.userId === user.value.identities?.[0].user_id &&
      like.postId === props.post.id
    ) {
      result = true;
    }
  });

  return result;
});

const client = useSupabaseClient();
const user = useSupabaseUser();

const callbacks = {
  deletePost: async (id: IPost['id'], picture: IPost['picture']) => {
    const result = confirm('Are you sure you want to delete this post?');

    if (!result) return;

    try {
      isMenu.value = false;
      isDeleting.value = true;

      const { data, error } = await client.storage
        .from('nuxt_pet_files')
        .remove(picture as unknown as string[]);

      await useFetch(`/api/delete-post/${id}`, { method: 'DELETE' });
      emit('isDeleted', true);
    } catch (error) {
      console.log(error);
    } finally {
      isDeleting.value = false;
    }
  },

  likePost: async (id: IPost['id']) => {
    isLike.value = true;

    try {
      await useFetch('/api/like-post', {
        method: 'POST',
        body: {
          userId: user.value.identities?.[0].user_id,
          postId: id,
        },
      });

      await userStore.getAllPosts();
    } catch (error) {
      console.log(error);
    } finally {
      isLike.value = false;
    }
  },

  unlikePost: async (id: IPost['id']) => {
    isLike.value = true;

    try {
      await useFetch(`/api/unlike-post/${id}`, { method: 'DELETE' });
      await userStore.getAllPosts();
    } catch (error) {
      console.log(error);
    } finally {
      isLike.value = false;
    }
  },

  likesFunc: () => {
    let likePostObj: ILike | unknown = null;

    if (props.post.likes.length < 1) {
      callbacks.likePost(props.post.id);
      return;
    } else {
      props.post.likes.forEach((like) => {
        if (
          like.userId == user.value.identities?.[0].user_id &&
          like.postId == props.post.id
        ) {
          likePostObj = like;
        }
      });
    }

    if (isLikeGuard(likePostObj)) {
      callbacks.unlikePost(likePostObj.id);
      return;
    }
  },
};
</script>
