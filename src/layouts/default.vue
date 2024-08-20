<template>
  <v-app>
    <Navbar @search="handleSearch" />
    <v-main>
      <router-view :searchQuery="searchQuery" />
    </v-main>
    <Footer />
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const searchQuery = ref<string>('');

const handleSearch = (query: string) => {
  searchQuery.value = query || '';
};
</script>