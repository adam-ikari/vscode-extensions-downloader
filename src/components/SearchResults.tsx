import { Extension } from "@/types";
import { useState } from "react";

interface SearchResultsProps {
  extensions: Extension[];
  selectedIds: string[];
  onSelect: (ext: Extension) => void;
  onDeselect: (extId: string) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  renderItem?: (ext: Extension, isSelected: boolean) => React.ReactNode;
}

export default function SearchResults({
  extensions,
  selectedIds,
  onSelect,
  onDeselect,
  onSelectAll,
  onDeselectAll,
  renderItem,
}: SearchResultsProps) {
  const defaultRenderItem = (ext: Extension, isSelected: boolean) => {
    const stats = ext.statistics?.reduce((acc, stat) => {
      acc[stat.statisticName] = stat.value;
      return acc;
    }, {} as Record<string, number>) || {};

    const installs = stats.install || 0;
    const rating = stats.averagerating || 0;
    const ratingCount = stats.ratingcount || 0;
    const verified = ext.publisher.flags?.includes("verified") || false;
    const lastUpdated = ext.lastUpdated
      ? new Date(ext.lastUpdated).toLocaleDateString()
      : "未知";
    const publishedDate = ext.publishedDate
      ? new Date(ext.publishedDate).toLocaleDateString()
      : "未知";

    return (
      <div key={ext.extensionId} className="p-4 transition-colors">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{ext.displayName}</h3>
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
          <button
            onClick={() => {
              isSelected ? onDeselect(ext.extensionId) : onSelect(ext);
            }}
            className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
              isSelected
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isSelected ? "已选择" : "选择"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">搜索结果 ({extensions.length})</h2>
      </div>
      <div className="border rounded divide-y">
        {extensions.map((ext) => {
          const isSelected = selectedIds.includes(ext.extensionId);
          return renderItem
            ? renderItem(ext, isSelected)
            : defaultRenderItem(ext, isSelected);
        })}
      </div>
    </div>
  );
}