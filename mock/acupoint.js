import { parse } from 'url';

let acupointData = [];
for (let i = 0; i < 40; i += 1) {
  acupointData.push({
    Id: `acu-${1000 + i}`,
    Name: `穴位${i}`,
    Description: `这是穴位${i}`,
    Image: "C:\\Users\\Public\\Pictures\\Sample Pictures\\菊花.jpg",
    VideoSource: [
      {
        Id: `vde-${1000 + i}`,
        GroupType: Math.round(Math.random()),
        Title: `视频${i}`,
        Abstract: `保健视频${i}`,
        Description: `适用于穴位${i}的视频${i}`,
        Url: `C:\\Users\\Public\\Videos\\Sample Videos\\野生动物.wmv`,
        AcupointId: `acu-${1000 + i}`,
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
    result.Data = acupointData;
  } else {
    acupointData.map(item => {
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
    result.Data = acupointData;
  } else {
    let cacheData = [];
    acupointData.map(item => {
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
  const { Name } = body;
  if (!Name) {
    result.Message = '请完善信息';
    return res.json(result);
  }
  acupointData.push({
    ...body,
    Id:`vde-${1001 + acupointData.length}`
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
  const { Id, Name } = body;
  if (!Id) {
    result.Message = 'Id不能为空';
    return res.json(result);
  }
  if (!Name) {
    result.Message = '请完善信息';
    return res.json(result);
  }
  acupointData = acupointData.slice().map(item => {
    if (item.Id === Id) {
      body.VideoSource = item.VideoSource;
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
    acupointData.map(item => {
      if (item.Id === id) {
        item.needDel = true;
      }
    });
  });
  acupointData = acupointData.filter(item => item.needDel !== true);
  result.Success = true;
  return res.json(result);
}

function queryVideo(req, res, u) {
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
  if (!params.AcupointId) {
    result.Message = '请完善AcupointId';
    return res.json(result);
  } else {
    let cacheData = [];
    acupointData.map(item => {
      if (item.Id === params.AcupointId) {
        cacheData = item.VideoSource
      }
    });
    result.Data = cacheData;
  }
  result.Success = true;
  return res.json(result);
}

function upload(req, res, u, b) {
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
  const { AcupointId, File,VideoId } = body;
  if (!AcupointId) {
    result.Message = 'AcupointId不能为空';
    return res.json(result);
  }
  if (!File) {
    result.Message = '数据为空 ，本次未保存';
    return res.json(result);
  }
  acupointData.map(acu => {
    if (acu.Id === AcupointId){
      if(VideoId){
        acu.VideoSource.map(video => {
          if(video.Id === VideoId){
            result.Success = true;
            video.Url = File
          }
        })
      }else {
        acu.VideoSource.push({
          Id: `vde-${1000 + 200}`,
          GroupType: Math.round(Math.random()),
          Title: `视频${200}`,
          Abstract: `保健视频${200}`,
          Description: `适用于穴位的视频`,
          Url: `../../video.mp4`,
          AcupointId: `${AcupointId}`,
        })
      }
    }
  });
  return res.json(result);
}

function delVideo(req, res, u, b) {
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
  const { VideoId,AcupointId } = body;
  if (!VideoId) {
    result.Message = 'VideoId不能为空';
    return res.json(result);
  }

  let idx = null;
  acupointData.map(acu => {
    if (acu.Id === AcupointId){
      acu.VideoSource.map((video,index) => {
        if(video.Id === VideoId){
          idx = index;
        }
      });
      (idx !== null) && acu.VideoSource.splice(idx,1);
    }
  });


  result.Success = true;
  return res.json(result);
}

export default {
  'GET /api/acupoint/query': query,
  'GET /api/acupoint/key': querykey,
  'POST /api/acupoint/add': add,
  'POST /api/acupoint/change': change,
  'POST /api/acupoint/del': del,

  'GET /api/acuVideo/query': queryVideo,
  'POST /api/acuVideo/upload': upload,
  'POST /api/acuVideo/del': delVideo,
};
