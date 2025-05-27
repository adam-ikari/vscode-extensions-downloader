"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import SearchInput from "@/components/SearchInput";
import DownloadButton from "@/components/DownloadButton";
import MultiSelect from "@/components/MultiSelect";
import SearchResults from "@/components/SearchResults";
import Dropdown from "@/components/Dropdown";
import { Extension } from "@/types";
import { useDownloadAndZip } from "@/hooks/useDownloadAndZip";
import useExtensionStore from "@/store/extensionStore";
import useDownloadListStore from "@/store/downloadListStore";
import useDownloadStore from "@/store/downloadStore";

export default function Home() {
  const {
    query,
    setQuery,
    loading,
    platforms,
    setPlatforms,
    sortBy,
    setSortBy,
    searchExtensions,
  } = useExtensionStore();

  const { downloadList, setDownloadList } = useDownloadStore();
  const { extensions = [] } = useDownloadListStore();

  const { downloadAndZipExtensions, isDownloading } = useDownloadAndZip();

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

        <MultiSelect
          label="平台"
          values={platforms}
          onChange={setPlatforms}
          options={[
            { value: "win32-x64", label: "Windows x64" },
            { value: "win32-arm64", label: "Windows ARM64" },
            { value: "darwin-x64", label: "macOS x64" },
            { value: "darwin-arm64", label: "macOS ARM64" },
            { value: "linux-x64", label: "Linux x64" },
            { value: "linux-arm64", label: "Linux ARM64" },
          ]}
        />
        <div className="flex flex-wrap gap-4 mb-6">
          <Dropdown
            label="排序方式"
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: "0", label: "默认排序" },
              { value: "4", label: "安装量降序" },
              { value: "6", label: "评分降序" },
              { value: "8", label: "更新时间降序" },
              { value: "10", label: "发布日期降序" },
            ]}
          />
        </div>
        {extensions.length > 0 ? (
          <SearchResults
            extensions={extensions}
            selectedIds={downloadList.map((item) => item.extensionId)}
            onSelect={(ext: Extension) =>
              setDownloadList([...downloadList, ext])
            }
            onDeselect={(ext: Extension) =>
              setDownloadList(
                downloadList.filter(
                  (item) => item.extensionId !== ext.extensionId
                )
              )
            }
          />
        ) : (
          <div className="text-center">
            <p className="text-gray-500">没有搜索结果</p>
          </div>
        )}

        {downloadList.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-xl border border-gray-200 w-64 transition-all duration-300 transform hover:scale-105">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800">
                下载列表 ({downloadList.length})
              </h3>
              <button
                onClick={() => setDownloadList([])}
                className="text-xs text-gray-500 hover:text-red-500"
              >
                清空
              </button>
            </div>
            <ul className="mb-4 max-h-60 overflow-y-auto divide-y divide-gray-100">
              {downloadList.map((ext) => (
                <li
                  key={ext.extensionId}
                  className="flex justify-between items-center py-2 px-1 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-700 truncate max-w-[160px]">
                    {ext.displayName}
                  </span>
                  <button
                    onClick={() =>
                      setDownloadList(
                        downloadList.filter(
                          (item) => item.extensionId !== ext.extensionId
                        )
                      )
                    }
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
              onClick={() => downloadAndZipExtensions(downloadList, platforms)}
              disabled={downloadList.length === 0 || isDownloading}
              loading={isDownloading}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
