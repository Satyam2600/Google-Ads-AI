// server/services/googleAdsService.js
const { GoogleAdsClient } = require("google-ads-api");
const config = require("../config/googleAds");
const logger = require("../utils/logger");

class GoogleAdsService {
  constructor() {
    this.client = new GoogleAdsClient({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      developer_token: config.developerToken,
      refresh_token: config.refreshToken,
      login_customer_id: config.loginCustomerId,
    });
  }

  async createCampaignDraft(campaignData) {
    try {
      // Validate input
      if (
        !campaignData.headlines?.length ||
        !campaignData.descriptions?.length
      ) {
        throw new Error("Invalid campaign data");
      }

      // Campaign Resource
      const campaign = {
        name: `AI-Generated Campaign - ${Date.now()}`,
        advertising_channel_type: "SEARCH",
        status: "PAUSED",
        manual_cpc: {
          enhanced_cpc_enabled: true,
        },
        campaign_budget: {
          amount_micros: campaignData.budget * 1e6,
          explicitly_shared: false,
        },
        network_settings: {
          target_google_search: true,
          target_search_network: true,
          target_content_network: false,
        },
      };

      // Ad Group
      const adGroup = {
        name: "AI-Generated Ad Group",
        cpc_bid_micros: 1e6, // $1.00 CPC
      };

      // Responsive Search Ad
      const responsiveAd = {
        final_urls: [campaignData.website || "https://example.com"],
        headlines: campaignData.headlines.map((text) => ({ text })),
        descriptions: campaignData.descriptions.map((text) => ({ text })),
      };

      // Atomic transaction
      const response = await this.client.mutate([
        { operation: "create", resource: "Campaign", entity: campaign },
        { operation: "create", resource: "AdGroup", entity: adGroup },
        { operation: "create", resource: "AdGroupAd", entity: responsiveAd },
      ]);

      return {
        campaignId: response[0].id,
        adGroupId: response[1].id,
        adId: response[2].id,
      };
    } catch (error) {
      logger.error("Google Ads API Error:", error);
      throw new Error(`Campaign creation failed: ${error.message}`);
    }
  }
}

module.exports = new GoogleAdsService();
