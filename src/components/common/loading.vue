<script lang="ts" setup>
import { getCurrentInstance, ref, watchEffect } from 'vue';

export interface IProps {
  value: number;
  max: number;
  visible?: boolean;
  showMask?: boolean;
  delayed?: number; // 最少loading的时间，可以防止加载太快，loading 闪烁问题
}

const props = withDefaults(
  defineProps<IProps>(),
  {
    value: 1,
    max: 1,
    visible: false,
    showMask: true,
    delayed: 0,
  },
);

const localVisible = ref(false);

let timer: number;

watchEffect(() => {
  const value = props.visible;
  clearTimeout(timer);
  if (props.delayed && !value) {
    timer = window.setTimeout(() => {
      localVisible.value = value;
    }, props.delayed);
  } else {
    localVisible.value = value;
  }
});

defineExpose({
  instance: getCurrentInstance(),
});
</script>

<template>
  <div v-show="visible">
    <!-- TODO: 自行显示全局loading样式 -->
    <div style="display: none;">
      加载中：{{ props.value / props.max * 100 }}%
    </div>
    <div v-show="props.showMask" class="mask"></div>
  </div>
</template>

<style lang="scss" scoped>
  .progress {
    position: fixed;
    z-index: z("loading", "animation");
    top: 0;
    left: 0;
    width: 100%;
  }

  .mask {
    position: fixed;
    z-index: z("loading", "mask");
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 50%);
    cursor: wait;
  }

  .loading {
    position: fixed;
    z-index: z("loading", "mask");
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
