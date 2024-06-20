import {
  type ComponentPublicInstance,
  createApp,
  h,
  reactive,
} from 'vue';
import type { IProps } from '@/components/common/loading.vue';
import LoadingComponent from '@/components/common/loading.vue';

export interface LoadingInstance {
  vm: ComponentPublicInstance;
  data: IProps;
}

let instance: LoadingInstance;

interface Options {
  currentLoadingCount?: number;
  maxLoadingCount?: number;
  showMask?: boolean;
}

export default function createLoadingComponent(options: Options = {}) {
  if (instance) {
    // 如果一次请求多个接口, 只要有一个请求 showMask 为 true, 则显示遮罩
    const showMask = (instance.data.currentLoadingCount > 0 && instance.data.showMask) ? true : options.showMask;
    Object.assign(instance.data, options, { showMask });
    return instance;
  }
  const data = reactive<IProps>({
    currentLoadingCount: 0,
    maxLoadingCount: 0,
    delayed: 300,
    ...options,
  });

  const contentDOM = document.createElement('div');
  document.body.appendChild(contentDOM);
  const vm = createApp({
    name: 'LoadingComponent',
    setup() {
      return () => {
        return h(LoadingComponent, data);
      };
    },
  }).mount(contentDOM);
  return instance = {
    vm,
    data,
  };
}
