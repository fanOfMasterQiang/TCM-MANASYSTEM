import { queryNumber,changeProfile,changePwd} from '@/services/admin/admin';
import {message} from "antd"

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    // basicLayout
    *fetchCurrent({payload}, { call, put }) {
      const avatar =require("../assets/logo.svg");
      const response = yield call(queryNumber,payload);
      if(response.Data!== null && !Array.isArray(response.Data)){
        response.Data.avatar = avatar;
        yield put({
          type: 'saveCurrentUser',
          payload: response.Data,
        });
      } else {
        yield put({
          type: 'login/logout',
        });
      }
    },
    *changeBaseInfo({payload, callback}, { call, put }) {
      const response = yield call(changeProfile,payload);
      if(response.Success){
        message.success("修改成功");
        yield put({
          type: 'saveCurrentUser',
          payload: payload,
        });
        if(callback) callback();
      } else {
        message.error(response.Message || response.InnerMessage);
      }

    },
    *changePassword({payload,callback}, { call }) {
      const response = yield call(changePwd,payload);
      if(response.Success){
        if(callback) callback();
      } else {
        message.error(response.Message || response.InnerMessage);
      }
    },
  },

  reducers: {
    // basicLayout
    saveCurrentUser(state, action) {
      sessionStorage.setItem("userId",action.payload.Id);
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...action.payload
        },
      };
    },
    // models/global
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
