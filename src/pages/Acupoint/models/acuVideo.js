import { queryVideo, upload,delVideo} from '@/services/acupoint/acupoint';

export default {
  namespace: 'acuVideo',

  state: {
    AcupointId:'',
    dataSource:[],
    modalVisible:false,
    Item:{
      Id: ``,
      GroupType: null,
      Title: ``,
      Abstract: ``,
      Description: ``,
      Url: ``,
      AcupointId: ``,
    }
  },

  effects: {
    *queryData({ payload }, { call, put }) {
      const response = yield call(queryVideo, payload);
      if(response.Success){
        yield put({
          type: 'set',
          payload: {
            dataSource:response.Data,
          },
        });
      }
    },
    *uploadVideo({ payload, callback }, { call }) {
      yield call(upload, payload);
      if (callback) callback();
    },
    *removeData({ payload, callback }, { call }) {
      yield call(delVideo, payload);
      if (callback) callback();
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
