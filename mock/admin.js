import { parse } from 'url';

// mock tableListDataSource
let adminSource = [];
for (let i = 1; i <= 5; i += 1) {
  adminSource.push({
    Id: `${10000+i}`,
    Name: `mock${i}`,
    Gender: Math.round(Math.random()),
    Password:"123456",
    Authority: 'number',
  });
}
adminSource.push({
  Id: '10000',
  Name: 'admin',
  Gender: 0,
  Password:"000000",
  Authority: 'admin'
})

function query(req, res, u) {
  const result = {
    Success:false,
    Data:null,
    Message:""
  };
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  if(!params.Id){
    result.Data =adminSource
  } else {
    adminSource.map(item => {
      if(item.Id === params.Id){
        result.Data = item;
      }
    });
  }
  if(!result.Data){
    result.Message = "Id错误"
  } else {
    result.Success =true
  }
  return res.json(result);
}

function login(req, res, u, b) {
  const result = {
    Success:false,
    Data:null,
    Message:""
  };
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const {Name,Password} = body;
  if(!Name || !Password){
    result.Message = "姓名或密码不能为空"
    return res.json(result);
  }

  adminSource.map(item => {
    if(item.Name === Name && item.Password === Password){
      result.Data = item;
    }
  });
  if(!result.Data){
    result.Message = "姓名或密码错误"
  } else{
    result.Success = true;
  }
  return res.json(result);
}

function addNumber(req, res, u, b) {
  const result = {
    Success:false,
    Data:null,
    Message:""
  };
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const {Name,Gender,Password,Authority } = body;
  if(!Name || !Password || !Authority){
    result.Message="请完善信息"
    return res.json(result)
  }
  adminSource.push({
    Id: `${10001+adminSource.length}`,
    Name: Name,
    Gender:Gender ,
    Password:Password,
    Authority: Authority,
  })
  result.Success =true;
  return res.json(result);
}

function changeNumber(req, res, u, b) {
  const result = {
    Success:false,
    Data:null,
    Message:""
  };
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const {Id,Name,Gender,Password,Authority } = body;
  if(!Id){
    result.Message="Id不能为空";
    return res.json(result);
  }
  adminSource.map(item => {
    if(item.Id ===Id){
      result.Success =true;
      Name && (item.Name =Name);
      Gender && (item.Gender =Gender);
      Password && (item.Password =Password);
      Authority && (item.Authority =Authority);
    }
  });

  return res.json(result);
}

function changePwd(req, res, u, b) {
  const result = {
    Success:false,
    Data:null,
    Message:""
  };
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const {Id,PasswordOld,PasswordNew } = body;
  if(!Id){
    result.Message="Id不能为空";
    return res.json(result);
  }
  if(!PasswordOld){
    result.Message="原始密码不能为空";
    return res.json(result);
  }
  if(!PasswordNew){
    result.Message="新密码不能为空";
    return res.json(result);
  }
  adminSource.map(item => {
    if(item.Id === Id){
      if(item.Password !== PasswordOld){
        result.Message = "原始密码错误"
      }else {
        result.Success =true;
      }
    }
  });
  return res.json(result)
}

function delNumber(req, res, u, b) {
  const result = {
    Success:false,
    Data:null,
    Message:""
  };
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const {Id} = body;
  if(!Id){
    result.Message="Id不能为空";
    return res.json(result)
  }

  let delIdx = null;
  adminSource.map((item,index) => {
    if(item.Id ===Id){
      result.Success =true;
      delIdx =index;
    }
  });

  delIdx && adminSource.splice(delIdx,1)

  return res.json(result);
}

export default {
  'GET /api/admin/query': query,
  'POST /api/admin/login': login,
  'POST /api/admin/change': changeNumber,
  'POST /api/admin/changePwd': changePwd,
  'POST /api/admin/del': delNumber,
  'POST /api/admin/add': addNumber,
};
