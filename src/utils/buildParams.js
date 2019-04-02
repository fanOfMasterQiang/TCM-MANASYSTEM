let gettype = Object.prototype.toString;
const DataType = {
  isObj: function (o) {
    return gettype.call(o) == "[object Object]";
  },
  isDate: function (o) {
    return gettype.call(o) == "[object Date]";
  },
  isString: function (o) {
    return gettype.call(o) == "[object String]";
  },
  isNumber: function (o) {
    return gettype.call(o) == "[object Number]";
  },
  isArray: function (o) {
    return gettype.call(o) == "[object Array]";
  },
  isList: function (o) {
    return gettype.call(o) == "[object List]";
  },
  isNULL: function (o) {
    return gettype.call(o) == "[object Null]";
  },
  isBoolean: function (o) {
    return gettype.call(o) == "[object Boolean]";
  },
  isDocument: function (o) {
    return gettype.call(o) == "[object Document]" || ["object HTMLDocument"];
  },
  isFunction: function (o) {
    return gettype.call(o) == "[object Function]";
  },
};

const buildParams = (prefix, obj, traditional, add) => {
  let name;
  if (DataType.isArray(obj)) {
    obj.map((v, i) => {
      if (traditional || /\[\]$/.test(prefix)) {
        // Treat each array item as a scalar.
        add(prefix, v);
      } else {
        // Item is non-scalar (array or object), encode its numeric index.
        buildParams(`${prefix  }[${  typeof v === "object" ? i : ""  }]`, v, traditional, add);
      }
    });
  } else if (!traditional && DataType.isObj(obj)) {
    // Serialize object item.
    for (name in obj) {
      buildParams(`${prefix  }[${  name  }]`, obj[name], traditional, add);
    }
  } else {
    // Serialize scalar item.
    add(prefix, obj);
  }
}

export const ParamData = (data, traditional) => {
  let prefix;
  let  s = [];
  let  add = (key, value)=> {
    if (!DataType.isFunction(value)) {
      value = value == null ? "" : value;
      s[s.length] = `${encodeURIComponent(key)  }=${  encodeURIComponent(value)}`;
    }
  };

  for (prefix in data) {
    buildParams(prefix, data[prefix], traditional, add);
  }
  return s.join("&").replace(/%20/g, "+");
};

export const ObjectToFormData = (obj, urlencoded, namespace) => {
  let fd = urlencoded || '';
  let formKey;

  for(let property in obj) {
    if(obj.hasOwnProperty(property)) {
      let key = Array.isArray(obj) ? '' : `[${property}]`;
      if(namespace) {
        formKey = namespace + key;
      } else {
        formKey = property;
      }

      // if the property is an object, but not a File, use recursivity.
      if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
        fd = ObjectToFormData(obj[property], fd, formKey);
      } else {
        // if it's a string or a File object
        if(obj[property] !== undefined  ){
          fd += `${formKey}=${obj[property]}&`
        }

      }
    }
  }
  return fd;
};

export const MakeFormData = (obj, form_data) => {
  let data = [];
  if (obj instanceof File) {
    data.push({key: "", value: obj});
  }
  else if (obj instanceof Array ) {
    for (let j=0,len=obj.length;j<len;j++) {
      let arr = MakeFormData(obj[j]);
      for (let k=0,l=arr.length;k<l;k++) {
        let key = form_data ? j+arr[k].key : `[${j}]${arr[k].key}`;
        data.push({key: key, value: arr[k].value})
      }
    }
  }
  else if (typeof obj === 'object') {
    for (let j in obj) {
      let arr = MakeFormData(obj[j]);
      for (let k=0,l=arr.length;k<l;k++) {
        let key = form_data ? j+arr[k].key : `[${j}]${arr[k].key}`;
        data.push({key: key, value: arr[k].value})
      }
    }
  }
  else
  {
    data.push({key: "", value: obj});
  }
  if (form_data)
  {
    // 封装
    for (let i=0,len=data.length;i<len;i++)
    {
      form_data.append(data[i].key, data[i].value)
    }
  }
  else
  {
    return data;
  }
};



