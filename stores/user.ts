import { defineStore } from 'pinia';
import type { IPost } from '~/types/post';

export const useUserStore = defineStore('user', {
  state: () => ({
    posts: [] as IPost[],
    isMenuOverlay: false,
    isLogoutOverlay: false,
  }),
  actions: {
    async getAllPosts() {
      const response = await useFetch('/api/get-all-posts');

      if (!response.data) return;

      this.posts = response.data as unknown as IPost[];
      return response.data;
    },
  },
});
