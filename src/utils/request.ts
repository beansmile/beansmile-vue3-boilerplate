import { forEach, get, set, snakeCase } from 'lodash-es';
import qs from 'qs';
import axios from 'axios';
import decoder from './decoder';
import { authStore } from '@/stores';

const request = axios.create({
  baseURL: '/app_api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: {
    encode(params) {
      return qs.stringify(params, { arrayFormat: 'brackets' });
    },
  },
  transformRequest: [(data, headers: any) => {
    if (!headers.Authorization) { headers.Authorization = authStore.access_token; }

    return data;
  }],
});

request.interceptors.response.use(
  (res: any) => {
    res.isResponse = true;
    res.meta = {};
    forEach(res.headers, (v, k) => {
      if (/^x-/i.test(k)) {
        const key = snakeCase(k.replace(/^x-/i, ''));
        res.meta[key] = decoder(v);
      }
    });
    return res;
  },
  (err) => {
    const response = get(err, 'response', {});
    if (response.data) {
      const { error_message, messages, error, code } = response.data;
      err.message = error_message || messages || error || err.message;
      err.code = code;
    }
    err.status = response.status;
    if (response.status === 401) {
      if (err.code !== 40101) {
        set(response.config, 'headers[Authorization]', '');
        return authStore.login().then(() => request.request(response.config));
      }
    }
    return Promise.reject(err);
  },
);

export { request };
