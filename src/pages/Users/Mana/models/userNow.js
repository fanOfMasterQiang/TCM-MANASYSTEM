import { queryUser} from '@/services/users/users';


export default {
  namespace: 'userNow',

  state: {
    User:{
      Id: "",
      Name: "",
      Gender:0,
      Phone:'',
      Born:'',
      Password:'',
      Avatar:'',
    }
  },

  effects: {
    *queryUser({ payload, callback }, { call,put }) {
      const response = yield call(queryUser, payload);
      yield put({
        type: 'set',
        payload: {
          User:response.Data
        },
      });
      if(callback) callback();
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
