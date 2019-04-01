import { queryRecipe, addRecipe, changeRecipe } from '@/services/recipes/recipes';

export default {
  namespace: 'recipeInfo',

  state: {
    Recipes: {
      Id: '',
      Name: '',
      Type: 0,
      Image: '',
      Practice: '',
      Video: '',
      Material: '',
    },
  },

  effects: {
    *queryInfo({ payload }, { call, put }) {
      const response = yield call(queryRecipe, payload);
      if (response.Success) {
        yield put({
          type: 'set',
          payload: {
            Recipes: response.Data,
          },
        });
      }
    },
    *addItem({ payload, callback }, { call }) {
      const response = yield call(addRecipe, payload);
      if (response.Success && callback) callback();
    },
    *changeItem({ payload, callback }, { call }) {
      const response = yield call(changeRecipe, payload);
      if (response.Success && callback) callback();
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
  },
};
