<script lang="ts" setup>
import { onMounted } from 'vue';
import Footer from '@/components/footer.vue';
import Header from '@/components/header.vue';

onMounted(async () => {});
</script>

<template>
  <div class="global-layout">
    <Header />
    <main class="main">
      <router-view :key="$route.fullPath" />
    </main>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.global-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .main {
    flex: 1;
  }
}
</style>
