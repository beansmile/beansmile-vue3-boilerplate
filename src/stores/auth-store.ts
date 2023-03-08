import { reactive } from 'vue';
import { SimpleStore } from './helper/simple-store';
import { request } from '@/utils';
import { ACCESS_TOKEN_KEY } from '@/constants';
import type { UserType } from '@/models/user';
import { getUserDefaultData } from '@/models/user';

export interface Body {
  phone: string;
  password: string;
}

class AuthStore extends SimpleStore<{ access_token: string; user: UserType }> {
  user: UserType = getUserDefaultData();
  $access_token = '';

  set access_token(v: string) {
    this.$access_token = v;
    localStorage.setItem(ACCESS_TOKEN_KEY, v);
  }

  get access_token(): string {
    this.$access_token = this.$access_token || localStorage.getItem(ACCESS_TOKEN_KEY) || '';
    return this.$access_token;
  }

  fetch(body: Body) {
    return request.post('sessions/login', body);
  }

  async login(body: Body) {
    const { data } = await this.fetchData(body);
    this.access_token = data.access_token;
    this.user = data.user;
    return data;
  }

  signOut() {
    this.access_token = '';
    this.user = getUserDefaultData();
    this.isFulfilled = false;
  }
}

export const authStore = reactive(new AuthStore());
