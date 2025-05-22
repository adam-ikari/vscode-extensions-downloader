"use client";

import { useState } from "react";
import { Extension } from "@/types";

export default function Home() {
  const [query, setQuery] = useState("");
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [selectedExtensions, setSelectedExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState("latest");
  const [os, setOs] = useState("win32-x64");
  const [cpu, setCpu] = useState("x64");

  const toggleExtension = (ext: Extension) => {
    setSelectedExtensions(prev => 
      prev.some(e => e.id === ext.id) 
        ? prev.filter(e => e.id !== ext.id)
        : [...prev, ext]
    );
  };

  const searchExtensions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${query}`);
      const data = await res.json() as { extensions?: Extension[] };
      setExtensions(data.extensions || []);
    } catch (error) {
      console.error("Search失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadExtensions = async () => {
    if (!selectedExtensions.length) return;
    
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          extensions: selectedExtensions.map(ext => ext.uuid),
          version,
          os,
          cpu
        }),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vscode-extensions.zip";
      a.click();
    } catch (error) {
      console.error("下载失败:", error);
      alert("下载失败，请重试");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">VSCode插件批量下载</h1>
        
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

          <div>
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">操作系统</label>
            <select
              value={os}
              onChange={(e) => setOs(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="win32-x64">Windows x64</option>
              <option value="darwin-x64">macOS Intel</option>
              <option value="linux-x64">Linux x64</option>
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
            </select>
          </div>
        </div>

        {extensions.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                搜索结果 (已选择 {selectedExtensions.length} 个)
              </h2>
              <button
                onClick={downloadExtensions}
                disabled={!selectedExtensions.length}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                下载选中项
              </button>
            </div>
            <div className="border rounded divide-y">
              {extensions.map((ext) => (
                <div key={ext.id} className="p-3 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedExtensions.some(e => e.id === ext.id)}
                    onChange={() => toggleExtension(ext)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{ext.name}</div>
                    <div className="text-sm text-gray-500">{ext.publisher}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
