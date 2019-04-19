import { queryPhyInfo} from '@/services/users/users';

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

      lineData.map((arr,index) => {
        arr.map(info => {
          data[index].push({
            x:info.CreatedAt,
            y:info.Result
          })
        })
      });
      console.log("data",data)
      return {
        ...state,
        lineData:data,
        user:user
      };
    },
  },
};
