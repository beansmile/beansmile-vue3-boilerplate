import { ref } from 'vue';
import type { Ref } from 'vue';
import { noop } from 'lodash-es';
import { defineStore } from 'pinia';
import type { CustomAxiosResponse } from '@/models/request';

export interface Data<T> {
  data: T;
  meta?: Record<string, string | number>;
  [key: string]: any;
}

export interface Params {
  offset?: number;
  per_page?: number;
  [key: string]: any;
}

function simpleStore<T>(getDefaultData: () => T) {
  const isFetching = ref(false);
  const isRejected = ref(false);
  const isFulfilled = ref(false);
  const data = ref<T>(getDefaultData()) as Ref<T>;
  const params = ref<Params>({});

  // eslint-disable-next-line unused-imports/no-unused-vars
  const fetch = ref((fetchParams?: Partial<Params>): Promise<CustomAxiosResponse<T>> | Promise<Data<T>> => Promise.resolve({ data: data.value }));

  let fetchPromies: Promise<Data<T>> | null = null;
  const fetching = ref(async (params?: Partial<Params>, isForce = false, onResponse: (result: Data<T>) => void = noop) => {
    if (!isFetching.value || isForce || !fetchPromies) {
      // 多次调用只发送一次请求，比如多接口 401 时，自动登录只调用一次
      fetchPromies = fetch.value(params);
    }
    isFetching.value = true;
    try {
      const res = await fetchPromies;
      onResponse(res);
      isFetching.value = false;
      isRejected.value = false;
      isFulfilled.value = true;
      data.value = res.data;
      return res;
    } catch (err) {
      isFetching.value = false;
      isRejected.value = true;
      throw err;
    } finally {
      fetchPromies = null;
    }
  });

  const fetchData = ref((fetchParams?: Partial<Params>, isForce = false) => {
    return fetching.value({ ...params, ...fetchParams }, isForce);
  });

  const tryFetchData = ref((fetchParams?: Partial<Params>) => {
    return !isFulfilled.value ? fetchData.value(fetchParams) : Promise.resolve();
  });

  const resetData = ref(() => {
    isFulfilled.value = false;
    data.value = getDefaultData();
  });

  return {
    data,
    params,
    isFetching,
    isRejected,
    isFulfilled,
    fetchData,
    tryFetchData,
    fetching,
    fetch,
    resetData,
  };
}

export type SimpleStoreReturnType<T> = ReturnType<typeof simpleStore<T>>;

export function defineSimpleStore<Id extends string, T, SS>(name: Id, getDefaultData: () => T, storeSetup: (store: SimpleStoreReturnType<T>) => SS) {
  return defineStore(name, () => {
    const store = simpleStore(getDefaultData);
    return {
      ...store,
      ...storeSetup(store),
    };
  });
}
