declare module 'axios' {
  interface Loading {
    showMask?: boolean; // 是否显示遮罩层， 默认为 true
    showError?: boolean; // 是否显示错误信息，默认为 true
    showLoading?: boolean; // 是否显示 loading 和 遮罩层，默认为 true
  }

  export interface AxiosRequestConfig {
    loading?: Loading | boolean;
  }
}

export {};
