export interface Extension {
  extensionId: string; // UUID格式
  extensionName: string; // 插件名称
  displayName: string;
  publisher: {
    displayName: string;
    publisherName: string;
  };
  shortDescription: string;
  versions: {
    version: string;
    files: {
      assetType: string;
      source: string;
    }[];
  }[];
}

export interface DownloadRequest {
  extensions: { extensionName: string; publisherName: string; version: string }[];
  os: string;
  cpu: string;
}

export interface MarketplaceResponse {
  results: {
    extensions: Extension[];
  }[];
}
