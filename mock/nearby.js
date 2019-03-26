import { parse } from 'url';

let doctorData = [];
for (let i = 0; i < 40; i += 1) {
  doctorData.push({
    Id: `doc-${1000 + i}`,
    Name: `Doc${i}`,
    Gender: Math.round(Math.random()),
    Age: Math.round(Math.random() * 100),
    Title: Math.round(Math.random() * 5),
    Address: `${i}路${i}号`,
    Lat: 3.14 + i * 0.02,
    Lon: 106.54 - i * 0.02,
    GoodAt: [`syn-${1000 + i}`, `syn-${1002 + i}`],
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
    Title: Title,
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
  doctorData.map(item => {
    if (item.Id === Id) {
      result.Success = true;
      item = { ...body };
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
