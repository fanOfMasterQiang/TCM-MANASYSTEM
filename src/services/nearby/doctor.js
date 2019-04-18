import { stringify } from 'qs';
import Config from '../config';
import request from '@/utils/request';

export async function queryAll() {
  return request(`${Config.service}/api/DoctorInfoes/getAll`, {
    expirys: false,
  });
}

export async function queryDoctor(params) {
  return request(`${Config.service}/api/DoctorInfoes/getById?${stringify(params)}`, {
    expirys: false,
  });
}

export async function queryKey(params) {
  return request(`${Config.service}/api/DoctorInfoes/getByName?${stringify(params)}`, {
    expirys: false,
  });
}

export async function addDoctor(params) {
  return request(`${Config.service}/api/DoctorInfoes/add`, {
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
  return request(`${Config.service}/api/DoctorInfoes/update`, {
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
  return request(`${Config.service}/api/DoctorInfoes/deteByIds`, {
    method: 'POST',
    body: {
      ...params,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
