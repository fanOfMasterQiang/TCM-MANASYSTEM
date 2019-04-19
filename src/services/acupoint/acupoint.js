import { stringify } from 'qs';
import Config from '../config';
import request from '@/utils/request';

export async function queryAcupoint(params) {
  return request(`${Config.service}/api/Acupoints/getById?${stringify(params)}`, {
    expirys: false,
  });
}

export async function queryAll() {
  return request(`${Config.service}/api/Acupoints/getAll`, {
    expirys: false,
  });
}

export async function queryKey(params) {
  return request(`${Config.service}/api/Acupoints/getByName?${stringify(params)}`, {
    expirys: false,
  });
}

export async function addAcupoint(params) {
  return request(`${Config.service}/api/Acupoints/add`, {
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
  return request(`${Config.service}/api/Acupoints/update`, {
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
  return request(`${Config.service}/api/Acupoints/deteByIds`, {
    method: 'POST',
    body: {
      ...params,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}


export async function addVideo(params) {
  return request(`${Config.service}/api/VideoSources/add`, {
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
  return request(`${Config.service}/api/VideoSources/getByAcuId?${stringify(params)}`, {
    expirys: false,
  });
}

export async function delVideo(params) {
  return request(`${Config.service}/api/VideoSources/deteByIds`, {
    method: 'POST',
    body: {
      ...params,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
