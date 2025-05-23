import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios";
import { Extension } from "@/types";

export const useDownloadAndZip = () => {
  let cancelTokenSource = axios.CancelToken.source();
  let isDownloading = false;
  let currentRequest: Promise<any> | null = null;

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

  const abortDownload = () => {
    if (isDownloading) {
      cancelTokenSource.cancel("Download cancelled by user");
      isDownloading = false;
      currentRequest = null;
    }
  };

  const downloadAndZipExtensions = async (
    extensions: Extension[],
    os: string,
    cpu: string,
    onProgress?: (extId: string, progress: number) => void
  ) => {
    try {
      cancelTokenSource = axios.CancelToken.source();
      isDownloading = true;
      currentRequest = null;
      const zip = new JSZip();
      const folder = zip.folder("vscode-extensions");

      for (const ext of extensions) {
        const url = getDownloadUrl(ext, os, cpu);
        currentRequest = axios.get(url, {
          responseType: "arraybuffer",
          cancelToken: cancelTokenSource.token,
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              onProgress?.(ext.extensionId, progress);
            }
          },
        });
        const response = await currentRequest;

        const blob = new Blob([response.data]);
        const fileName = `${ext.publisher.publisherName}.${ext.extensionName}-${ext.versions[0].version}.vsix`;
        folder?.file(fileName, blob);
        onProgress?.(ext.extensionId, 100);
      }

      const content = await zip.generateAsync({
        type: "blob",
      } as JSZip.JSZipGeneratorOptions<"blob">);
      saveAs(content, "vscode-extensions.zip");
      onProgress?.("all", 100);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Download cancelled:", err.message);
      } else if (err instanceof Error) {
        console.error("Download error:", err);
      }
    } finally {
      isDownloading = false;
      currentRequest = null;
    }
  };

  return { downloadAndZipExtensions, abortDownload };
};
