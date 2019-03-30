import { queryDoctor, addDoctor, changeDoctor } from '@/services/nearby/doctor';
import { queryKey } from '@/services/diagnosis/syndrome';

export default {
  namespace: 'doctorInfo',

  state: {
    Doctor: {
      Id: '',
      Name: '',
      Gender: 0,
      Age: 0,
      Title: 1,
      Address: '',
      Lat: 0.0,
      Lon: 0.0,
      GoodAt: [],
    },
    searchData: [],
  },

  effects: {
    *queryInfo({ payload }, { call, put }) {
      const response = yield call(queryDoctor, payload);
      if (response.Success) {
        yield put({
          type: 'set',
          payload: {
            Doctor: response.Data,
          },
        });
      }
    },
    *searchSyn({ payload }, { call, put }) {
      const response = yield call(queryKey, payload);
      if (response.Success) {
        yield put({
          type: 'set',
          payload: {
            searchData: response.Data,
          },
        });
      }
    },
    *addItem({ payload, callback }, { call }) {
      const response = yield call(addDoctor, payload);
      if (response.Success && callback) callback();
    },
    *changeItem({ payload, callback }, { call }) {
      const response = yield call(changeDoctor, payload);
      if (response.Success && callback) callback();
    },
    *setStates({ payload, callback }, { put }) {
      yield put({
        type: 'set',
        payload: {
          ...payload,
        },
      });
      if (callback) callback();
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
