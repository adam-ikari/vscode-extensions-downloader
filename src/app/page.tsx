"use client";

import { useState } from "react";
import Image from "next/image";
import { Extension } from "@/types";

export default function Home() {
  const [query, setQuery] = useState("");
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState("latest");
  const [os, setOs] = useState("win32-x64");
  const [cpu, setCpu] = useState("x64");

  const searchExtensions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${query}`);
      const data = await res.json() as { extensions?: Extension[] };
      setExtensions(data.extensions || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadExtensions = async () => {
    if (!extensions.length) return;
    
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          extensions: extensions.map(ext => ext.id),
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
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">VSCode扩展批量下载</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">搜索扩展</label>
              <div className="flex">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 border rounded-l px-3 py-2"
                  placeholder="输入扩展名称或关键词"
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
                <option value="1.83.0">1.83.0</option>
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
                <option value="win32-arm64">Windows ARM64</option>
                <option value="darwin-x64">macOS Intel</option>
                <option value="darwin-arm64">macOS Apple Silicon</option>
                <option value="linux-x64">Linux x64</option>
                <option value="linux-arm64">Linux ARM64</option>
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
                <h2 className="text-lg font-semibold">搜索结果</h2>
                <button
                  onClick={downloadExtensions}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  批量下载
                </button>
              </div>
              <div className="border rounded divide-y">
                {extensions.map((ext) => (
                  <div key={ext.id} className="p-3 flex items-center">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => {}}
                      className="mr-3"
                    />
                    <div>
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
    </div>
  );
}
