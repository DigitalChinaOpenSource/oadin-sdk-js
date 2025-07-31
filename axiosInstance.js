const axios = require('axios');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

/**
 * 创建带有拦截器的 axios 实例
 * @param {string} version 例如 'oadin/v0.2'
 * @returns {AxiosInstance}
 */
function createAxiosInstance(version) {
  const instance = axios.create({
    baseURL: `http://localhost:16688/oadin/${version}`,
    headers: { "Content-Type": "application/json" }
  });

  instance.interceptors.response.use(
    config => config.data,
    error => Promise.reject(error)
  );

  instance.interceptors.request.use(
    config => config,
    error => Promise.reject(error)
  );

  console.log(`Axios instance created with base URL: ${instance.defaults.baseURL}`);
  return instance;
}

const ajv = new Ajv();
addFormats(ajv);

function applyDefaults(data, schema) {
  const result = { ...data };
  for (const [key, prop] of Object.entries(schema.properties || {})) {
    if (result[key] === undefined && prop.default !== undefined) {
      result[key] = prop.default;
    }
  }
  return result;
}

/**
 * 通用请求方法，支持请求和响应schema校验及统一返回格式
 * @param {Object} param0
 * @param {'get'|'post'|'put'|'delete'} param0.method
 * @param {string} param0.url
 * @param {any} param0.data
 * @param {object} [param0.schema] - { request: 请求schema, response: 响应schema }
 * @param {AxiosInstance} param0.instance - axios实例
 * @returns {Promise<{code:number,msg:string,data:any}>}
 */
async function requestWithSchema({ method, url, data, schema, instance }) {
  if (!instance) return { code: 500, msg: 'Axios instance is required', data: null };
  // 1. 请求参数校验（如果有）
  if (schema?.request) {
    const requestSchema = {
      ...schema.request,
      additionalProperties: true
    };
    const validateReq = ajv.compile(requestSchema);
    const dataWithDefaults = applyDefaults(data, schema.request);
    if (!validateReq(dataWithDefaults)) {
      return { code: 400, msg: `Request schema validation failed: ${JSON.stringify(validateReq.errors)}`, data: null };
    }
  }
  try {
    let res;
    if (method === 'get') {
      res = await instance.get(url, { params: data });
    } else if (method === 'post') {
      res = await instance.post(url, data);
    } else if (method === 'put') {
      res = await instance.put(url, data);
    } else if (method === 'delete') {
      res = await instance.delete(url, { data });
    } else {
      throw new Error('不支持的请求方法');
    }
    // 2. 响应schema校验（如果有）
    if (schema?.response) {
      const responseSchema = {
        ...schema.response,
        additionalProperties: true
      };
      const validateRes = ajv.compile(responseSchema);
      if (!validateRes(res)) {
        throw new Error(`Response schema validation failed: ${JSON.stringify(validateRes.errors)}`);
      }
    }
    return { code: 200, msg: res.message || null, data: res.data || res };
  } catch (error) {
    let msg = error.message;
    if (error.response) {
      // 兼容后端返回的各种结构
      if (typeof error.response.data === 'string') {
        msg = error.response.data;
      } else if (error.response.data?.message) {
        msg = error.response.data.message;
      } else if (error.response.data) {
        msg = JSON.stringify(error.response.data);
      }
    }
    return { code: 400, msg, data: null };
  }
}

module.exports = {
  createAxiosInstance,
  requestWithSchema,
};