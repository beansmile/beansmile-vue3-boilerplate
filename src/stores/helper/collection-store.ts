import { computed, ref } from 'vue';
import type { Params, SimpleStoreReturnType } from './simple-store';
import { defineSimpleStore } from './simple-store';
import type { CustomAxiosResponse } from '@/models/request';
import type { BaseType } from '@/models/base';

export type { Params } from './simple-store';

function collectionStore<T extends BaseType>(simpleStore: SimpleStoreReturnType<T[]>) {
  const {
    data,
    params,
    isFulfilled,
    isFetching,
    fetching,
    fetchData,
  } = simpleStore;

  params.value.offset = 0;
  params.value.per_page = 25;

  const meta = ref<CustomAxiosResponse['meta']>({ total: 0, page: 1, total_pages: 0, offset: 0, per_page: 25 });

  const isComplete = computed(() => {
    const total = meta.value?.total || 0;
    return isFulfilled.value && data.value.length >= total;
  });

  const isEmpty = computed(() => {
    return isFulfilled.value && data.value.length === 0;
  });

  fetchData.value = async function (fetchParams?: Partial<Params>, isForce = false) {
    const res = await fetching.value(params, isForce);
    meta.value = res.meta;
    data.value = res.data;
    return res;
  };

  const fetchMoreData = ref(async () => {
    if (isFetching.value || isComplete.value) { return; }
    params.value.offset = data.value.length;
    const { data: newData, meta: newMeta } = await fetching.value(params);
    meta.value = newMeta;
    data.value.push(...newData);
  });

  const unshift = ref((item: T) => {
    data.value.unshift(item);
    if (typeof meta.value?.total === 'number') {
      meta.value.total += 1;
    }
  });

  const findItemById = ref((id: T['id']) => {
    return data.value.find(item => item.id === id);
  });

  const removeItemById = ref((id: T['id']) => {
    const index = data.value.findIndex(item => item.id === id);
    if (index !== -1) {
      data.value.splice(index, 1);
      if (typeof meta.value?.total === 'number') {
        meta.value.total -= 1;
      }
    }
  });

  const replaceItem = ref((newItem: T) => {
    const index = data.value.findIndex(item => item.id === newItem.id);
    if (index > -1) {
      data.value.splice(index, 1, newItem);
    }
  });

  const updateItem = ref((newItem: T) => {
    const index = data.value.findIndex(item => item.id === newItem.id);
    if (index > -1) {
      Object.assign(data.value[index], newItem);
    }
  });

  return {
    isComplete,
    isEmpty,
    meta,
    fetchMoreData,
    unshift,
    findItemById,
    removeItemById,
    replaceItem,
    updateItem,
  };
}

export type CollectionStoreReturnType<T extends BaseType> = ReturnType<typeof collectionStore<T>>;

export function defineCollectionStore<Id extends string, T extends BaseType, SS>(name: Id, getDefaultData: () => T[], storeSetup: (stroe: CollectionStoreReturnType<T> & SimpleStoreReturnType<T[]>) => SS) {
  return defineSimpleStore(name, getDefaultData, (simpleStore) => {
    const store = collectionStore(simpleStore);
    return {
      ...store,
      ...storeSetup({
        ...simpleStore,
        ...store,
      }),
    };
  });
}
