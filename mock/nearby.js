import { parse } from 'url';

let doctorData = [];
for (let i = 0; i < 40; i += 1) {
  doctorData.push({
    Id: `doc-${1000 + i}`,
    Name: `Doc${i}`,
    Gender: Math.round(Math.random()),
    Age: Math.round(Math.random() * 40) + 20,
    Title: Math.round(Math.random() * 4) + 1,
    Address: `${i}路${i}号`,
    Lat: 3.14 + i * 0.02,
    Lon: 106.54 - i * 0.02,
    GoodAt: [
      {
        Id: `syn-${1000 + i}`,
        Name: `证型${i}`,
        PinYin: `ZX${i}`,
      },
      {
        Id: `syn-${1001 + i}`,
        Name: `证型${i + 1}`,
        PinYin: `ZX${i + 1}`,
      },
    ],
  });
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
    result.Data = doctorData;
  } else {
    doctorData.map(item => {
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
    result.Data = doctorData;
  } else {
    let cacheData = [];
    doctorData.map(item => {
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
  const { Name, Gender, Age, Address, Lat, Lon, GoodAt, Title } = body;
  if (!Name || !Age || !Address || !Title) {
    result.Message = '请完善信息';
    return res.json(result);
  }
  doctorData.push({
    Id: `doc-${1001 + doctorData.length}`,
    Name: Name,
    Gender: Gender - 0,
    Age: Age - 0,
    Title: Title - 0,
    Address: Address,
    Lat: Lat - 0.0,
    Lon: Lon - 0.0,
    GoodAt: GoodAt,
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
  const { Id, Name, Age, Address, Title } = body;
  if (!Id) {
    result.Message = 'Id不能为空';
    return res.json(result);
  }
  if (!Name || !Age || !Address || !Title) {
    result.Message = '请完善信息';
    return res.json(result);
  }
  doctorData = doctorData.slice().map(item => {
    if (item.Id === Id) {
      body.Title -= 0;
      body.Gender -= 0;
      return body;
    } else {
      return item;
    }
  });
  result.Success = true;
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
      doctorData.map(item => {
        if (item.Id === id) {
          item.needDel = true;
        }
      });
    });
  doctorData = doctorData.filter(item => item.needDel !== true);
  result.Success = true;
  return res.json(result);
}

export default {
  'GET /api/doctor/query': query,
  'GET /api/doctor/key': querykey,
  'POST /api/doctor/add': add,
  'POST /api/doctor/change': change,
  'POST /api/doctor/del': del,
};
