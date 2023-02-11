import { SimpleStore } from './simple-store';

interface Options<T> {
  params?: {
    offset?: number
    perPage?: number
    [key: string]: any
  }
  fetch: SimpleStore<T[]>['fetch']
}

export class Collection<T> extends SimpleStore<T[]> {
  constructor(opts: Options<T>) {
    super();
    this.fetch = opts.fetch;
    this.params = Object.assign({}, this.defaultParams, opts.params);
  }

  private defaultParams = {
    offset: 0,
    perPage: 50,
  };

  data: T[] = [];
  params = {
    offset: 0,
    perPage: 50,
  };

  meta = { total: 0, page: 1, offset: 0 };

  get isComplete() {
    return this.isFulfilled && this.data.length >= this.meta.total;
  }

  get isEmpty() {
    return this.isFulfilled && this.data.length === 0;
  }

  async fetchData(params?: Object, isForce = false) {
    const res = await this.fetching(params, isForce);
    this.meta = res.meta;
    this.data = res.data || [];
    return res;
  }

  async fetchMoreData() {
    if (this.isFetching || this.isComplete) { return; }

    this.params.offset = this.data.length;
    const { data = [], meta } = await this.fetching(this.params);
    this.meta = meta;
    this.data.push(...data);
  }

  resetData() {
    this.isFulfilled = false;
    this.data = [];
  }

  unshift(item: any) {
    this.data.unshift(item);
    this.meta.total += 1;
  }

  findItemById(id: number | string) {
    return this.data.find((item: any) => Number(item.id) === Number(id));
  }

  removeItemById(id: number | string) {
    const index = this.data.findIndex((item: any) => Number(item.id) === Number(id));
    if (index !== -1) { this.data.splice(index, 1); }
  }

  replaceItem(newItem: any) {
    const index = this.data.findIndex((item: any) => Number(item.id) === Number(newItem.id));
    if (index > -1) { this.data.splice(index, 1, newItem); }
  }
}
