export const ADMIN_CAMPAIGN_BASE_URL = "/admin/campaigns";

export const getCampaignWithCampaignIdUrl = (
  campaignId: string | string[] | undefined
) => {
  const campaignWithCampaignIdUrl = `${ADMIN_CAMPAIGN_BASE_URL}/${campaignId}`;

  return campaignWithCampaignIdUrl;
};

export const getDynamicSubPathCampaignUrl = (
  campaignId: string | string[] | undefined,
  path: any,
  subpath: string
) => {
  let url = `${getCampaignWithCampaignIdUrl(campaignId)}/${subpath}`;

  const active = path.includes(subpath);

  return { url: url, active };
};

export const getDynamicNestedPathCampaignUrl = (
  campaignId: string | string[] | undefined,
  path: any,
  subpath: string,
  nestedPath?: string | null
) => {
  let url = `${getCampaignWithCampaignIdUrl(campaignId)}/${subpath}`;

  if (nestedPath) {
    url += `/${nestedPath}`;
  }

  const active = path === url;

  return { url: url, active };
};
