import { articleList,delArticle} from '@/services/users/article';

export default {
  namespace: 'article',

  state: {
    showData:[],
    articleData:[],
    Article:{
      Id:"",
      Title:"",
      Abstract:"",
      CreatAt:"",
      Contents:"",
      Picture:"",
      UserId:"",
    },
    ArticleVisible:false
  },

  effects: {
    *articleList({ payload,callback }, { call, put }) {
      const response = yield call(articleList, payload);
      if(response.Success){
        yield put({
          type: 'set',
          payload: {
            showData:response.Data,
            articleData:response.Data,
          },
        });
      }
      if(callback) callback(response);
    },

    *delArticle({ payload, callback }, { call }) {
      yield call(delArticle, payload);
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
