<script lang="ts" setup>
import { onMounted } from 'vue';

onMounted(async () => {});
const keepAliveRouteName: string[] = [];
</script>

<template>
  <div class="global-layout">
    <global-header />
    <main class="main">
      <router-view v-slot="{ Component }">
        <keep-alive :include="keepAliveRouteName">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
    <global-footer />
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
