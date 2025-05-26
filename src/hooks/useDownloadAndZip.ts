import { useState, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios";
import pLimit from "p-limit";
import { Extension } from "@/types";

// 限制并发数为3
const limit = pLimit(3);

export const useDownloadAndZip = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [completedFiles, setCompletedFiles] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getDownloadUrl = (ext: Extension, platform: string): string => {
    const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${ext.publisher.publisherName}/vsextensions/${ext.extensionName}/${ext.versions[0].version}/vspackage`;
    const hasPlatformVersion = ext.versions.some(
      (version) => version.targetPlatform === platform
    );
    if (hasPlatformVersion) {
      return `${downloadUrl}?targetPlatform=${platform}`;
    } else {
      return downloadUrl;
    }
  };

  const downloadAndZipExtensions = async (
    extensions: Extension[],
    platforms: string[]
  ) => {
    try {
      setIsDownloading(true);
      setProgress(0);
      setCompletedFiles(0);
      
      // 计算总文件数（考虑通用插件）
      const total = extensions.reduce((sum, ext) => {
        const isUniversal = !ext.versions.some(v => v.targetPlatform);
        return sum + (isUniversal ? 1 : platforms.length);
      }, 0);
      setTotalFiles(total);
      
      abortControllerRef.current = new AbortController();
      const zip = new JSZip();
      const folder = zip.folder("vscode-extensions");

      const downloadPromises = extensions.flatMap(ext => {
        const isUniversal = !ext.versions.some(v => v.targetPlatform);
        const targetPlatforms = isUniversal ? [''] : platforms;
        
        return targetPlatforms.map(platform => 
          limit(async () => {
            const url = getDownloadUrl(ext, platform);
            
            try {
              const response = await axios.get(url, {
                responseType: "blob",
                signal: abortControllerRef.current?.signal,
                onDownloadProgress: (progressEvent) => {
                  if (progressEvent.total) {
                    const percent = Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percent);
                  }
                }
              });

              const extVersion = ext.versions[0];
              let fileName = isUniversal
                ? `${ext.publisher.publisherName}.${ext.extensionName}-${extVersion.version}.vsix`
                : `${ext.publisher.publisherName}.${ext.extensionName}-${extVersion.version}-${platform}.vsix`;
              
              const contentDisposition = response.headers["content-disposition"];
              if (contentDisposition) {
                const match = contentDisposition.match(/filename="?(.+?)"?$/);
                if (match && match[1]) {
                  fileName = isUniversal
                    ? match[1]
                    : match[1].replace(/\.vsix$/, `-${platform}.vsix`);
                }
              }
              
              folder?.file(fileName, response.data);
              setCompletedFiles(prev => prev + 1);
            } catch (error) {
              console.error(`Download failed for ${ext.extensionName} (${platform}):`, error);
              throw error;
            }
          })
        );
      });

      await Promise.all(downloadPromises);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "vscode-extensions.zip");
    } finally {
      setIsDownloading(false);
    }
  };

  return { 
    downloadAndZipExtensions, 
    isDownloading,
    progress,
    totalFiles,
    completedFiles
  };
};