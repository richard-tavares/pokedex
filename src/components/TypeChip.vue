<template>
  <v-chip :color="type.color" size="small" class="px-2">
    <v-img :src="iconUrl" class="type-icon" />
    {{ type.pt }}
  </v-chip>
</template>

<script lang="ts" setup>
const props = defineProps<{
  type: { pt: string; color: string; foto: string }
}>()

const iconUrl = `${import.meta.env.BASE_URL}${props.type.foto}`
</script>

<style scoped>
.type-icon {
  width: 20px;
  height: 20px;
  margin-right: 4px;
  flex-shrink: 0;
}
</style>
