<template>
  <v-footer height="72" color="grey-darken-4" class="pa-0">
    <div class="d-flex align-center justify-space-between px-4 py-4 w-100">
      <span class="text-body-2 text-medium-emphasis">
        &copy; {{ new Date().getFullYear() }} Richard Tavares
      </span>
      <div class="d-flex align-center ga-3">
        <v-icon v-for="icon in icons" :key="icon.name" :icon="icon.name" size="40" class="social-btn" @click="redirectTo(icon.url)" />
      </div>
    </div>
  </v-footer>
</template>

<script lang="ts" setup>
const icons = [
  { name: 'mdi-linkedin', url: 'https://www.linkedin.com/in/richard-tavares' },
  { name: 'mdi-github', url: 'https://github.com/richard-tavares' },
]

const redirectTo = (url: string) => window.open(url, '_blank')
</script>

<style scoped>
.v-footer {
  padding-bottom: 0 !important;
}

.social-btn {
  cursor: pointer;
}

.social-btn:hover {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
