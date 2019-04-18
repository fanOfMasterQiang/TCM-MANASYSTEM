import { stringify } from 'qs';
import Config from '../config';
import request from '@/utils/request';

export async function queryRecipe(params) {
  return request(`${Config.service}/api/Recipes/getById?${stringify(params)}`, {
    expirys: false,
  });
}

export async function queryKey(params) {
  return request(`${Config.service}/api/Recipes/getByName?${stringify(params)}`, {
    expirys: false,
  });
}

export async function addRecipe(params) {
  return request(`${Config.service}/api/Recipes/add`, {
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
  return request(`${Config.service}/api/Recipes/update`, {
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
  return request(`${Config.service}/api/Recipes/deteByIds`, {
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
  return request(`${Config.service}/api/Recipes/upload`, {
    method: 'POST',
    body: {
      ...params,
    },
    headers: {
      'Content-Type': 'multipart/form-data',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function delVideo(params) {
  return request(`${Config.service}/api/Recipes/deleteVideo`, {
    method: 'POST',
    body: {
      ...params,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
