const axios = require("axios");
const ENV_VARIABLES = require("./.feishu.env.js");

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
      `/apps/${ENV_VARIABLES.APP_TOKEN}/tables/${ENV_VARIABLES.TABLE_ID}/records`,
      {
        baseURL: "https://open.feishu.cn/open-apis/bitable/v1",
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

module.exports = {
  getReleaseNote,
};
