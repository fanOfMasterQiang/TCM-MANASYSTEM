import { queryUsers} from '@/services/users/users';

export default {
  namespace: 'userInfo',

  state: {
    user:{},
    lineData:[]
  },

  effects: {
    *queryInfo({ payload }, { call, put }) {
      const response = yield call(queryUsers, payload);
      if(response.Success){
        yield put({
          type: 'set',
          payload: {
            user:response.Data,
            lineData:response.Data.Record
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
  },
};
