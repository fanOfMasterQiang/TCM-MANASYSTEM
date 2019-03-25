import {parse} from "url";

let usersData = [];
let usersRelate = [];
for (let i = 0; i < 100; i += 1) {
  usersData.push({
    Id:`uid-${1000+i}`,
    Name:`user${i}`,
    Gender:Math.round(Math.random()),
    Age:Math.round(Math.random()*100)
  });
}

function getData(req, res,){
  const result = {
    Success:false,
    Data:null,
    Message:""
  };
  let ageCount = [];
  for(let i=0;i<10;i++){
    ageCount.push({
      x:`${10*i}-${10*(i+1)}`,
      y:0
    })
  }
  ageCount.push({
    x:'100以上',
    y:0
  });
  let genderData =[
    {x:'男',y:0},
    {x:'女',y:0}
  ];
  usersData.map(item => {
    switch (true) {
      case (item.Age>0 && item.Age<10):
        ageCount[0].y++;
        break;
      case (item.Age>10 && item.Age<20):
        ageCount[1].y++;
        break;
      case (item.Age>20 && item.Age<30):
        ageCount[2].y++;
        break;
      case (item.Age>30 && item.Age<40):
        ageCount[3].y++;
        break;
      case (item.Age>40 && item.Age<50):
        ageCount[4].y++;
        break;
      case (item.Age>50 && item.Age<60):
        ageCount[5].y++;
        break;
      case (item.Age>60 && item.Age<70):
        ageCount[6].y++;
        break;
      case (item.Age>70 && item.Age<80):
        ageCount[7].y++;
        break;
      case (item.Age>80 && item.Age<90):
        ageCount[8].y++;
        break;
      case (item.Age>90 && item.Age<100):
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

  result.Success =true;
  result.Data ={ageCount,genderData};
  return res.json(result)
}

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
    result.Data =usersData
  } else {
    usersData.map(item => {
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

function querykey(req, res, u) {
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
  if(!params.Key){
    result.Data =usersData
  } else {
    let cacheData = [];
    usersData.map(item => {
      if(item.Name.indexOf(params.Key)!==-1){
        cacheData.push(item);
      }
    });
    result.Data =cacheData;
  }
  result.Success =true;
  return res.json(result);
}

function add(req, res, u, b) {
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
  const {Name,Gender,Age } = body;
  if(!Name || !Age){
    result.Message="请完善信息";
    return res.json(result)
  }
  usersData.push({
    Id: `uid-${1001+usersData.length}`,
    Name: Name,
    Gender:Gender-0 ,
    Age:Age-0,
  });
  result.Success =true;
  return res.json(result);
}

function change(req, res, u, b) {
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
  const {Id,Name,Gender,Age} = body;
  if(!Id){
    result.Message="Id不能为空";
    return res.json(result);
  }
  usersData.map(item => {
    if(item.Id ===Id){
      result.Success =true;
      Name && (item.Name =Name);
      Gender && (item.Gender =Gender-0);
      Age && (item.Age =Age-0);
    }
  });

  return res.json(result);
}

function del(req, res, u, b) {
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
  const {Ids} = body;
  if(!Ids){
    result.Message="Id不能为空";
    return res.json(result)
  }

  Array.isArray(Ids) &&
    Ids.map( id => {
      usersData.map((item) => {
        if(item.Id ===id){
          item.needDel =true;
        }
      });
    });
  usersData = usersData.filter(item => item.needDel !== true);
  result.Success =true;
  return res.json(result);
}



// relate
function changeRelate(req, res, u, b) {
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
  const {UserId,RelateIds } = body;
  if(!UserId){
    result.Message="请完善UserId";
    return res.json(result)
  }
  usersRelate = usersRelate.filter(item => item.UserId !== UserId);
  Array.isArray(RelateIds) && RelateIds.map(item => {
    usersRelate.push({
      Id:`${usersRelate.length}`,
      UserId:UserId,
      RelateId:item
    })
  });
  result.Success =true;
  return res.json(result);
}

function queryRelate(req, res, u) {
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
  if(!params.UserId){
    result.Message = "UserId undefined";
    return res.json(result);
  }

  let rUID =[];
  let cacheData =[];
  usersRelate.map(r => {
    if(r.UserId === params.UserId){
      rUID.push(r.RelateId)
    }
  });
  if(rUID === []){
    result.Data =[];
    result.Success =true;
    return res.json(result);
  }

  rUID.map(item => {
    usersData.map(user => {
      if(user.Id === item){
        cacheData.push(user)
      }
    })
  });

  result.Data =cacheData;
  result.Success =true;
  return res.json(result);
}

function queryRest(req, res, u) {
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
  if(!params.UserId){
    result.Message = "UserId undefined";
    return res.json(result);
  }

  let rUID =[];
  let cacheData =[];
  usersRelate.map(r => {
    if(r.UserId === params.UserId){
      rUID.push(r.RelateId)
    }
  });
  if(!rUID){
    usersData.map(item => {
      if(item.Id !== params.UserId){
        cacheData.push(item)
      }
    });
    result.Data =cacheData
    result.Success =true;
    return res.json(result);
  }

  let rText =JSON.stringify(rUID);
  cacheData = usersData.filter(item => rText.indexOf(item.Id) === -1 && item.Id !== params.UserId);

  result.Data =cacheData;
  result.Success =true;
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
