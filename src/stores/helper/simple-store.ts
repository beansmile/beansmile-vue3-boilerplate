import { ref } from 'vue';
import type { Ref } from 'vue';
import { has, noop, omit } from 'lodash-es';
import { defineStore } from 'pinia';
import type { AxiosRequestConfig } from 'axios';
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

interface FetchingOptions<T> {
  isForce?: boolean;
  autoAssignData?: boolean;
  onResponse?: (result: Data<T>) => void;
}

function simpleStore<T>(getDefaultData: () => T) {
  const isFetching = ref(false);
  const isRejected = ref(false);
  const isFulfilled = ref(false);
  const data = ref<T>(getDefaultData()) as Ref<T>;
  const params = ref<Params>({});

  // eslint-disable-next-line unused-imports/no-unused-vars
  const fetch = ref((fetchParams?: Partial<Params>, options?: AxiosRequestConfig<T>): Promise<CustomAxiosResponse<T>> | Promise<Data<T>> => Promise.resolve({ data: data.value }));

  let fetchPromies: Promise<Data<T>> | null = null;
  const fetching = ref(async (params?: Partial<Params>, options: FetchingOptions<T> = {}, axiosOptions?: AxiosRequestConfig) => {
    const { isForce = false, onResponse = noop, autoAssignData = true } = options;
    if (!isFetching.value || isForce || !fetchPromies) {
      // 多次调用只发送一次请求，比如多接口 401 时，自动登录只调用一次
      fetchPromies = fetch.value(params, axiosOptions);
    }
    isFetching.value = true;
    try {
      const res = await fetchPromies;
      onResponse(res);
      if (autoAssignData) {
        data.value = res.data;
      }
      isFetching.value = false;
      isRejected.value = false;
      isFulfilled.value = true;
      return res;
    } catch (err) {
      isFetching.value = false;
      isRejected.value = true;
      throw err;
    } finally {
      fetchPromies = null;
    }
  });

  const fetchData = ref((fetchParams?: Partial<Params>, options?: AxiosRequestConfig<T>) => {
    return fetching.value({ ...params.value, ...fetchParams }, {}, options);
  });

  const forceFetchData = ref((fetchParams?: Partial<Params>, options?: AxiosRequestConfig<T>) => {
    return fetching.value({ ...params.value, ...fetchParams }, { isForce: true }, options);
  });

  const tryFetchData = ref((fetchParams?: Partial<Params>, options?: AxiosRequestConfig<T>) => {
    return !isFulfilled.value ? fetchData.value(fetchParams, options) : Promise.resolve();
  });

  const resetData = ref(() => {
    isFulfilled.value = false;
    data.value = getDefaultData();
  });

  return {
    data,
    params,
    isFetching,
    forceFetchData,
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
  // useCheckStore 需要在 defineStore 之前调用，才能确保错误堆栈正确
  const checkStore = useCheckStore(name, defineSimpleStore);

  return defineStore(name, () => {
    const store = simpleStore(getDefaultData);
    const newStore = storeSetup(store);
    checkStore(store, newStore as object);
    return {
      ...store,
      ...(omit(newStore as object, Object.keys(store)) as SS),
    };
  });
}

export function useCheckStore<T extends (...args: any) => any>(name: string, fn: T) {
  const error = new Error(name);
  // @ts-expect-error ts误报
  if (Error.captureStackTrace) {
    // @ts-expect-error ts误报
    Error.captureStackTrace(error, fn);
  }

  return function (store: object, newStore: object) {
    let errorMes = '';
    Object.keys(store).forEach((key) => {
      if (has(newStore, key)) {
        errorMes += `\n There is already a "${key}" in "${fn.name}", please don't duplicate it in "${name}". \n if you want to change it, please use "${key}.value = " reassignment. \n`;
      }
    });

    if (errorMes) {
      error.message = errorMes;
      // 异步报错，不要阻塞主进程
      setTimeout(() => {
        throw error;
      }, 0);
    }
  };
}
