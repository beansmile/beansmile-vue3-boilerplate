import { computed, ref } from 'vue';
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
  const _accessToken = ref(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN_KEY) || '');
  const accessToken = computed({
    get() {
      return _accessToken.value;
    },
    set(v) {
      _accessToken.value = v;
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN_KEY, v);
    },
  });

  fetch.value = (params?: Params, options = {}) => {
    return request.get('mine', { params, ...options });
  };

  async function login(body: LoginBody) {
    const { data: newData } = await request.post<{ access_token: string; user: UserType }>('sessions/login', body);
    accessToken.value = newData.access_token;
    return data;
  }

  function signOut() {
    accessToken.value = '';
    resetData.value();
  }

  return {
    login,
    signOut,
    accessToken,
  };
});
