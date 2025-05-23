import { useState, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios";
import { Extension } from "@/types";

export const useDownloadAndZip = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

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

  const downloadAndZipExtensions = async (
    extensions: Extension[],
    os: string,
    cpu: string,
    onProgress?: (extId: string, progress: number) => void
  ) => {
    try {
      setIsDownloading(true);
      const zip = new JSZip();
      const folder = zip.folder("vscode-extensions");

      for (const ext of extensions) {
        const url = getDownloadUrl(ext, os, cpu);
        console.log('Starting download for:', ext.extensionName);
        const response = await axios.get(url, {
          responseType: "arraybuffer",
          onDownloadProgress: (progressEvent) => {
            console.log("onDownloadProgress:", progressEvent);
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              console.log(`Progress update for ${ext.extensionName}: ${progress}%`);
              // 使用requestAnimationFrame确保UI及时更新
              requestAnimationFrame(() => {
                onProgress?.(ext.extensionId, progress);
              });
              // 清除动画定时器
              if (animationRef.current) {
                clearInterval(animationRef.current);
                animationRef.current = null;
              }
            } else {
              // 当total不可用时，启动循环进度条动画
              if (!animationRef.current) {
                animationRef.current = setInterval(() => {
                  setAnimationProgress(prev => {
                    const newProgress = (prev + 5) % 100;
                    requestAnimationFrame(() => {
                      onProgress?.(ext.extensionId, newProgress);
                    });
                    return newProgress;
                  });
                }, 200);
              }
            }
          },
        });

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
      if (err instanceof Error) {
        console.error("Download error:", err.message);
      } else {
        console.error("Unknown error occurred during download");
      }
    } finally {
      setIsDownloading(false);
      // 设置最终进度为100%
      requestAnimationFrame(() => {
        onProgress?.("all", 100);
      });
      // 清除动画定时器
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    }
  };

  return { downloadAndZipExtensions, isDownloading };
};
