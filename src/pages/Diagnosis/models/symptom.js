import { queryKey, addSym, changeSym, delSym} from '@/services/diagnosis/symptom';

export default {
  namespace: 'symptom',

  state: {
    dataSource:[],
    showSource:[],
    current:1,
    pageSize:10,
    formValues: {},

    modalVisible: false,
    selectedRows: [],
    Item : {
      Id: "",
      Name: "",
      PinYin:"",
    },

  },

  effects: {
    *queryData({ payload }, { call, put }) {
      const response = yield call(queryKey, payload);
      if(response.Success){
        yield put({
          type: 'set',
          payload: {
            dataSource:response.Data,
            showSource:response.Data
          },
        });
      }
    },
    *addData({ payload, callback }, { call }) {
      yield call(addSym, payload);
      if (callback) callback();
    },
    *removeData({ payload, callback }, { call }) {
      yield call(delSym, payload);
      if (callback) callback();
    },
    *updateData({ payload, callback }, { call }) {
      yield call(changeSym, payload);
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
    queryPage(state, action) {
      let { payload } = action;
      let start = (payload.currentPage - 1) * payload.pageSize;
      let end = start + payload.pageSize;
      let newSource = state.dataSource.slice(start,end);
      return {
        ...state,
        showSource:newSource,
        current:payload.currentPage,
        pageSize:payload.pageSize,
      };
    },
  },
};
