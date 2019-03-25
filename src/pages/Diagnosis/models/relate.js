import { queryRelate, queryRest, queryKey, changeRelate} from '@/services/diagnosis/syndrome';

export default {
  namespace: 'synRelate',

  state: {
    itemId:"",
    relateItem:[],
    restItem:[]
  },

  effects: {
    *changeIdEff({ payload, callback }, { put}){
      yield put({
        type:"changeId",
        payload:payload
      });
      if(callback) callback()
    },
    *queryRelate({ payload }, { call, put }) {
      const response = yield call(queryRelate, payload);
      yield put({
        type: 'set',
        payload: {
          relateItem:response.Data || []
        },
      });
    },
    *queryRest({ payload, callback }, { call, put }) {
      const response = yield call(queryRest, payload);
      const {Data} = response;
      yield put({
        type: 'set',
        payload: {
          restItem:Data || []
        },
      });
      if (callback) callback();
    },
    *queryItemEff({ payload, callback }, { call, put }) {
      const response = yield call(queryKey, payload);
      yield put({
        type: 'effRest',
        payload: {
          restItem:response.Data
        },
      });
      if (callback) callback();
    },
    *updateRelate({ payload, callback }, { call }) {
      yield call(changeRelate, payload);
      if (callback) callback();
    },
    *setStates({ payload }, { put }) {
      yield put({
        type: 'set',
        payload: {
          ...payload
        },
      });
    },
  },

  reducers: {
    changeId(state, action){
      return {
        ...state,
        itemId:action.payload
      }
    },
    set(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    effRest(state, action) {
      let { restItem } = action.payload;
      let rest = [];
      if(restItem.constructor.prototype === Array.prototype){
        rest = restItem.slice();
        let relateItemText = JSON.stringify(state.relateItem);
        restItem = rest.filter( item => relateItemText.indexOf(item.Id) < 0 && item.Id!== state.itemId)
      }else {
        restItem = []
      }
      return {
        ...state,
        restItem,
      };
    },
  },
};
