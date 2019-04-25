import { collectionList,collectedVideo,collectedRecipes,delCollection} from '@/services/users/collection';
import { Format} from '@/utils/utils';


export default {
  namespace: 'collection',

  state: {
    showData:[],
    collectionData:[],

    Video:[],
    Recipe:[]
  },

  effects: {
    *collectionList({ payload,callback }, { call, put }) {
      const response = yield call(collectionList, payload);
      if(response.Success){
        yield put({
          type: 'setData',
          payload: response.Data,
        });
      }
      if(callback) callback(response);
    },

    *filterCollection({ payload,callback }, { put }) {
      yield put({
        type: 'filter',
        payload: {
          Type:payload.Type
        },
      });
      if(callback) callback();
    },

    *delCollection({ payload, callback }, { call }) {
      yield call(delCollection, payload);
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
    setData(state, {payload}) {
      let show = [];
      Array.isArray(payload.recipes) && payload.recipes.map(recipe => {
        show.push({
          Id:recipe.Id,
          Type:0,
          Title:recipe.Title
        })
      })
      Array.isArray(payload.videosources) && payload.videosources.map(video => {
        show.push({
          Id:video.Id,
          Type:1,
          Title:video.Title
        })
      })

      return {
        ...state,
        showData:show,
        collectionData:show,
      };
    },
    filter(state, {payload}) {
      let newData = [];
      newData = state.collectionData.filter(data => data.Type === payload.Type)
      return {
        ...state,
        showData:newData,
      };
    },
  },
};
