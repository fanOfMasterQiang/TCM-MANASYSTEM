import { parse } from "url";

let SyndromeData=[];
for(let i=0;i<50;i++){
  SyndromeData.push({
    Id:`syn-${1000+i}`,
    Name:`证型${i}`,
    PinYin:`ZX${i}`
  })
}

let SymptomData=[];
for(let i=0;i<50;i++){
  SymptomData.push({
    Id:`sym-${1000+i}`,
    Name:`症状${i}`,
    PinYin:`ZZ${i}`
  })
}

let relateData =[];

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
    result.Data =SyndromeData
  } else {
    SyndromeData.map(item => {
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

function querykeySyn(req, res, u) {
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
    result.Data =SyndromeData
  } else {
    let cacheData = [];
    SyndromeData.map(item => {
      if(item.Name.indexOf(params.Key)!==-1 || item.PinYin.indexOf(params.Key)!==-1){
        cacheData.push(item);
      }
    });
    result.Data =cacheData;
  }
  result.Success =true;
  return res.json(result);
}

function querykeySym(req, res, u) {
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
    result.Data =SymptomData
  } else {
    let cacheData = [];
    SymptomData.map(item => {
      if(item.Name.indexOf(params.Key)!==-1 || item.PinYin.indexOf(params.Key)!==-1){
        cacheData.push(item);
      }
    });
    result.Data =cacheData;
  }
  result.Success =true;
  return res.json(result);
}

function addSyn(req, res, u, b) {
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
  const {Name,PinYin } = body;
  if(!Name || !PinYin){
    result.Message="请完善信息";
    return res.json(result)
  }
  SyndromeData.push({
    Id: `uid-${1001+SyndromeData.length}`,
    Name: Name,
    PinYin:PinYin ,
  });
  result.Success =true;
  return res.json(result);
}

function addSym(req, res, u, b) {
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
  const {Name,PinYin } = body;
  if(!Name || !PinYin){
    result.Message="请完善信息";
    return res.json(result)
  }
  SymptomData.push({
    Id: `uid-${1001+SymptomData.length}`,
    Name: Name,
    PinYin:PinYin ,
  });
  result.Success =true;
  return res.json(result);
}

function changeSyn(req, res, u, b) {
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
  const {Id,Name,PinYin} = body;
  if(!Id){
    result.Message="Id不能为空";
    return res.json(result);
  }
  SyndromeData.map(item => {
    if(item.Id ===Id){
      result.Success =true;
      Name && (item.Name =Name);
      PinYin && (item.PinYin =PinYin);
    }
  });

  return res.json(result);
}

function changeSym(req, res, u, b) {
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
  const {Id,Name,PinYin} = body;
  if(!Id){
    result.Message="Id不能为空";
    return res.json(result);
  }
  SymptomData.map(item => {
    if(item.Id ===Id){
      result.Success =true;
      Name && (item.Name =Name);
      PinYin && (item.PinYin =PinYin);
    }
  });

  return res.json(result);
}

function delSyn(req, res, u, b) {
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
    SyndromeData.map((item) => {
      if(item.Id ===id){
        item.needDel =true;
      }
    });
  });
  SyndromeData = SyndromeData.filter(item => item.needDel !== true);
  result.Success =true;
  return res.json(result);
}

function delSym(req, res, u, b) {
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
    SymptomData.map((item) => {
      if(item.Id ===id){
        item.needDel =true;
      }
    });
  });
  SymptomData = SymptomData.filter(item => item.needDel !== true);
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
  const {SynId,RelateIds } = body;
  if(!SynId){
    result.Message="请完善SynId";
    return res.json(result)
  }
  relateData = relateData.filter(item => item.SynId !== SynId);
  Array.isArray(RelateIds) && RelateIds.map(item => {
    relateData.push({
      Id:`${relateData.length}`,
      SynId:SynId,
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
  if(!params.SynId){
    result.Message = "SynId undefined";
    return res.json(result);
  }

  let rID =[];
  let cacheData =[];
  relateData.map(r => {
    if(r.SynId === params.SynId){
      rID.push(r.RelateId)
    }
  });
  if(rID === []){
    result.Data =[];
    result.Success =true;
    return res.json(result);
  }

  rID.map(item => {
    SymptomData.map(s => {
      if(s.Id === item){
        cacheData.push(s)
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
  if(!params.SynId){
    result.Message = "SynId undefined";
    return res.json(result);
  }

  let rID =[];
  let cacheData =[];
  relateData.map(r => {
    if(r.SynId === params.SynId){
      rID.push(r.RelateId)
    }
  });
  if(!rID){
    result.Data =SymptomData
    result.Success =true;
    return res.json(result);
  }

  let rText =JSON.stringify(rID);
  cacheData = SymptomData.filter(item => rText.indexOf(item.Id) === -1);

  result.Data =cacheData;
  result.Success =true;
  return res.json(result);
}

export default {
  'GET /api/diagnosis/querySynKey': querykeySyn,
  'POST /api/diagnosis/addSyn': addSyn,
  'POST /api/diagnosis/changeSyn': changeSyn,
  'POST /api/diagnosis/delSyn': delSyn,

  'GET /api/diagnosis/querySymKey': querykeySym,
  'POST /api/diagnosis/addSym': addSym,
  'POST /api/diagnosis/changeSym': changeSym,
  'POST /api/diagnosis/delSym': delSym,

  'POST /api/diagnosis/changeRelate': changeRelate,
  'GET /api/diagnosis/queryRelate': queryRelate,
  'GET /api/diagnosis/queryRest': queryRest,
};
