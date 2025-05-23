"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import SearchInput from "@/components/SearchInput";
import DownloadButton from "@/components/DownloadButton";
import { Extension } from "@/types";
import { useDownloadUrl } from "@/hooks/useDownloadUrl";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import useExtensionStore from "@/store/extensionStore";

export default function Home() {
  const {
    query,
    setQuery,
    extensions,
    loading,
    os,
    setOs,
    cpu,
    setCpu,
    sortBy,
    setSortBy,
    downloadList,
    setDownloadList,
    searchExtensions,
  } = useExtensionStore();

  const { getDownloadUrl } = useDownloadUrl();

  return (
    <div className="min-h-screen p-8 relative">
      {loading && <LoadingSpinner />}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">VSCode插件下载</h1>
        <SearchInput
          query={query}
          setQuery={setQuery}
          loading={loading}
          onSearch={searchExtensions}
        />
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
                      <button
                        onClick={() => {
                          if (downloadList.some(item => item.extensionId === ext.extensionId)) {
                            setDownloadList(downloadList.filter(item => item.extensionId !== ext.extensionId));
                          } else {
                            setDownloadList([...downloadList, ext]);
                          }
                        }}
                        className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                          downloadList.some(item => item.extensionId === ext.extensionId)
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {downloadList.some(item => item.extensionId === ext.extensionId) ? "已添加" : "加入列表"}
                      </button>
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

        {downloadList.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-xl border border-gray-200 w-64 transition-all duration-300 transform hover:scale-105">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800">下载列表 ({downloadList.length})</h3>
              <button
                onClick={() => setDownloadList([])}
                className="text-xs text-gray-500 hover:text-red-500"
              >
                清空
              </button>
            </div>
            <ul className="mb-4 max-h-60 overflow-y-auto divide-y divide-gray-100">
              {downloadList.map(ext => (
                <li
                  key={ext.extensionId}
                  className="flex justify-between items-center py-2 px-1 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-700 truncate max-w-[160px]">{ext.displayName}</span>
                  <button
                    onClick={() => setDownloadList(downloadList.filter(item => item.extensionId !== ext.extensionId))}
                    className="text-red-400 hover:text-red-600 text-xs p-1 rounded-full hover:bg-red-50 transition-colors"
                    title="移除"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <DownloadButton
              count={downloadList.length}
              onClick={async () => {
                const zip = new JSZip();
                const folder = zip.folder("vscode-extensions");
                
                for (const ext of downloadList) {
                  const url = getDownloadUrl(ext, os, cpu);
                  const response = await fetch(url);
                  const blob = await response.blob();
                  const fileName = `${ext.publisher.publisherName}.${ext.extensionName}-${ext.versions[0].version}.vsix`;
                  folder?.file(fileName, blob);
                }

                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, "vscode-extensions.zip");
              }}
              disabled={downloadList.length === 0}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
