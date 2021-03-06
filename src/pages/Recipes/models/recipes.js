import { queryKey, delRecipe,delVideo,upload,queryRecipe } from '@/services/recipes/recipes';

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
      Title: '',
      Type: 0,
      Image: '',
      Practice: '',
      Url: '',
      Materials: "",
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
    *getRecipe({ payload }, { call, put }) {
      const response = yield call(queryRecipe, payload);
      if (response.Success) {
        yield put({
          type: 'set',
          payload: {
            Item:response.Data
          },
        });
      }
    },
    *removeData({ payload, callback }, { call }) {
      yield call(delRecipe, payload);
      if (callback) callback();
    },
    *deleteVideo({ payload, callback }, { call }) {
      yield call(delVideo, payload);
      if (callback) callback();
    },
    *uploadVideo({ payload, callback }, { call }) {
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
