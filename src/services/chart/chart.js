// import { stringify } from 'qs';
// import Config from '../config';
import request from '@/utils/request';


export async function fetchData() {
  return request(`/api/user/getData`,{
    expirys:false
  });
}
