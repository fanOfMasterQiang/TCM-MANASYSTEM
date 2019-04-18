// import { stringify } from 'qs';
import Config from '../config';
import request from '@/utils/request';


export async function fetchData() {
  return request(`${Config.service}/api/UserInfos/getAll`,{
    expirys:false
  });
}
