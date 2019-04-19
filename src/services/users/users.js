import { stringify } from 'qs';
import Config from '../config';
import request from '@/utils/request';

export async function queryUsers() {
  return request(`${Config.service}/api/UserInfos/getAll?}`,{
    expirys:false
  });
}

export async function queryUser(params) {
  return request(`${Config.service}/api/UserInfos/getById?${stringify(params)}`,{
    expirys:false
  });
}

export async function queryKey(params) {
  return request(`${Config.service}/api/UserInfos/getByName?${stringify(params)}`,{
    expirys:false
  });
}

export async function addUser(params) {
  return request(`${Config.service}/api/UserInfos/add`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

export async function changeUser(params) {
  return request(`${Config.service}/api/UserInfos/update`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

export async function delUser(params) {
  return request(`${Config.service}/api/UserInfos/deteByIds`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}


export async function queryPhyInfo(params) {
  return request(`${Config.service}/api/UserInfos/getPhyByUserId?${stringify(params)}`,{
    expirys:false
  });
}

export async function queryRelate(params) {
  return request(`${Config.service}/api/UserInfos/getRelateUser?${stringify(params)}`,{
    expirys:false
  });
}

export async function queryRest(params) {
  return request(`${Config.service}/api/UserInfos/getRestUser?${stringify(params)}`,{
    expirys:false
  });
}

export async function changeRelate(params) {
  return request(`${Config.service}/api/FamilyRelates/update`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}


