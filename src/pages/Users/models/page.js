import { queryKey, addUser, changeUser, delUser} from '@/services/users/users';

export default {
  namespace: 'page',

  state: {
    dataSource:[],
    showSource:[],
    current:1,
    pageSize:10,
    formValues: {},

    modalVisible: false,
    relateModalVisible: false,
    selectedRows: [],
    Item : {
      Id: "",
      Name: "",
      Gender:0,
      Phone:'',
      Born:'',
      Password:'',
      Avatar:'',
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
      yield call(addUser, payload);
      if (callback) callback();
    },
    *removeData({ payload, callback }, { call }) {
      yield call(delUser, payload);
      if (callback) callback();
    },
    *updateData({ payload, callback }, { call }) {
      yield call(changeUser, payload);
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
