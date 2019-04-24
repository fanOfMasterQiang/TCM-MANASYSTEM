import { collectionList,collectedVideo,collectedRecipes,delCollection} from '@/services/collection/collection';
import { Format} from '@/utils/utils';


export default {
  namespace: 'collection',

  state: {
    boo:false,
    user:{},
    Id:'',
    Name:"",
    showData:[],
    collectionData:[],
    Video:[],
    Recipe:[]
  },

  effects: {
    *collectionList({ payload,callback }, { call, put }) {
      const response = yield call(collectionList, payload);
        yield put({
          type: 'show',
          payload: {
            UserId:payload,
            boo:response.Success,
            collectionData:response.Data,
            showData:response.Data
          },
        });
        if(callback) callback();
    },
    *collectedVideo({ payload,callback }, { call, put }) {
      const response = yield call(collectedVideo, payload);
      if(response.Success){
        yield put({
          type: 'show',
          payload: {
            Id:payload,
            Video:response.Data,
            // showData:response.Data
          },
        });
        if(callback) callback();
      }
    },
    *collectedRecipes({ payload,callback }, { call, put }) {
      const response = yield call(collectedRecipes, payload);
      if(response.Success){
        yield put({
          type: 'show',
          payload: {
            Id:payload,
            Recipe:response.Data,
            // showData:response.Data
          },
        });
        if(callback) callback();
      }
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
    show(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setData(state, action) {
      const { user,collectionData } = action.payload;

      let data = [[],[],[]];
      for (let j = 13; j >= 0; j--) {
        data[0].push({
          x: Format(new Date(new Date().getTime() - j * 60 * 60 * 24 * 1000), 'MM-dd'),
          y: 0,
        });
        data[1].push({
          x: Format(new Date(new Date().getTime() - j * 60 * 60 * 24 * 1000), 'MM-dd'),
          y: 0,
        });
        data[2].push({
          x: Format(new Date(new Date().getTime() - j * 60 * 60 * 24 * 1000), 'MM-dd'),
          y: 0,
        });
      }

      lineData.map((arr,index) => {
        arr.map(info => {
          let infoIndex = (new Date().getTime() - new Date(info.CreatedAt).getTime())/(60 * 60 * 24 * 1000);
          infoIndex = 13 - Math.floor(infoIndex);
          data[index][infoIndex] = {
            x:info.CreatedAt.substring(5),
            y:info.Result
          }
        })
      });
      data[0].push({x:'',y:0});
      data[1].push({x:'',y:0});
      data[2].push({x:'',y:0});
      return {
        ...state,
        collectionData:data,
        user:user
      };
    },
  },
};
