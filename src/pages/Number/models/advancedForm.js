import {  changeNumber, delNumber, addNumber,queryAll } from '@/services/admin/admin';

export default {
  namespace: 'advanced',

  state: {
    numberData: [],
  },

  effects: {
    *queryNumbers({ payload }, { call, put }) {
      const response = yield call(queryAll, payload);
      yield put({
        type: 'saveNumber',
        payload: response.Data,
      });
    },
    *changeNumbers({ payload, callback }, { call, put }) {
      const response = yield call(changeNumber, payload);
      if (callback) callback();
    },
    *delNumbers({ payload, callback }, { call, put }) {
      const response = yield call(delNumber, payload);
      if (callback) callback();
    },
    *addNumbers({ payload, callback }, { call, put }) {
      const response = yield call(addNumber, payload);
      if (callback) callback();
    },
  },

  reducers: {
    saveNumber(state, { payload }) {
      let newData = [];
      newData = payload.filter(item => item.Authority !== 'admin');
      return {
        ...state,
        numberData: newData,
      };
    },
  },
};
