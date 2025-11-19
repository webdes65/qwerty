import { useEffect, useState } from "react";
import MapCardHandlers from "@module/container/main/map/MapCardHandlers.js";
import { triggerMapRefresh } from "@module/container/main/map/MapShapesLoader.jsx";

export default function CollectionDropdown({
  hiddenCollections,
  setHiddenCollections,
}) {
  const { fetchShapesList, shapesList, loading } = MapCardHandlers();

  const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);

  useEffect(() => {
    fetchShapesList();
  }, []);

  const handleCollectionToggle = (collectionName) => {
    setHiddenCollections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(collectionName)) {
        newSet.delete(collectionName);
      } else {
        newSet.add(collectionName);
      }
      return newSet;
    });

    setTimeout(() => {
      triggerMapRefresh();
    }, 1);
  };

  return (
    <div
      className="absolute top-20 left-2 z-[1000] bg-white dark:bg-gray-800 rounded-lg shadow-xl"
      style={{
        maxWidth: "300px",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={() => setIsPanelCollapsed(false)}
      onMouseLeave={() => setIsPanelCollapsed(true)}
    >
      <div
        className="flex items-center justify-between gap-1 p-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg cursor-pointer"
        onClick={() => {
          setIsPanelCollapsed((prevState) => !prevState);
        }}
      >
        <button className="hover:bg-transparent rounded p-1 transition-colors">
          <svg
            className={`w-4 h-4 transition-transform ${isPanelCollapsed ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {!isPanelCollapsed && (
        <div className="p-3">
          {loading ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto" />
              <p className="mt-2 text-xs">loading...</p>
            </div>
          ) : shapesList.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-2 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-xs">Not found</p>
            </div>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {shapesList.map((shape) => {
                const isVisible = !hiddenCollections.has(shape.name);
                return (
                  <label
                    key={shape.uuid}
                    className="flex items-center p-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => handleCollectionToggle(shape.name)}
                      className="w-4 h-4 ml-2 accent-blue-600 cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 ml-2">
                      <span className="text-sm text-dark-100 dark:text-white block truncate">
                        {shape.name || `shape ${shape.uuid}`}
                      </span>
                    </div>
                    {shape.color && (
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0 mr-2"
                        style={{ backgroundColor: shape.color }}
                      />
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
