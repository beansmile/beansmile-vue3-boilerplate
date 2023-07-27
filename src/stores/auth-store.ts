import { computed } from 'vue';
import { type Params, defineSimpleStore } from './helper/simple-store';
import { request } from '@/utils';
import { STORAGE_KEYS } from '@/constants';
import type { UserType } from '@/models/user';
import { getUserDefaultData } from '@/models/user';

export interface LoginBody {
  email: string;
  password: string;
}

export const useAuthStore = defineSimpleStore('auth', getUserDefaultData, ({
  fetch,
  data,
  resetData,
}) => {
  const access_token = computed({
    get() {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN_KEY) || '';
    },
    set(v) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN_KEY, v);
    },
  });

  fetch.value = (params?: Params) => {
    return request.get('mine', { params });
  };

  async function login(body: LoginBody) {
    const { data: newData } = await request.post<{ access_token: string; user: UserType }>('sessions/login', body);
    access_token.value = newData.access_token;
    return data;
  }

  function signOut() {
    access_token.value = '';
    resetData.value();
  }

  return {
    login,
    signOut,
    access_token,
  };
});
