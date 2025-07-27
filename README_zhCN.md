# OadinLib

[English](./README.md) | [简体中文]

---

## ✨ 功能
- 检查 **Oadin** 服务是否存在
- 检查 / 下载 **oadin.exe**
- 启动 Oadin 服务
- 服务 / 模型 / 服务提供商的完整管理接口
- 导入 / 导出配置文件
- Chat / 文本生成（支持流式 & 非流式）
- 文生图

## 🚀 安装
```bash
npm install oadin-lib-1.0.0.tgz
```

## 🧭 使用方法

### 1) 引入
```js
const OadinLib = require('oadin-lib');
const oadin = new OadinLib();
```

### 2) 检查 Oadin 服务是否存在
```js
oadin.isOadinAvailable().then((result) => {
  console.log(result);
});
```

### 3) 检查 oadin.exe 是否已下载
```js
const existed = oadin.isOadinExisted();
  console.log(existed);
```

### 4) 下载 oadin.exe
```js
oadin.downloadOadin().then((result) => {
  console.log(result);
});
```

### 5) 启动 Oadin 服务
```js
oadin.startOadin().then((result) => {
  console.log(result);
});
```

### 6) 查看当前服务
```js
oadin.getServices().then((result) => {
  console.log(result);
});
```

### 7) 创建新服务
```js
const data = {
  service_name: "chat/embed/generate/text-to-image",
  service_source: "remote/local",
  hybrid_policy: "default/always_local/always_remote",
  flavor_name: "ollama/openai/...",
  provider_name: "local_ollama_chat/remote_openai_chat/...",
  auth_type: "none/apikey",
  auth_key: "your_api_key",
}; // 必填: service_name, service_source, hybrid_policy, flavor_name, provider_name

oadin.installService(data).then((result) => {
  console.log(result);
});
```

### 8) 更新服务
```js
const data = {
  service_name: "chat/embed/generate/text-to-image",
  hybrid_policy: "default/always_local/always_remote",
  remote_provider: "",
  local_provider: ""
}; // 必填: service_name

oadin.updateService(data).then((result) => {
  console.log(result);
});
```

### 9) 查看模型
```js
oadin.getModels().then((result) => {
  console.log(result);
});
```

### 10) 安装模型
```js
const data = {
  model_name: "llama2",
  service_name: "chat/embed/generate/text-to-image",
  service_source: "remote/local",
  provider_name: "local_ollama_chat/remote_openai_chat/...",
}; // 必填: model_name, service_name, service_source

oadin.installModel(data).then((result) => {
  console.log(result);
});
```

### 11) 卸载模型
```js
const data = {
  model_name: "llama2",
  service_name: "chat/embed/generate/text-to-image",
  service_source: "remote/local",
  provider_name: "local_ollama_chat/remote_openai_chat/...",
}; // 必填: model_name, service_name, service_source

oadin.deleteModel(data).then((result) => {
  console.log(result);
});
```

### 12) 查看服务提供商
```js
oadin.getServiceProviders().then((result) => {
  console.log(result);
});
```

### 13) 新增服务提供商
```js
const data = {
  service_name: "chat/embed/generate/text-to-image",
  service_source: "remote/local",
  flavor_name: "ollama/openai/...",
  provider_name: "local_ollama_chat/remote_openai_chat/...",
  desc: "",
  method: "",
  auth_type: "none/apikey",
  auth_key: "your_api_key",
  models: ["qwen2:7b", "deepseek-r1:7b", ...],
  extra_headers: {},
  extra_json_body: {},
  properties: {}
}; // 必填: service_name, service_source, flavor_name, provider_name

oadin.installServiceProvider(data).then((result) => {
  console.log(result);
});
```

### 14) 更新服务提供商
```js
const data = {
  service_name: "chat/embed/generate/text-to-image",
  service_source: "remote/local",
  flavor_name: "ollama/openai/...",
  provider_name: "local_ollama_chat/remote_openai_chat/...",
  desc: "",
  method: "",
  auth_type: "none/apikey",
  auth_key: "your_api_key",
  models: ["qwen2:7b", "deepseek-r1:7b", ...],
  extra_headers: {},
  extra_json_body: {},
  properties: {}
}; // 必填: service_name, service_source, flavor_name, provider_name

oadin.updateServiceProvider(data).then((result) => {
  console.log(result);
});
```

### 15) 删除服务提供商
```js
const data = {
  provider_name: ""
};

oadin.deleteServiceProvider(data).then((result) => {
  console.log(result);
});
```

### 16) 导入配置文件
```js
oadin.importConfig("path/to/.oadin").then((result) => {
  console.log(result);
});
```

### 17) 导出配置文件
```js
const data = {
  service_name: "chat/embed/generate/text-to-image"
};

oadin.exportConfig(data).then((result) => { // 不填 data 则导出全部
  console.log(result);
});
```

### 18) 获取推荐模型列表
```js
oadin.getModelsRecommended().then((result) => {
  console.log(result);
});
```

### 19) 获取支持模型列表
```js
const data = {
  service_source: "remote/local",
  flavor: "ollama/openai/..." // local 则默认为 ollama
}; // 必填: service_source, flavor

oadin.getModelsSupported(data).then((result) => {
  console.log(result);
});
```

### 20) Chat（流式）
```js
const data = {
  model: "deepseek-r1:7b",
  stream: true,
  messages: [
    {
      role: "user",
      content: "你好"
    }
  ],
  temperature: 0.7,
  max_tokens: 100,
}

oadin.chat(data).then((chatStream) => {
  chatStream.on('data', (data) => {
    console.log(data);
  });
  chatStream.on('error', (error) => {
    console.error(error);
  });
  chatStream.on('end', () => {
    console.log('Chat stream ended');
  });
});
```

### 21) Chat（非流式）
```js
const data = {
  model: "deepseek-r1:7b",
  stream: false,
  messages: [
    {
      role: "user",
      content: "你好"
    }
  ],
  temperature: 0.7,
  max_tokens: 100,
}

oadin.chat(data).then((result) => {
  console.log(result);
});
```

### 22) 生文（流式）
```js
const data = {
  model: "deepseek-r1:7b",
  stream: true,
  prompt: "你好",
}
oadin.generate(data).then((generateStream) => {
  generateStream.on('data', (data) => {
    console.log(data);
  });
  generateStream.on('error', (error) => {
    console.error(error);
  });
  generateStream.on('end', () => {
    console.log('Generate stream ended');
  });
});
```

### 23) 生文（非流式）
```js
const data = {
  model: "deepseek-r1:7b",
  stream: false,
  prompt: "你好",
}
oadin.generate(data).then((result) => {
  console.log(result);
});
```

### 24) 文生图
```js
const data = {
  model: "wanx2.1-t2i-turbo",
  prompt: "一间有着精致窗户的花店，漂亮的木质门，摆放着花朵",
}

oadin.textToImage(data).then((result) => {
  console.log(result);
});
```

## 📌 说明
- `oadin.getModelsAvailiable()` 方法已移除或被重命名，请使用 **`getModels()`**。

