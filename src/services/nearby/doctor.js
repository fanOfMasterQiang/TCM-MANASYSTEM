import { stringify } from 'qs';
// import Config from '../config';
import request from '@/utils/request';

export async function queryDoctor(params) {
  return request(`/api/doctor/query?${stringify(params)}`, {
    expirys: false,
  });
}

export async function queryKey(params) {
  return request(`/api/doctor/key?${stringify(params)}`, {
    expirys: false,
  });
}

export async function addDoctor(params) {
  return request(`/api/doctor/add`, {
    method: 'POST',
    body: {
      ...params,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function changeDoctor(params) {
  return request(`/api/doctor/change`, {
    method: 'POST',
    body: {
      ...params,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function delDoctor(params) {
  return request(`/api/doctor/del`, {
    method: 'POST',
    body: {
      ...params,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
