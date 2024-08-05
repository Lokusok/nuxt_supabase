<template>
  <div
    id="CreatePost"
    class="fixed z-[9999] left-0 bottom-0 h-full w-full overflow-hidden"
  >
    <div class="bg-black h-full w-full text-white overflow-auto">
      <div
        class="flex items-center justify-start py-4 max-w-[500px] mx-auto border-b border-b-gray-700"
      >
        <button @click="callbacks.closeOverlay" class="rounded-full px-2">
          <Icon name="mdi:close" size="25" />
        </button>

        <div class="text-[16px] font-semibold">New thread</div>
      </div>

      <div
        id="Post"
        class="z-40 bottom-0 max-h-[100vh-200px] mx-auto w-full px-3 max-w-[500px]"
      >
        <div class="py-2 w-full">
          <div class="flex items-center">
            <div class="flx items-center text-white">
              <img
                class="rounded-full h-[35px]"
                src="https://picsum.photos/id/223/50"
              />
              <div class="ml-2 font-semibold text-[10px]">John Weeks Dev</div>
            </div>
          </div>

          <div class="relative flex items-center w-full">
            <div class="w-[42px] mx-auto">
              <div
                class="absolute ml-4 mt-1 top-0 w-[1px] bg-gray-700 h-full"
              ></div>
            </div>

            <div
              class="bg-black rounded-lg w-[calc(100%-50px)] text font-light"
            >
              <div class="pt-2 text-gray-300 bg-black w-full">
                <textarea
                  v-model="text"
                  style="resize: none"
                  placeholder="Start a thread..."
                  id="textarea"
                  @input="helpers.autosizeTextarea"
                  class="w-full bg-black outline-none"
                  ref="textareaRef"
                />
              </div>

              <div class="w-full">
                <div class="flex flex-col gap-2 py-1">
                  <div v-if="fileDisplay">
                    <img
                      class="mx-auto w-full mt-2 mr-2 rounded-lg"
                      :src="fileDisplay"
                    />
                  </div>

                  <label for="fileInput">
                    <Icon
                      name="clarity:paperclip-line"
                      style="color: white"
                      size="25"
                    />
                    <input
                      ref="file"
                      type="file"
                      id="fileInput"
                      @change="callbacks.setFileInfo"
                      hidden
                      accept=".jpg,.jpeg,.png"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="fileDisplay" class="mt-16"></div>
      <button
        v-if="text"
        :disabled="isLoading"
        class="z-[500] fixed bottom-0 font-bold text-lg w-full p-2 bg-black inline-block float-right p-4 border-t border-t-gray-700"
        :class="isLoading ? 'text-gray-600' : 'text-blue-600'"
      >
        <span v-if="!isLoading">Post</span>
        <span v-else class="flex items-center gap-2 justify-center">
          <Icon name="eos-icons:bubble-loading" size="25" />
          Please wait...
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuid4 } from 'uuid';

import { useUserStore } from '~/stores/user';

// const client = useSupabaseClient();
// const user = useSupabaseUser();

const userStore = useUserStore();

const text = ref('');
const isLoading = ref(false);
const file = ref<HTMLInputElement | null>(null);
const fileDisplay = ref('');
const fileData = ref<File | null>(null);

const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Вспомогательные функции
const helpers = {
  /**
   * Для автоматического увеличения textarea при вводе
   */
  autosizeTextarea: () => {
    if (!textareaRef.value) return;

    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px';
  },
};

// Переиспользуемые функции
const callbacks = {
  /**
   * Сброс состояния компонента
   */
  clearData: () => {
    text.value = '';

    file.value = null;
    fileDisplay.value = '';
    fileData.value = null;
  },

  setFileInfo: () => {
    if (!file.value) return;

    const fileFromInput = file.value.files?.[0];

    if (!fileFromInput) return;

    fileDisplay.value = URL.createObjectURL(fileFromInput);
    fileData.value = fileFromInput;
  },

  closeOverlay: () => {
    userStore.isMenuOverlay = false;
    callbacks.clearData();
  },
};
</script>
