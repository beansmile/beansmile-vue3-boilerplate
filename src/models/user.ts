import type { BaseType } from './base';
import { getBaseData } from './base';

export interface UserType extends BaseType {
  phone: string;
}

/**
 * 通过 function 获取默认数据，防止引用类型数据，改到默认数据
 *
 * @return {UserType}[return description]
 */
export function getUserDefaultData(): UserType {
  return {
    ...getBaseData(),
    phone: '',
  };
}
