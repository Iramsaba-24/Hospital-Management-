import { useState, useEffect } from "react";
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";

// ── Types ──────────────────────────────────────────────────────────────────────

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
};

export type ActionButton<T> = {
  label: string;
  icon: React.ReactNode;
  onClick: (row: T) => void;
  disabled?: boolean;
  className?: string;
};

type Props<T extends { id: string | number; [key: string]: any }> = {
  // ── Data ────────────────────────────────────────────────────────
  columns: Column<T>[];
  data: T[];

  // ── Header ──────────────────────────────────────────────────────
  title: string;
  totalLabel?: string;

  // ── Search & filters ────────────────────────────────────────────
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filterSlot?: React.ReactNode;

  // ── Add button ──────────────────────────────────────────────────
  addButtonLabel?: string;
  onAddClick?: () => void;

  // ── Built-in action buttons (pass handler to show, omit to hide) ─
  onView?:   (id: string | number) => void;   // shows 👁 View button
  onEdit?:   (id: string | number) => void;   // shows ✏ Edit button
  onDelete?: (id: string | number) => void;   // shows 🗑 Delete button

  // ── Extra custom action buttons ─────────────────────────────────
  actions?: ActionButton<T>[];

  // ── Multiple delete (omit to hide checkboxes) ───────────────────
  onDeleteMultiple?: (ids: (string | number)[]) => void;
  deleteMultipleLabel?: string;

  // ── Row click ───────────────────────────────────────────────────
  onRowClick?: (row: T) => void;

  // ── Pagination ──────────────────────────────────────────────────
  itemsPerPage?: number;

  // ── Empty state ─────────────────────────────────────────────────
  emptyMessage?: string;
};

// ── Component ──────────────────────────────────────────────────────────────────

const Controltable = <T extends { id: string | number; [key: string]: any }>({
  columns,
  data,
  title,
  totalLabel,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  filterSlot,
  addButtonLabel = "Add",
  onAddClick,
  onView,
  onEdit,
  onDelete,
  actions = [],
  onDeleteMultiple,
  deleteMultipleLabel = "Delete Selected",
  onRowClick,
  itemsPerPage = 10,
  emptyMessage = "No data found.",
}: Props<T>) => {

  const [page, setPage]                 = useState(1);
  const [selectedIds, setSelectedIds]   = useState<Set<string | number>>(new Set());
  const [selectAll, setSelectAll]       = useState(false);

  const totalPages    = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const startIndex    = (page - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  // ── Reset selections when data changes (same logic as demo) ───────────────
  useEffect(() => {
    setSelectedIds(new Set());
    setSelectAll(false);
  }, [data]);

  // ── Sync selectAll state (same logic as demo) ─────────────────────────────
  useEffect(() => {
    setSelectAll(
      selectedIds.size === paginatedData.length && paginatedData.length > 0
    );
  }, [selectedIds, paginatedData]);

  // ── Reset page on search ──────────────────────────────────────────────────
  const handleSearch = (value: string) => {
    setPage(1);
    setSelectedIds(new Set());
    onSearchChange?.(value);
  };

  // ── Select all on current page (uses row.id like the demo) ────────────────
  const handleSelectAll = (checked: boolean) => {
    const pageIds = new Set(paginatedData.map((item) => item.id));
    const next    = new Set(selectedIds);
    pageIds.forEach((id) => (checked ? next.add(id) : next.delete(id)));
    setSelectedIds(next);
  };

  // ── Select single row ─────────────────────────────────────────────────────
  const handleRowSelect = (id: string | number, checked: boolean) => {
    const next = new Set(selectedIds);
    checked ? next.add(id) : next.delete(id);
    setSelectedIds(next);
  };

  // ── Delete selected — passes ids array (same as demo) ────────────────────
  const handleDeleteSelected = () => {
    onDeleteMultiple?.(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  // ── Visibility flags ──────────────────────────────────────────────────────
  const showCheckboxes    = !!onDeleteMultiple;
  const showBuiltinActions = onView || onEdit || onDelete;
  const showActionsColumn  = showBuiltinActions || actions.length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {totalLabel && (
            <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              {totalLabel}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Delete Selected — only visible when rows are checked */}
          {showCheckboxes && selectedIds.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <MdDelete size={16} />
              {deleteMultipleLabel} ({selectedIds.size})
            </button>
          )}

          {onAddClick && (
            <button
              onClick={onAddClick}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {addButtonLabel}
            </button>
          )}
        </div>
      </div>
      
      {(onSearchChange || filterSlot) && (
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {onSearchChange && (
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 outline-none focus:border-blue-400"
            />
          )}
          {filterSlot}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-max">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 text-left">

              {/* Checkbox header — only if onDeleteMultiple is passed */}
              {showCheckboxes && (
                <th className="pb-3 pr-4 w-8">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                  />
                </th>
              )}

              {columns.map((col) => (
                <th key={String(col.key)} className="pb-3 pr-6 font-medium whitespace-nowrap">
                  {col.label}
                </th>
              ))}

              {showActionsColumn && (
                <th className="pb-3 font-medium whitespace-nowrap">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (showActionsColumn ? 1 : 0) +
                    (showCheckboxes ? 1 : 0)
                  }
                  className="text-center py-10 text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-gray-50 transition-colors ${
                    selectedIds.has(row.id) ? "bg-blue-50" : "hover:bg-gray-50"
                  } ${onRowClick ? "cursor-pointer" : ""}`}
                >

                  {/* Checkbox cell — stops row click propagation */}
                  {showCheckboxes && (
                    <td className="py-3 pr-4 w-8" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(row.id)}
                        onChange={(e) => handleRowSelect(row.id, e.target.checked)}
                        className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                      />
                    </td>
                  )}

                  {/* Data cells */}
                  {columns.map((col) => (
                    <td key={String(col.key)} className="py-3 pr-6 text-gray-700 whitespace-nowrap">
                      {col.render
                        ? col.render(row[col.key as string], row)
                        : String(row[col.key as string] ?? "")}
                    </td>
                  ))}

                  {/* Actions cell — stops row click propagation */}
                  {showActionsColumn && (
                    <td className="py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(row.id)}
                            title="View"
                            className="p-1 rounded hover:bg-gray-100 transition-colors text-green-500 hover:text-green-700"
                          >
                            <MdVisibility size={17} />
                          </button>
                        )}

                        {onEdit && (
                          <button
                            onClick={() => onEdit(row.id)}
                            title="Edit"
                            className="p-1 rounded hover:bg-gray-100 transition-colors text-blue-400 hover:text-blue-600"
                          >
                            <MdEdit size={16} />
                          </button>
                        )}

                        {onDelete && (
                          <button
                            onClick={() => onDelete(row.id)}
                            title="Delete"
                            className="p-1 rounded hover:bg-gray-100 transition-colors text-red-400 hover:text-red-600"
                          >
                            <MdDelete size={16} />
                          </button>
                        )}

                        {actions
                          .filter((action) => !action.disabled)
                          .map((action, i) => (
                            <button
                              key={i}
                              onClick={() => action.onClick(row)}
                              title={action.label}
                              className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                                action.className ?? "text-gray-500 hover:text-gray-700"
                              }`}
                            >
                              {action.icon}
                            </button>
                          ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <p>
            Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, data.length)} of {data.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-2 py-1 rounded border transition-colors ${
                  p === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Controltable;