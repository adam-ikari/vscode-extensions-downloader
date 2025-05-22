export interface Extension {
  id: string; // 格式: publisher.name
  name: string;
  publisher: string;
  version: string;
  description?: string;
  icon?: string;
  uuid: string; // 原始UUID格式ID
}

export interface DownloadRequest {
  extensions: string[]; // 使用uuid格式
  version: string;
  os: string;
  cpu: string;
}

export interface MarketplaceResponse {
  results: {
    extensions: {
      extensionId: string; // UUID格式
      displayName: string;
      publisher: {
        displayName: string;
      };
      shortDescription: string;
      versions: {
        version: string;
        files: {
          assetType: string;
          source: string;
        }[];
      }[];
    }[];
  }[];
}