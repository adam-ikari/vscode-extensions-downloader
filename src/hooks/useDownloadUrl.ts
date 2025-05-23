import { Extension } from "@/types";

export const useDownloadUrl = () => {
  const getDownloadUrl = (ext: Extension, os: string, cpu: string): string => {
    const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${ext.publisher.publisherName}/vsextensions/${ext.extensionName}/${ext.versions[0].version}/vspackage`;
    const hasPlatformVersion = ext.versions.some(
      (version) => version.targetPlatform === `${os}-${cpu}`
    );
    if (hasPlatformVersion) {
      return `${downloadUrl}?targetPlatform=${os}-${cpu}`;
    } else {
      return downloadUrl;
    }
  };

  return { getDownloadUrl };
};