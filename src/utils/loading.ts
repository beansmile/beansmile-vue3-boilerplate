import {
  createApp,
  h,
  reactive,
} from 'vue';
import LoadingComponent from '@/components/loading.vue';

let instance: any;

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
  const data = reactive({
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
