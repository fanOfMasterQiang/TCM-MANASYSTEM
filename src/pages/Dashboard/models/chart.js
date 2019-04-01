import { fetchData } from '@/services/chart/chart';

export default {
  namespace: 'chart',

  state: {
    ageData: [],
    genderData: [],
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fetchData);
      yield put({
        type: 'save',
        payload: response.Data,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ageData:payload.ageCount,
        genderData:payload.genderData,
      };
    },
    clear() {
      return {
        ageData: [],
        genderData: [],
      };
    },
  },
};
