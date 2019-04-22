export default {
  namespace: 'routerParams',

  state: {
    AcupointId:'',
    DoctorId:'',
    RecipeId:'',
    UserId:'',
  },

  effects: {
    *setStates({payload}, { _, put }) {
      yield put({
        type: 'set',
        payload: payload,
      });
    },
  },

  reducers: {
    set(state, action) {
      const {payload} = action;
      for(let key in payload){
        if(payload.hasOwnProperty(key)){
          payload[key] !== undefined && sessionStorage.setItem(key,JSON.stringify(payload[key]))
        }
      }
      return {
        ...state,
        ...action.payload,
      };
    },
    reset(state, action) {
      let obj ={};
      for(let k in state){
        if(state.hasOwnProperty(k)){
          let session = sessionStorage.getItem(k);
          session && (obj[k] = JSON.parse(session))
        }
      }
      return {
        ...state,
        ...obj,
      };
    },
  },

  subscriptions: {
    restore({ dispatch,_ }) {
      dispatch({
        type: 'reset',
      });
    },
  },
};
