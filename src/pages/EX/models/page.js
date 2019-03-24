import { queryDisease, addDisease, removeDisease, updateDisease} from '@/services/coustomApi/diseaseApi';

export default {
  namespace: 'page',

  state: {
    dataSource:[],
    showSource:[],
    current:1,
    pageSize:10,
    formValues: {},

    relateData:[],
    restData:[],
    modalVisible: false,
    relateModalVisible: false,
    selectedRows: [],
    Disease : {
      Id: "",
      Name: "",
      PinYin:"",
      Prevalent:false,
    },

  },

  effects: {
    *queryDisease({ payload }, { call, put }) {
      const response = yield call(queryDisease, payload);
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
    *addDisease({ payload, callback }, { call }) {
      yield call(addDisease, payload);
      if (callback) callback();
    },
    *removeDisease({ payload, callback }, { call }) {
      yield call(removeDisease, payload);
      if (callback) callback();
    },
    *updateDisease({ payload, callback }, { call }) {
      yield call(updateDisease, payload);
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
