<template>
    <v-app-bar density="comfortable" color="red-darken-4">
        <v-container class="mx-auto d-flex align-center justify-center">
            <v-img src="/src/assets/logo.png" class="mr-4" max-width="40" height="40" alt="Logo"></v-img>
            <v-app-bar-title class="d-none d-md-block">Pokédex</v-app-bar-title>
            <v-spacer></v-spacer>
            <v-responsive max-width="300">
                <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify" density="compact" label="Pesquisar" rounded="lg" variant="solo-filled" flat hide-details single-line clearable @input="emitSearch"></v-text-field>
            </v-responsive>
        </v-container>
    </v-app-bar>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const searchQuery = ref('');

const emit = defineEmits<{
    (e: 'search', query: string): void;
}>();

const emitSearch = () => {
    emit('search', searchQuery.value);
};

watch(searchQuery, (newValue) => {
    emit('search', newValue);
});
</script>
