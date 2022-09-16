const ENV_VARIABLES = require("./.feishu.env.js");

// const getVersionRecord = (recordId, version) => ({
//   recordId: {id: recordId},
//   ids: [recordId],
//   text: version,
//   type: "text",
//   table_id: ENV_VARIABLES.VERSION_TABLE_ID,
// });

// {
//   table_id: "tbl7hXy87W8c2MwE",
//   record_ids: ["recNBPNVp8"],
//   text: "华为应用市场",
//   type: "text",
// }

const AVAILABLE_MARKETS = {
  华为应用市场: "recNBPNVp8",
  "APP Store": "recA0uBe8x",
  GooglePlay: "recJ1Xccqf",
  应用宝: "recPmIjsY4",
  百度手机助手: "recxTg3xmC",
  小米应用商店: "recNmoEBlj",
  OPPO开放平台: "recpBPc645",
  VIVO: "recYuYUgoa",
};

const AVAILABLE_MARKETS_IDS = Object.fromEntries(Object.entries(AVAILABLE_MARKETS).map(([k, v]) => [v, k]));

const DEFAULT_STATUS = "未提交";

const getCommonFields = (versionRecordId) => {
  const currentTime = new Date().getTime();
  return {
    版本号: [versionRecordId],
    状态: DEFAULT_STATUS,
    创建时间: currentTime,
    更新时间: currentTime,
  };
};

const getMarketVersionRecords = (versionRecordId, version) => [
  {
    fields: {
      ...getCommonFields(versionRecordId, version),
      应用市场: [AVAILABLE_MARKETS["APP Store"]],
    },
  },
  {
    fields: {
      ...getCommonFields(versionRecordId, version),
      应用市场: [AVAILABLE_MARKETS["GooglePlay"]],
    },
  },
  {
    fields: {
      ...getCommonFields(versionRecordId, version),
      应用市场: [AVAILABLE_MARKETS["应用宝"]],
    },
  },
  {
    fields: {
      ...getCommonFields(versionRecordId, version),
      应用市场: [AVAILABLE_MARKETS["百度手机助手"]],
    },
  },
  {
    fields: {
      ...getCommonFields(versionRecordId, version),
      应用市场: [AVAILABLE_MARKETS["小米应用商店"]],
    },
  },
  {
    fields: {
      ...getCommonFields(versionRecordId, version),
      应用市场: [AVAILABLE_MARKETS["OPPO开放平台"]],
    },
  },
  {
    fields: {
      ...getCommonFields(versionRecordId, version),
      应用市场: [AVAILABLE_MARKETS["VIVO"]],
    },
  },
  {
    fields: {
      ...getCommonFields(versionRecordId, version),
      应用市场: [AVAILABLE_MARKETS["华为应用市场"]],
    },
  },
];

module.exports = {
  getMarketVersionRecords,
  AVAILABLE_MARKETS,
  AVAILABLE_MARKETS_IDS,
};
