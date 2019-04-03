import { stringify } from 'qs';
// import Config from '../config';
import request from '@/utils/request';

export async function queryAcupoint(params) {
  return request(`/api/acupoint/query?${stringify(params)}`, {
    expirys: false,
  });
}

export async function queryKey(params) {
  return request(`/api/acupoint/key?${stringify(params)}`, {
    expirys: false,
  });
}

export async function addAcupoint(params) {
  return request(`/api/acupoint/add`, {
    method: 'POST',
    body: {
      ...params,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function changeAcupoint(params) {
  return request(`/api/acupoint/change`, {
    method: 'POST',
    body: {
      ...params,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function delAcupoint(params) {
  return request(`/api/acupoint/del`, {
    method: 'POST',
    body: {
      ...params,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}


export async function upload(params) {
  return request(`/api/acuVideo/upload`, {
    method: 'POST',
    body: {
      ...params,
    },
    headers: {
      // 'Content-Type': 'multipart/form-data',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function queryVideo(params) {
  return request(`/api/acuVideo/query?${stringify(params)}`, {
    expirys: false,
  });
}

export async function delVideo(params) {
  return request(`/api/acuVideo/del`, {
    method: 'POST',
    body: {
      ...params,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
