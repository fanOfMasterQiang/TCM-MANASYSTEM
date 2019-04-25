import { queryPhyInfo} from '@/services/users/users';
import { Format} from '@/utils/utils';

export default {
  namespace: 'userInfo',

  state: {
    user:{},
    lineData:[]
  },

  effects: {
    *queryInfo({ payload }, { call, put }) {
      const response = yield call(queryPhyInfo, payload);
      if(response.Success){
        yield put({
          type: 'setData',
          payload: {
            user:response.Data.User,
            lineData:response.Data.PhyInfos
          },
        });
      }
    },
    *setStates({ payload, callback }, { put }) {
      yield put({
        type: 'set',
        payload: {
          ...payload
        },
      });
      if(callback) callback();
    },
  },

  reducers: {
    set(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setData(state, action) {
      const { user,lineData } = action.payload;

      let data = [[],[],[]];
      for (let j = 13; j >= 0; j--) {
        data[0].push({
          x: Format(new Date(new Date().getTime() - j * 60 * 60 * 24 * 1000), 'MM-dd'),
          y: 0,
        });
        data[1].push({
          x: Format(new Date(new Date().getTime() - j * 60 * 60 * 24 * 1000), 'MM-dd'),
          y: 0,
        });
        data[2].push({
          x: Format(new Date(new Date().getTime() - j * 60 * 60 * 24 * 1000), 'MM-dd'),
          y: 0,
        });
      }

      lineData.map((arr,index) => {
        arr.map(info => {
          let infoIndex = (new Date().getTime() - new Date(info.CreatedAt).getTime())/(60 * 60 * 24 * 1000);
          infoIndex = 13 - Math.floor(infoIndex);
          data[index][infoIndex] = {
            x:info.CreatedAt.substring(5),
            y:info.Result
          }
        })
      });
      data[0].push({x:'',y:0});
      data[1].push({x:'',y:0});
      data[2].push({x:'',y:0});
      return {
        ...state,
        lineData:data,
        user:user
      };
    },
  },
};
