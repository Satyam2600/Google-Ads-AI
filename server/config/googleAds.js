// server/config/googleAds.js
require("dotenv").config();

module.exports = {
  clientId: process.env.GOOGLE_ADS_CLIENT_ID,
  clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
  loginCustomerId: process.env.GOOGLE_ADS_CUSTOMER_ID,
};
