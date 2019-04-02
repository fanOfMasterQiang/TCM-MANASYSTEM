import { parse } from 'url';

const Format = (d, fmt) => {
  let o = {
    'M+': d.getMonth() + 1, // 月份
    'd+': d.getDate(), // 日
    'h+': d.getHours(), // 小时
    'm+': d.getMinutes(), // 分
    's+': d.getSeconds(), // 秒
    'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
    S: d.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
};

let usersData = [];
let usersRelate = [];
for (let i = 0; i < 100; i += 1) {
  let recordXY = [];
  let recordXT = [];
  let recordTW = [];
  for (let j = 14; j > 0; j--) {
    recordXY.push({
      x: Format(new Date(new Date().getTime() - j * 60 * 60 * 24 * 1000), 'yyyy-MM-dd'),
      y: Math.round(Math.random() * 100),
    });
    recordXT.push({
      x: Format(new Date(new Date().getTime() - j * 60 * 60 * 24 * 1000), 'yyyy-MM-dd'),
      y: Math.round(Math.random() * 100),
    });
    recordTW.push({
      x: Format(new Date(new Date().getTime() - j * 60 * 60 * 24 * 1000), 'yyyy-MM-dd'),
      y: Math.round(Math.random() * 100),
    });
  }
  usersData.push({
    Id: `uid-${1000 + i}`,
    Name: `user${i}`,
    Phone:'',
    Born:Format(new Date(new Date().getTime() - (Math.random()*365*70)* 60 * 60 * 24 * 1000), 'yyyy-MM-dd'),
    Password:'',
    Avatar:'',
    Gender: Math.round(Math.random()),
    Age: Math.round(Math.random() * 100),
    Record: {
      recordXY,
      recordXT,
      recordTW
    },
  });
}

function getData(req, res) {
  const result = {
    Success: false,
    Data: null,
    Message: '',
  };
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
  usersData.map(item => {
    let Age = (new Date().getTime() - new Date(item.Born).getTime())/(1000*60*60*24*365);
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

  result.Success = true;
  result.Data = { ageCount, genderData };
  return res.json(result);
}

function query(req, res, u) {
  const result = {
    Success: false,
    Data: null,
    Message: '',
  };
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  if (!params.Id) {
    result.Data = usersData;
  } else {
    usersData.map(item => {
      if (item.Id === params.Id) {
        result.Data = item;
      }
    });
  }
  if (!result.Data) {
    result.Message = 'Id错误';
  } else {
    result.Success = true;
  }
  return res.json(result);
}

function querykey(req, res, u) {
  const result = {
    Success: false,
    Data: null,
    Message: '',
  };
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  if (!params.Key) {
    result.Data = usersData;
  } else {
    let cacheData = [];
    usersData.map(item => {
      if (item.Name.indexOf(params.Key) !== -1) {
        cacheData.push(item);
      }
    });
    result.Data = cacheData;
  }
  result.Success = true;
  return res.json(result);
}

function add(req, res, u, b) {
  const result = {
    Success: false,
    Data: null,
    Message: '',
  };
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { Name, Gender, Age } = body;
  if (!Name || !Age) {
    result.Message = '请完善信息';
    return res.json(result);
  }
  usersData.push({
    Id: `uid-${1001 + usersData.length}`,
    Name: Name,
    Gender: Gender - 0,
    Age: Age - 0,
  });
  result.Success = true;
  return res.json(result);
}

function change(req, res, u, b) {
  const result = {
    Success: false,
    Data: null,
    Message: '',
  };
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { Id, Name, Gender, Born,Avatar } = body;
  if (!Id) {
    result.Message = 'Id不能为空';
    return res.json(result);
  }
  usersData = usersData.map(item => {
    if (item.Id === Id) {
      result.Success = true;
      return {
        ...body,
        Gender :  Gender - 0,
      }
    }else {
      return item;
    }
  });

  return res.json(result);
}

function del(req, res, u, b) {
  const result = {
    Success: false,
    Data: null,
    Message: '',
  };
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { Ids } = body;
  if (!Ids) {
    result.Message = 'Id不能为空';
    return res.json(result);
  }

  Array.isArray(Ids) &&
    Ids.map(id => {
      usersData.map(item => {
        if (item.Id === id) {
          item.needDel = true;
        }
      });
    });
  usersData = usersData.filter(item => item.needDel !== true);
  result.Success = true;
  return res.json(result);
}

// relate
function changeRelate(req, res, u, b) {
  const result = {
    Success: false,
    Data: null,
    Message: '',
  };
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { UserId, RelateIds } = body;
  if (!UserId) {
    result.Message = '请完善UserId';
    return res.json(result);
  }
  usersRelate = usersRelate.filter(item => item.UserId !== UserId);
  Array.isArray(RelateIds) &&
    RelateIds.map(item => {
      usersRelate.push({
        Id: `${usersRelate.length}`,
        UserId: UserId,
        RelateId: item,
      });
    });
  result.Success = true;
  return res.json(result);
}

function queryRelate(req, res, u) {
  const result = {
    Success: false,
    Data: null,
    Message: '',
  };
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  if (!params.UserId) {
    result.Message = 'UserId undefined';
    return res.json(result);
  }

  let rUID = [];
  let cacheData = [];
  usersRelate.map(r => {
    if (r.UserId === params.UserId) {
      rUID.push(r.RelateId);
    }
  });
  if (rUID === []) {
    result.Data = [];
    result.Success = true;
    return res.json(result);
  }

  rUID.map(item => {
    usersData.map(user => {
      if (user.Id === item) {
        cacheData.push(user);
      }
    });
  });

  result.Data = cacheData;
  result.Success = true;
  return res.json(result);
}

function queryRest(req, res, u) {
  const result = {
    Success: false,
    Data: null,
    Message: '',
  };
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  if (!params.UserId) {
    result.Message = 'UserId undefined';
    return res.json(result);
  }

  let rUID = [];
  let cacheData = [];
  usersRelate.map(r => {
    if (r.UserId === params.UserId) {
      rUID.push(r.RelateId);
    }
  });
  if (!rUID) {
    usersData.map(item => {
      if (item.Id !== params.UserId) {
        cacheData.push(item);
      }
    });
    result.Data = cacheData;
    result.Success = true;
    return res.json(result);
  }

  let rText = JSON.stringify(rUID);
  cacheData = usersData.filter(item => rText.indexOf(item.Id) === -1 && item.Id !== params.UserId);

  result.Data = cacheData;
  result.Success = true;
  return res.json(result);
}

export default {
  'GET /api/user/getData': getData,
  'GET /api/user/query': query,
  'GET /api/user/key': querykey,
  'POST /api/user/add': add,
  'POST /api/user/change': change,
  'POST /api/user/del': del,

  'POST /api/user/changeRelate': changeRelate,
  'GET /api/user/queryRelate': queryRelate,
  'GET /api/user/queryRest': queryRest,
};
