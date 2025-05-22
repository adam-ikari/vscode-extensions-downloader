import { NextResponse } from "next/server";
import axios from 'axios';
import { DownloadRequest } from "@/types";
import JSZip from "jszip";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<DownloadRequest>;

    if (!body.extensions || !Array.isArray(body.extensions)) {
      return NextResponse.json(
        { error: "请选择要下载的插件" },
        { status: 400 }
      );
    }

    const zip = new JSZip();
    const { extensions, os, cpu } = body as DownloadRequest;
    // let blob;
    for (const { extensionName, publisherName, version } of extensions) {
      try {
        let downloadUrl;

        const platformParam = os && cpu ? `?targetPlatform=${os}-${cpu}` : "";
        downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisherName}/vsextensions/${extensionName}/${version}/vspackage${platformParam}`;

        // // 添加30秒超时控制
        // const controller = new AbortController();
        // const timeout = setTimeout(() => controller.abort(), 30000);

        // // 添加重试机制(最多3次)
        // let retryCount = 0;
        let response;

        // while (retryCount < 3) {
        // try {
        response = await axios.get(downloadUrl, {
          maxRedirects: 0,
          responseType: 'arraybuffer',
          headers: {
            Accept: "application/octet-stream",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          },
        });
        // break;
        // } catch (error) {
        //   // retryCount++;
        //   // if (retryCount >= 3) throw error;
        //   // await new Promise((resolve) =>
        //   //   setTimeout(resolve, 1000 * retryCount)
        //   // ); // 指数退避

        // }
        // }

        // 处理3xx重定向
        // if ([301, 302, 303, 307, 308].includes(response.status)) {
        //   const redirectUrl = response.headers.get("location");
        //   if (!redirectUrl) throw new Error("无效的重定向URL");

        //   response = await fetch(redirectUrl, {
        //     signal: controller.signal,
        //     headers: {
        //       Accept: "application/octet-stream",
        //       "User-Agent":
        //         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        //     },
        //   });
        // }

        if (response.status !== 200) {
          throw new Error(
            `下载失败 (状态码: ${response.status}): ${response.statusText}\n插件: ${extensionName}\nURL: ${response.config.url}`
          );
        }

        const blob = Buffer.from(response.data, 'binary');
        // clearTimeout(timeout);

        // 增强文件验证
        // if (
        //   blob.size < 1024 ||
        //   !(
        //     blob.type.includes("octet-stream") ||
        //     blob.type.includes("application/zip") ||
        //     blob.type.includes("application/x-zip-compressed")
        //   )
        // ) {
        //   throw new Error("下载的文件不是有效的VSIX包");
        // }
        zip.file(`${publisherName}-${extensionName}-${version}.vsix`, blob);
      } catch (error) {
        console.error(`插件 ${extensionName} 下载失败:`, error);
        continue;
      }
    }

    if (Object.keys(zip.files).length === 0) {
      return NextResponse.json({ error: "没有插件下载成功" }, { status: 400 });
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    return new Response(zipBlob, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=vscode-extensions.zip",
      },
    });
  } catch (error) {
    console.error("下载出错:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
