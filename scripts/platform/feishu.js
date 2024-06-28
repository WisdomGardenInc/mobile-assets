const axios = require("axios");
const ENV_VARIABLES = require("./.feishu.env.js");
const feishuData = require("./feishu-data.js");

const getTenantAccessToken = async () => {
  const config = {
    url: "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    data: JSON.stringify({
      app_id: ENV_VARIABLES.ENTERPRISE_APP_ID,
      app_secret: ENV_VARIABLES.ENTERPRISE_APP_SECRET,
    }),
  };

  try {
    const response = await axios.request(config);
    return response.data ? response.data["tenant_access_token"] : null;
  } catch (error) {
    console.log("get tenant access token error: ", error);
    return null;
  }
};

const getReleaseNote = async ({ version }) => {
  const result = {
    releaseNote: null,
    tableUrl: ENV_VARIABLES.VERSION_TABLE_URL,
  };

  const token = await getTenantAccessToken();
  if (!token) {
    return result;
  }

  try {
    const { data: response } = await axios.get(
      `/apps/${ENV_VARIABLES.APP_TOKEN}/tables/${ENV_VARIABLES.VERSION_TABLE_ID}/records`,
      {
        baseURL: ENV_VARIABLES.API_PREFIX,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          filter: `CurrentValue.[版本号]="${version}"`,
          view_id: ENV_VARIABLES.VIEW_ID,
          pageSize: 1,
        },
      }
    );

    const data = response.data;
    if (data && data.items && data.items.length) {
      const info = data.items[0].fields;

      const cn = (info["简体"] || "").trim();
      const tw = (info["繁体"] || "").trim();
      const en = (info["英文"] || "").trim();

      result.releaseNote = { cn, tw, en };
    }
  } catch (error) {
    console.log(error);
  } finally {
    return result;
  }
};

const getVersionRecord = async (version, token) => {
  try {
    const { data: response } = await axios.get(
      `/apps/${ENV_VARIABLES.APP_TOKEN}/tables/${ENV_VARIABLES.VERSION_TABLE_ID}/records`,
      {
        baseURL: ENV_VARIABLES.API_PREFIX,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          filter: `CurrentValue.[版本号]="${version}"`,
          view_id: ENV_VARIABLES.VIEW_ID,
          pageSize: 1,
        },
      }
    );
    const data = response.data;
    if (data && data.items && data.items.length) {
      return data.items[0]["record_id"];
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const _getMarketList = async (token) => {
  try {
    const { data: response } = await axios.get(
      `/apps/${ENV_VARIABLES.APP_TOKEN}/tables/${ENV_VARIABLES.MARKET_LIST_TABLE_ID}/records`,
      {
        baseURL: ENV_VARIABLES.API_PREFIX,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          // view_id: ENV_VARIABLES.MARKET_LIST_VIEW_ID,
          pageSize: 1,
        },
      }
    );
    console.log(response.data?.items);
  } catch (error) {
    console.error(error);
  }
};

const getExistedMarketRecords = async (version, token) => {
  try {
    const { data: response } = await axios.get(
      `/apps/${ENV_VARIABLES.APP_TOKEN}/tables/${ENV_VARIABLES.MARKET_VERSION_TABLE_ID}/records`,
      {
        baseURL: ENV_VARIABLES.API_PREFIX,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          filter: `CurrentValue.[版本号]="${version}"`,
          view_id: ENV_VARIABLES.VIEW_ID,
          pageSize: 1,
        },
      }
    );
    const data = response.data;
    if (data && data.items && data.items.length) {
      return data.items;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const postMarketRecords = async (records, token) => {
  try {
    const response = await axios.post(
      `/apps/${ENV_VARIABLES.APP_TOKEN}/tables/${ENV_VARIABLES.MARKET_VERSION_TABLE_ID}/records/batch_create`,
      {
        records: records,
      },
      {
        baseURL: ENV_VARIABLES.API_PREFIX,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const addMarketAppsVersion = async (version) => {
  // 1. get version record
  // 2. query version records filter existed
  // 3. post new data

  const token = await getTenantAccessToken();

  if (!token) {
    console.error("get tenant access token failed");
    return;
  }

  const versionRecordId = await getVersionRecord(version, token);
  if (!versionRecordId) {
    console.error(`version record ${version} not found`);
    return;
  }

  const existedData = await getExistedMarketRecords(version, token);
  const existedMap = {};
  if (existedData) {
    existedData.forEach((record) => {
      const market = record.fields?.["应用市场"]?.[0];
      if (market?.record_ids.length) {
        existedMap[market.record_ids[0]] = market.text;
      }
    });
  }

  const newRecordsData = feishuData
    .getMarketVersionRecords(versionRecordId, version)
    .filter((record) => !existedMap[record["fields"]["应用市场"][0]]);

  const result = await postMarketRecords(newRecordsData, token);

  console.log("**********************************************");
  console.log("Version:", version, "\n");
  console.log("Existed Market Version:", Object.keys(existedMap).length);
  Object.values(existedMap).forEach((item) => {
    console.log(item);
  });

  console.log("------------------------------");
  console.log("Add Market Version:", newRecordsData.length);
  newRecordsData.forEach((record) => {
    console.log(
      feishuData.AVAILABLE_MARKETS_IDS[record["fields"]["应用市场"][0]]
    );
  });
  console.log("**********************************************");

  if (result) {
    console.log("success!");
  } else {
    console.log("failed!");
  }
};

const getVersionAlignerInfo = async (version) => {
  const result = {
    mobileVersion: version,
    serverVersion: null,
  };

  const token = await getTenantAccessToken();
  if (!token) {
    return result;
  }

  try {
    const { data: response } = await axios.get(
      `/apps/${ENV_VARIABLES.APP_TOKEN}/tables/${ENV_VARIABLES.VERSION_TABLE_ID}/records`,
      {
        baseURL: ENV_VARIABLES.API_PREFIX,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          filter: `CurrentValue.[版本号]="${version}"`,
          view_id: ENV_VARIABLES.VIEW_ID,
          pageSize: 1,
        },
      }
    );
    const data = response.data;
    if (data && data.items && data.items.length) {
      const fields = data.items[0].fields;

      result.mobileVersion = fields["版本号"];

      if (fields["兼容web版本"]) {
        result.serverVersion = fields["兼容web版本"];
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    return result;
  }
};

module.exports = {
  getReleaseNote,
  addMarketAppsVersion,
  getVersionAlignerInfo,
};

if (require.main === module) {
  (async () => {
    const token = await getTenantAccessToken();
    _getMarketList(token);
  })();
}
