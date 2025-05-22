"use client";

import { useState } from "react";
import { Extension } from "@/types";

export default function Home() {
  const [query, setQuery] = useState("");
  const [extensions, setExtensions] = useState<Extension[]>([]);
  // const [selectedExtensions, setSelectedExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(false);
  // const [version, setVersion] = useState("latest");
  const [os, setOs] = useState("win32");
  const [cpu, setCpu] = useState("x64");

  const getDownloadUrl = (ext: Extension, os: string, cpu: string): string => {
    // 根据操作系统和CPU架构生成下载链接

    const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${ext.publisher.publisherName}/vsextensions/${ext.extensionName}/${ext.versions[0].version}/vspackage`;
    // 判断是否有操作系统和cpu架构的版本
    const hasPlatformVersion = ext.versions.some(
      (version) => version.targetPlatform === `${os}-${cpu}`
    );
    // 如果有操作系统和cpu架构的版本，则返回带有targetPlatform参数的下载链接
    if (hasPlatformVersion) {
      return `${downloadUrl}?targetPlatform=${os}-${cpu}`;
    } else {
      return downloadUrl;
    }
  };

  // const toggleExtension = (ext: Extension) => {
  //   setSelectedExtensions((prev) =>
  //     prev.some((e) => e.extensionId === ext.extensionId)
  //       ? prev.filter((e) => e.extensionId !== ext.extensionId)
  //       : [...prev, ext]
  //   );
  // };

  const searchExtensions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${query}`);
      const data = (await res.json()) as { extensions?: Extension[] };
      setExtensions(data.extensions || []);
    } catch (error) {
      console.error("Search失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // const downloadExtensions = async () => {
  //   if (!selectedExtensions.length) return;
  //   console.log(selectedExtensions);
  //   try {
  //     const res = await fetch("/api/download", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         extensions: selectedExtensions.map((ext) => {
  //           return {
  //             extensionName: ext.extensionName,
  //             publisherName: ext.publisher.publisherName,
  //             version: ext.versions[0].version,
  //           };
  //         }),
  //         os,
  //         cpu,
  //       }),
  //     });
  //     const blob = await res.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "vscode-extensions.zip";
  //     a.click();
  //   } catch (error) {
  //     console.error("下载失败:", error);
  //     alert("下载失败，请重试");
  //   }
  // };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">VSCode插件下载</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">搜索插件</label>
            <div className="flex">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border rounded-l px-3 py-2"
                placeholder="输入插件名称或关键词"
              />
              <button
                onClick={searchExtensions}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? "搜索中..." : "搜索"}
              </button>
            </div>
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-1">VSCode版本</label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="latest">最新版</option>
              <option value="1.85.0">1.85.0</option>
              <option value="1.84.0">1.84.0</option>
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium mb-1">操作系统</label>
            <select
              value={os}
              onChange={(e) => setOs(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="win32">Windows</option>
              <option value="darwin">macOS</option>
              <option value="linux">Linux</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">CPU架构</label>
            <select
              value={cpu}
              onChange={(e) => setCpu(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="x64">x64</option>
              <option value="arm64">ARM64</option>
              <option value="armhf">ARM</option>
            </select>
          </div>
        </div>
        {extensions.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                搜索结果
                {/* 搜索结果 (已选择 {selectedExtensions.length} 个) */}
              </h2>
              {/* <button
                onClick={downloadExtensions}
                disabled={!selectedExtensions.length}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                下载选中项
              </button> */}
            </div>
            <div className="border rounded divide-y">
              {extensions.map((ext) => {
                const stats = ext.statistics?.reduce((acc, stat) => {
                  acc[stat.statisticName] = stat.value;
                  return acc;
                }, {} as Record<string, number>) || {};

                const installs = stats.install || 0;
                const rating = stats.averagerating || 0;
                const ratingCount = stats.ratingcount || 0;
                const verified = ext.publisher.flags?.includes("verified") || false;
                const lastUpdated = ext.lastUpdated ? new Date(ext.lastUpdated).toLocaleDateString() : '未知';
                const publishedDate = ext.publishedDate ? new Date(ext.publishedDate).toLocaleDateString() : '未知';

                return (
                  <div
                    key={ext.extensionId}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">
                            {ext.displayName}
                          </h3>
                          {verified && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              已验证
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-1">
                          {ext.publisher.displayName} • v{ext.versions[0].version}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {ext.shortDescription}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            安装量: {Math.floor(installs / 1000)}k+
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            评分: {rating.toFixed(1)} ({ratingCount})
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            更新: {lastUpdated}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            发布: {publishedDate}
                          </span>
                        </div>
                      </div>
                      <a
                        href={getDownloadUrl(ext, os, cpu)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
                      >
                        下载
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
