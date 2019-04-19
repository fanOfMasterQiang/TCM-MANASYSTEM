import { fetchData } from '@/services/chart/chart';

export default {
  namespace: 'chart',

  state: {
    ageData: [],
    genderData: [],
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fetchData);
      yield put({
        type: 'save',
        payload: response.Data,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      let ageCount = [];
      for (let i = 0; i < 10; i++) {
        ageCount.push({
          x: `${10 * i}-${10 * (i + 1)}`,
          y: 0,
        });
      }
      ageCount.push({
        x: '100以上',
        y: 0,
      });
      let genderData = [{ x: '男', y: 0 }, { x: '女', y: 0 }];
      payload.map(item => {
        let Age = (new Date().getTime() - new Date(item.Birthday).getTime())/(1000*60*60*24*365);
        switch (true) {
          case Age > 0 && Age < 10:
            ageCount[0].y++;
            break;
          case Age > 10 && Age < 20:
            ageCount[1].y++;
            break;
          case Age > 20 && Age < 30:
            ageCount[2].y++;
            break;
          case Age > 30 && Age < 40:
            ageCount[3].y++;
            break;
          case Age > 40 && Age < 50:
            ageCount[4].y++;
            break;
          case Age > 50 && Age < 60:
            ageCount[5].y++;
            break;
          case Age > 60 && Age < 70:
            ageCount[6].y++;
            break;
          case Age > 70 && Age < 80:
            ageCount[7].y++;
            break;
          case Age > 80 && Age < 90:
            ageCount[8].y++;
            break;
          case Age > 90 && Age < 100:
            ageCount[9].y++;
            break;
          default:
            ageCount[10].y++;
        }
        switch (true) {
          case item.Gender === 0:
            genderData[0].y++;
            break;
          default:
            genderData[1].y++;
        }
      });
      return {
        ...state,
        ageData:ageCount,
        genderData:genderData,
      };
    },
    clear() {
      return {
        ageData: [],
        genderData: [],
      };
    },
  },
};
