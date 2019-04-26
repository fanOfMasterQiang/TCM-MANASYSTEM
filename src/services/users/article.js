import { stringify } from 'qs';
import Config from '../config';
import request from '@/utils/request';

// 查看全部收藏
export async function articleList(params) {
  return request(`${Config.service}/api/Articles/getByUserId?${stringify(params)}`,{
    expirys:false
  });
}

// 删除收藏
export async function delArticle(params) {
  return request(`${Config.service}/api/Articles/deteByIds`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
    traditional:true
  });
}



