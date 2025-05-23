export interface Extension {
  extensionId: string; // UUID格式
  extensionName: string; // 插件名称
  displayName: string;
  flags: string; // "validated, public"等状态
  lastUpdated: string; // ISO 8601日期格式
  publishedDate: string; // ISO 8601日期格式
  releaseDate: string; // ISO 8601日期格式
  shortDescription: string;
  deploymentType: number;
  
  publisher: {
    publisherId: string; // UUID格式
    publisherName: string;
    displayName: string;
    flags: string; // "verified"等状态
    domain: string | null;
    isDomainVerified: boolean;
  };

  versions: {
    version: string;
    targetPlatform: string;
    flags: string;
    lastUpdated: string; // ISO 8601日期格式
    files: {
      assetType: string;
      source: string;
    }[];
    properties: {
      key: string;
      value: string;
    }[];
    assetUri: string;
    fallbackAssetUri: string;
  }[];

  statistics: {
    statisticName: string;
    value: number;
  }[];
}

export interface MarketplaceResponse {
  results: {
    extensions: Extension[];
  }[];
}