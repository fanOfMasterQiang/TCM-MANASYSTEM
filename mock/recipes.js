import { parse } from 'url';

let recipeData = [];
for (let i = 0; i < 12; i += 1) {
  recipeData.push({
    Id: `rec-${1000 + i}`,
    Name: `菜谱${i}`,
    Type:Math.round(Math.random() * 4) + 1,
    Image: "../assets/logo.svg",
    Practice: '煎炒烹炸',
    Video: '',
    Material:"材料一：50g;材料二：50g;材料三：50g"
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
    result.Data = recipeData;
  } else {
    recipeData.map(item => {
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
    result.Data = recipeData;
  } else {
    let cacheData = [];
    recipeData.map(item => {
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
  const { Name, Type,Practice,Materials } = body;
  if (!Name || !Type || !Practice || !Materials) {
    result.Message = '请完善信息';
    return res.json(result);
  }
  recipeData.push({
    ...body,
    Id: `rec-${1001 + recipeData.length}`,
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
  const { Id, Name, Type, Practice, Material } = body;
  if (!Id) {
    result.Message = 'Id不能为空';
    return res.json(result);
  }
  if (!Name || !Type || !Practice || !Material) {
    result.Message = '请完善信息';
    return res.json(result);
  }
  recipeData = recipeData.slice().map(item => {
    if (item.Id === Id) {
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
    recipeData.map(item => {
      if (item.Id === id) {
        item.needDel = true;
      }
    });
  });
  recipeData = recipeData.filter(item => item.needDel !== true);
  result.Success = true;
  return res.json(result);
}

export default {
  'GET /api/recipe/query': query,
  'GET /api/recipe/key': querykey,
  'POST /api/recipe/add': add,
  'POST /api/recipe/change': change,
  'POST /api/recipe/del': del,
};
