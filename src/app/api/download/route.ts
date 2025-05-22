import { NextResponse } from "next/server";
import { DownloadRequest } from "@/types";
import JSZip from "jszip";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<DownloadRequest>;
    
    // 参数验证保持不变...

    const zip = new JSZip();
    const { extensions, version, os, cpu } = body as DownloadRequest;

    // 下载每个扩展并添加到ZIP
    for (const extensionId of extensions) {
      try {
        // 使用UUID格式的ID直接构造下载URL
        const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${extensionId.split('.')[0]}/vsextensions/${extensionId.split('.')[1]}/${version}/vspackage`;
        
        const response = await fetch(downloadUrl, {
          headers: {
            'Accept': 'application/octet-stream'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to download ${extensionId}: ${response.status}`);
        }
        
        const blob = await response.blob();
        zip.file(`${extensionId}.vsix`, blob);
        console.log(`Successfully downloaded ${extensionId}`);
      } catch (error) {
        console.error(`Error downloading ${extensionId}:`, error);
      }
    }

    // 生成ZIP文件
    if (Object.keys(zip.files).length === 0) {
      return NextResponse.json(
        { error: "No extensions were successfully downloaded" },
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
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}