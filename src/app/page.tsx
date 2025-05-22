"use client";

import { useState } from "react";
import { Extension } from "@/types";
import { useDownloadUrl } from "@/hooks/useDownloadUrl";

export default function Home() {
  const [query, setQuery] = useState("");
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(false);
  const [os, setOs] = useState("win32");
  const [cpu, setCpu] = useState("x64");
  const [sortBy, setSortBy] = useState("0");

  const { getDownloadUrl } = useDownloadUrl();

  const searchExtensions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${query}&sortBy=${sortBy}`);
      const data = (await res.json()) as { extensions?: Extension[] };
      setExtensions(data.extensions || []);
    } catch (error) {
      console.error("Search失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 relative">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">VSCode插件下载</h1>
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
              搜索
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          <div>
            <div>
              <label className="block text-sm font-medium mb-1">排序方式</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="0">默认排序</option>
                <option value="4">安装量降序</option>
                <option value="6">评分降序</option>
                <option value="8">更新时间降序</option>
                <option value="10">发布日期降序</option>
              </select>
            </div>
          </div>
        </div>
        {extensions.length > 0 ? (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">搜索结果</h2>
            </div>
            <div className="border rounded divide-y">
              {extensions.map((ext) => {
                const stats =
                  ext.statistics?.reduce((acc, stat) => {
                    acc[stat.statisticName] = stat.value;
                    return acc;
                  }, {} as Record<string, number>) || {};

                const installs = stats.install || 0;
                const rating = stats.averagerating || 0;
                const ratingCount = stats.ratingcount || 0;
                const verified =
                  ext.publisher.flags?.includes("verified") || false;
                const lastUpdated = ext.lastUpdated
                  ? new Date(ext.lastUpdated).toLocaleDateString()
                  : "未知";
                const publishedDate = ext.publishedDate
                  ? new Date(ext.publishedDate).toLocaleDateString()
                  : "未知";

                return (
                  <div
                    key={ext.extensionId}
                    className="p-4 transition-colors"
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
                          {ext.publisher.displayName} • v
                          {ext.versions[0].version}
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
        ) : (
          <div className="text-center">
            <p className="text-gray-500">没有搜索结果</p>
          </div>
        )}
      </div>
    </div>
  );
}
