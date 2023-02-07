import { SimpleStore } from './helper/simple-store';

class AuthStore extends SimpleStore {
  get access_token() {
    return '';
  }

  login() {
    return this.fetchData();
  }
}

export const authStore = new AuthStore();
