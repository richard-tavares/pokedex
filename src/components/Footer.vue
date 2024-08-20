<template>
    <v-footer color="grey-darken-4" class="pa-0 ma-0">
        <v-container class="d-flex justify-between align-center">
            <span class="white--text">
                &copy; {{ new Date().getFullYear() }} Desenvolvido por Richard Tavares.
            </span>
            <v-spacer></v-spacer>
            <div class="d-flex align-center">
                <v-icon v-for="(icon, index) in icons" :key="index" :class="icon.class" size="36" @click="redirectTo(icon.url)">
                    {{ icon.name }}
                </v-icon>
            </div>
        </v-container>
    </v-footer>
</template>

<script setup>
import { ref } from 'vue';

const icons = [
    { name: 'mdi-linkedin', class: 'white--text mx-4', url: 'https://www.linkedin.com/in/richard-tavares' },
    { name: 'mdi-github', class: 'white--text', url: 'https://github.com/RichardTavares' },
];

const redirectTo = (url) => {
    window.open(url, '_blank');
};
</script>

<style scoped>
.v-icon {
    cursor: pointer;
}

.v-icon:hover {
    color: #921616;
}
</style>