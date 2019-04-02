import { stringify } from 'qs';
// import Config from '../config';
import request from '@/utils/request';

export async function queryRecipe(params) {
  return request(`/api/recipe/query?${stringify(params)}`, {
    expirys: false,
  });
}

export async function queryKey(params) {
  return request(`/api/recipe/key?${stringify(params)}`, {
    expirys: false,
  });
}

export async function addRecipe(params) {
  return request(`/api/recipe/add`, {
    method: 'POST',
    body: {
      ...params,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function changeRecipe(params) {
  return request(`/api/recipe/change`, {
    method: 'POST',
    body: {
      ...params,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function delRecipe(params) {
  return request(`/api/recipe/del`, {
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
  return request(`/api/recipe/upload`, {
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
