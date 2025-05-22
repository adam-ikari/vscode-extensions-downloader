"use client";

import { useState } from "react";
import Image from "next/image";
import { Extension } from "@/types";

export default function Home() {
  const [query, setQuery] = useState("");
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [selectedExtensions, setSelectedExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState("latest");
  const [os, setOs] = useState("win32-x64");
  const [cpu, setCpu] = useState("x64");

  // 切换插件选择状态
  const toggleExtension = (ext: Extension) => {
    setSelectedExtensions(prev => 
      prev.some(e => e.id === ext.id) 
        ? prev.filter(e => e.id !== ext.id)
        : [...prev, ext]
    );
  };

  // 搜索功能保持不变...

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
      console.error("Download failed:", error);
      alert("下载失败，请重试");
    }
  };

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      {/* 头部和搜索表单保持不变... */}
      
      {/* 修改搜索结果列表 */}
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
  );
}
