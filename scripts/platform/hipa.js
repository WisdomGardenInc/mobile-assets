const axios = require("axios");
const ENV_VARIABLES = require("./.hipa.env.js");

const getReleaseNote = async ({ version }) => {
  const result = {
    releaseNote: null,
    tableUrl: ENV_VARIABLES.VERSION_TABLE_URL,
  };
  try {
    const { data } = await axios.get(
      `/apps/${ENV_VARIABLES.APP_ID}/tables/${ENV_VARIABLES.TABLE_ID}/records?filter=${encodeURIComponent(
        `版本号=[eq]${version}`
      )}`,
      {
        baseURL: "https://api.hipacloud.com/v1",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ENV_VARIABLES.API_KEY}`,
        },
        params: {
          pageSize: 1,
        },
      }
    );

    if (data && data.items && data.items.length) {
      const info = data.items[0].values;
      const cn = (info["简体"] || "").trim();
      const tw = (info["繁体"] || "").trim();
      const en = (info["英文"] || "").trim();

      // const release_note_zh_hans = info["简体"];
      // const release_note_zh_hant = info["繁体"];
      // const release_note_en_us = info["英文"];

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
