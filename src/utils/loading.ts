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
  value?: number;
  max?: number;
  visible?: boolean;
  showMask?: boolean;
}

export default function createLoadingComponent(options: Options = {}) {
  if (instance) {
    Object.assign(instance.data, { visible: true }, options);
    return instance;
  }
  const data = reactive<IProps>({
    value: 1,
    max: 2,
    visible: true,
    delayed: 600,
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
