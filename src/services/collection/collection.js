import { stringify } from 'qs';
import Config from '../config';
import request from '@/utils/request';

//查看全部收藏
export async function collectionList(params) {
  return request(`${Config.service}/api/UserCollections/getById?${stringify(params)}`,{
    expirys:false
  });
}

//删除收藏
export async function delCollection(params) {
  return request(`${Config.service}/api/UserCollections/deteByIds`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

//视频详情
export async function collectedVideo(params) {
  return request(`${Config.service}/api/VideoSources/getById?${stringify(params)}`,{
    expirys:false
  });
}



//食谱详情
export async function collectedRecipes(params) {
  return request(`${Config.service}/api/Recipes/getById?${stringify(params)}`,{
    expirys:false
  });
}



