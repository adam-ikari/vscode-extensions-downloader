import { NextResponse } from "next/server";
import { DownloadRequest } from "@/types";
import JSZip from "jszip";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<DownloadRequest>;
    
    if (!body.extensions || !Array.isArray(body.extensions)) {
      return NextResponse.json(
        { error: "请选择要下载的插件" },
        { status: 400 }
      );
    }

    const zip = new JSZip();
    const { extensions, version, os, cpu } = body as DownloadRequest;

    for (const extensionId of extensions) {
      try {
        // 使用新的URL格式
        const [publisher, name] = extensionId.split('.');
        const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${name}/${version}/vspackage`;
        
        const response = await fetch(downloadUrl, {
          headers: {
            'Accept': 'application/octet-stream',
            'User-Agent': 'VSCode Extension Downloader'
          }
        });
        
        if (!response.ok) {
          throw new Error(`下载失败: ${response.status}`);
        }
        
        const blob = await response.blob();
        zip.file(`${publisher}.${name}.vsix`, blob);
      } catch (error) {
        console.error(`插件 ${extensionId} 下载失败:`, error);
        continue;
      }
    }

    if (Object.keys(zip.files).length === 0) {
      return NextResponse.json(
        { error: "没有插件下载成功" },
        { status: 400 }
      );
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
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}