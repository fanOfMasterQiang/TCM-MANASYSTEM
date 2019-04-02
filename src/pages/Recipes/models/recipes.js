import { queryKey, delRecipe,upload } from '@/services/recipes/recipes';

export default {
  namespace: 'recipes',

  state: {
    dataSource: [],
    showSource: [],
    current: 1,
    pageSize: 10,
    formValues: {},

    modalVisible: false,
    selectedRows: [],
    Item: {
      Id: '',
      Name: '',
      Type: 0,
      Image: '',
      Practice: '',
      Video: '',
      Materials: [],
    },
  },

  effects: {
    *queryData({ payload }, { call, put }) {
      const response = yield call(queryKey, payload);
      if (response.Success) {
        yield put({
          type: 'set',
          payload: {
            dataSource: response.Data,
            showSource: response.Data,
            current:1
          },
        });
      }
    },
    *removeData({ payload, callback }, { call }) {
      yield call(delRecipe, payload);
      if (callback) callback();
    },
    *upload({ payload, callback }, { call }) {
      yield call(upload, payload);
      if (callback) callback();
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
    queryPage(state, action) {
      let { payload } = action;
      let start = (payload.currentPage - 1) * payload.pageSize;
      let end = start + payload.pageSize;
      let newSource = state.dataSource.slice(start, end);
      return {
        ...state,
        showSource: newSource,
        current: payload.currentPage,
        pageSize: payload.pageSize,
      };
    },
  },
};
