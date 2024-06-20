<script lang="ts" setup>
import { getCurrentInstance, onUnmounted, ref, watch } from 'vue';

export interface IProps {
  currentLoadingCount: number; // 当前loading的数量
  maxLoadingCount: number; // 此次请求过程中，最大的loading数量
  showMask?: boolean;
  minLoadingTime?: number; // 最少loading的时间，可以防止加载太快，loading 闪烁问题。
  delayed?: number; // 延迟关闭loading的时间，防止进度条关闭太快，看不到进度条完成效果。
}

const props = withDefaults(
  defineProps<IProps>(),
  {
    showMask: true,
    minLoadingTime: 300,
    delayed: 200,
  },
);

// 通过最小loading时间，计算出来的最小loading状态
const minLoading = ref(false);
let minLoadingTimer: number;
watch(() => props.currentLoadingCount, (value, old) => {
  if (Boolean(value) !== Boolean(old) && value > 0) {
    clearTimeout(minLoadingTimer);
    minLoading.value = true;
    minLoadingTimer = window.setTimeout(() => {
      minLoading.value = false;
    }, props.minLoadingTime);
  }
}, { immediate: true, deep: true });

// 是否显示loading
const localVisible = ref(false);
let timer: number;
watch(() => [props.currentLoadingCount, minLoading.value, props.delayed], () => {
  const visible = props.currentLoadingCount > 0;
  clearTimeout(timer);
  if (props.delayed && !minLoading.value && !visible) {
    timer = window.setTimeout(() => {
      localVisible.value = visible;
    }, props.delayed);
  } else {
    localVisible.value = true;
  }
}, { immediate: true, deep: true });

// 计算进度条的百分比
const percentage = ref(0);
let percentageTimer: number;
watch(() => [props.maxLoadingCount, props.currentLoadingCount], () => {
  clearInterval(percentageTimer);
  if (props.maxLoadingCount === 0) {
    percentage.value = 100;
  } else {
    percentage.value = (props.maxLoadingCount - props.currentLoadingCount) / props.maxLoadingCount * 100;
    // 简单做个假进度条加载效果
    percentageTimer = window.setInterval(() => {
      if (percentage.value >= 95) {
        clearInterval(percentageTimer);
      } else {
        percentage.value = Math.min(percentage.value + 10, 95);
      }
    }, 150);
  }
}, { immediate: true, deep: true });

onUnmounted(() => {
  clearInterval(percentageTimer);
  clearTimeout(timer);
  clearTimeout(minLoadingTimer);
});

defineExpose({
  instance: getCurrentInstance(),
});
</script>

<template>
  <div v-show="localVisible">
    <!-- TODO: 自行显示全局loading样式 -->
    <div style="display: none;">
      加载中：{{ percentage }}%
    </div>
    <div v-show="props.showMask" class="mask"></div>
  </div>
</template>

<style lang="scss" scoped>
  .progress {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
  }

  .mask {
    position: fixed;
    z-index: 998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 50%);
    cursor: wait;
  }
</style>
