export interface Extension {
  id: string;
  name: string;
  publisher: string;
  version: string;
  description?: string;
  icon?: string;
}

export interface DownloadRequest {
  extensions: string[];
  version: string;
  os: string;
  cpu: string;
}

export interface MarketplaceResponse {
  results: {
    extensions: {
      extensionId: string;
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