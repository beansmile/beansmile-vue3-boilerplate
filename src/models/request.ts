import type { AxiosResponse } from 'axios';

/** meta 暂时只用到这些 */
export interface ResponseMeta {
  total: number;
  page: number;
  total_pages: number;
  offset: number;
  per_page: number;
  remaining_total?: number;
}
/**
 * 将 header 信息 X-xx-xx 加入 axios response meta 里面
 */
export interface CustomAxiosResponse<T = unknown> extends AxiosResponse<T> {
  meta?: Partial<ResponseMeta>;
}

/** 目前支持的 http method */
export type SupportedHTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * 接口返回的错误提示状态码, 后续可以根据需要添加
 *
 * 40101: 账号已被冻结
 */
type ApiErrorCode = 40101;
/** 接口返回的错误提示数据 */
export interface ApiErrorData {
  code?: ApiErrorCode;
  detail?: Record<string, unknown>;
  error_message?: string;
  /** 401 仅有 error 字段 */
  error?: string;
}
