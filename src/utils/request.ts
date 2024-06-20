import { forEach, get, set, snakeCase } from 'lodash-es';
import qs from 'qs';
import type { InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import decoder from './decoder';
import type { LoadingInstance } from './loading';
import createLoadingComponent from './loading';
import { useAuthStore } from '@/stores/auth-store';
import router from '@/router';

interface LoadingData {
  maxCount: number;
  loadingInstance: LoadingInstance | null;
  loadingSet: Set<InternalAxiosRequestConfig>;
}

const loadingData: LoadingData = {
  maxCount: 0,
  loadingInstance: null,
  loadingSet: new Set(),
};

const request = axios.create({
  baseURL: '/app_api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: {
    serialize(params: object) {
      return qs.stringify(params, { arrayFormat: 'brackets' });
    },
  },
});

request.interceptors.request.use((config) => {
  if (config.headers && !config.headers.Authorization) {
    const authStore = useAuthStore();
    config.headers.Authorization = authStore.accessToken;
  }
  handleLoadingStart(config);
  return config;
});

request.interceptors.response.use(
  (res: any) => {
    res.isResponse = true;
    res.meta = {};
    handleLoadingStop(res.config);

    forEach(res.headers, (v: string, k: string) => {
      if (/^x-/i.test(k)) {
        const key
        = snakeCase(k.replace(/^x-/i, ''));
        res.meta[key] = decoder(v);
      }
    });
    return res;
  },
  async (err: { message: any; code: number; status: any; [key: string]: any; config: InternalAxiosRequestConfig }) => {
    const response
    = get(err, 'response', {});
    handleLoadingStop(err.config);
    if (response.data) {
      const { error_message, messages, error, code } = response.data;
      err.message = error_message || messages || error || err.message;
      err.code = code;
    }
    err.status = response.status;
    if (response.status === 401) {
      set(err.config, 'headers[Authorization]', '');
      const authStore = useAuthStore();
      await authStore.signOut();
      goToLogin();
      return Promise.reject(err);
    }
    showError(err);
    return Promise.reject(err);
  },
);

function goToLogin() {
  if (router.currentRoute.value.name !== 'login') {
    router.replace({ name: 'login' });
  }
}

function showError(err: { message: string; config: InternalAxiosRequestConfig }) {
  const { showError } = getLoadingConfig(err.config.loading);

  if (showError) {
    // TODO 显示错误信息
    // Toast.fail('Request error');
  }
}

function getLoadingConfig(loading: InternalAxiosRequestConfig['loading']) {
  if (loading === false) {
    return {
      showLoading: false,
      showError: false,
      showMask: false,
    };
  }
  return Object.assign({
    showLoading: true,
    showError: true,
    showMask: true,
  }, loading);
}

function handleLoadingStart(config: InternalAxiosRequestConfig) {
  const { showMask, showLoading } = getLoadingConfig(config.loading);
  if (!showLoading) {
    return;
  }
  const { loadingSet } = loadingData;
  loadingSet.add(config);
  loadingData.maxCount++;
  loadingData.loadingInstance = createLoadingComponent({
    currentLoadingCount: loadingSet.size,
    maxLoadingCount: loadingData.maxCount,
    showMask,
  });
}

function handleLoadingStop(config: InternalAxiosRequestConfig) {
  const { showLoading } = getLoadingConfig(config.loading);
  if (!showLoading) {
    return;
  }
  const { loadingSet } = loadingData;
  if (loadingSet.has(config)) {
    loadingSet.delete(config);
    (loadingData.loadingInstance as LoadingInstance).data.currentLoadingCount = loadingSet.size;
  }
  if (loadingSet.size === 0) {
    loadingData.maxCount = 0;
    (loadingData.loadingInstance as LoadingInstance).data.maxLoadingCount = 0;
  }
}

export { request };
