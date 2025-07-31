const axios = require('axios');
const { OADIN_VERSION } = require('./constants.js');
const { error } = require('console');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const instance = axios.create({
  baseURL: `http://localhost:16688/${OADIN_VERSION}`,
  headers: { "Content-Type": "application/json" }
});

instance.interceptors.response.use(
  config => {
    // 处理响应数据
    return config.data;
  },
  error => Promise.reject(error)
);

instance.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    return config;
  },
  error => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

const get = (url, params, config) => instance.get(url, { ...config, params });
const post = (url, data, config) => instance.post(url, data, config);
const put = (url, data, config) => instance.put(url, data, config);
const del = (url, params, config) => instance.delete(url, { ...config, params });

const ajv = new Ajv();
addFormats(ajv);

/**
 * 通用请求方法，支持请求和响应schema校验及统一返回格式
 * @param {Object} param0
 * @param {'get'|'post'|'put'|'delete'} param0.method
 * @param {string} param0.url
 * @param {any} param0.data
 * @param {object} [param0.schema] - { request: 请求schema, response: 响应schema }
 * @returns {Promise<{code:number,msg:string,data:any}>}
 */
async function requestWithSchema({ method, url, data, schema }) {
  // 1. 请求参数校验（如果有）
  if (schema && schema.request) {
    const validateReq = ajv.compile(schema.request);
    if (!validateReq(data)) {
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
      res = await instance.delete(url, {data});
    } else {
      throw new Error('不支持的请求方法');
    }
    // 2. 响应schema校验（如果有）
    if (schema && schema.response) {
      const validateRes = ajv.compile(schema.response);
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
  get,
  post,
  put,
  del,
  request: instance.request.bind(instance),
  instance,
  requestWithSchema,
};