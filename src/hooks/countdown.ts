import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { omit } from 'lodash-es';
import { SESSION_STORAGE_KEYS } from '@/constants';

dayjs.extend(duration);

export interface CountDownOptions {
  key?: string; // 有 key 将保存到 sessionStorage 中，保持刷新浏览器也会继续倒计时
  duration?: number; // 倒计时时长，单位：毫秒
  endTime?: number | string | Date; // 结束时间, 可被 dayjs 解析的时间格式
  onFinished?: (options: ReturnType<typeof useCountDown>) => void; // 倒计时结束回调
}

function getStorage() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEYS.COUNTDOWN_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function getStorageEndTime(key?: string): string {
  if (!key) { return ''; }
  return getStorage()[key] || '';
}

function resetStorageEndTime(key?: string) {
  if (!key) { return ''; }
  const storage = getStorage();
  sessionStorage.setItem(SESSION_STORAGE_KEYS.COUNTDOWN_KEY, JSON.stringify(omit(storage, key)));
}

function setStorageEndTime(options: CountDownOptions) {
  const { endTime, key, duration } = options;

  if (!endTime && !duration) {
    const error = new Error('endTime 和 duration 不能同时为空');
    Error.captureStackTrace(error, useCountDown);
    throw error;
  }

  // 如果没有 key, 或者已经设置过了，就不再设置
  if (!key || getStorageEndTime(key)) { return; }

  const newEndTime = endTime || dayjs().add(duration as number, 'millisecond').format();

  sessionStorage.setItem(SESSION_STORAGE_KEYS.COUNTDOWN_KEY, JSON.stringify({
    ...getStorage(),
    [key]: newEndTime,
  }));
}

export function useCountDown(options: CountDownOptions) {
  setStorageEndTime(options);

  const duration = computed(() => {
    const storageEndTime = getStorageEndTime(options.key);
    const { endTime, duration } = storageEndTime ? { ...options, endTime: storageEndTime } : options;
    // 优先 endTime
    if (endTime) {
      return dayjs(endTime).diff(dayjs());
    }
    return duration || 0;
  });

  const count = ref(duration.value);

  let timerId: ReturnType<typeof setTimeout> | null = null;

  function start() {
    count.value = duration.value;

    if (count.value <= 0) {
      return;
    }

    if (timerId) {
      clearInterval(timerId);
    }

    timerId = setInterval(() => {
      count.value -= 1000;
    }, 1000);
  }

  function pause() {
    if (timerId) {
      clearInterval(timerId);
    }
  }

  function restart() {
    pause();
    count.value = duration.value;
    start();
  }

  const current = computed(() => {
    const duration = dayjs.duration(count.value);

    return {
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
      milliseconds: duration.milliseconds(),
      finished: count.value <= 0,
    };
  });

  const returnObj = {
    count,
    start,
    pause,
    restart,
    current,
  };

  watch(count, (value) => {
    if (value <= 0) {
      pause();
      resetStorageEndTime(options.key);
      if (options.onFinished) {
        options.onFinished(returnObj);
      }
    }
  }, { immediate: true });

  return returnObj;
}
