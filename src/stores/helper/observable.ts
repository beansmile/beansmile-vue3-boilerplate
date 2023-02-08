import { reactive } from 'vue';
import { forEach } from 'lodash-es';

interface Instance {
  [key: string]: any
}

export default class Observable {
  static create(state: Object) {
    const instance: Instance = new this();
    if (state) {
      forEach(Object.getOwnPropertyDescriptors(state), (descriptor, key) => {
        if ('value' in descriptor) {
          instance[key] = descriptor.value;
        } else {
          Object.defineProperty(instance, key, descriptor);
        }
      });
    }
    return reactive(instance);
  }
}
