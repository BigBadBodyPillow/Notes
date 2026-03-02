/**
 * Table Plugin with Context Menu Support
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createTableNodeWithDimensions,
  TableNode,
  TableRowNode,
  TableCellNode,
  $isTableNode,
  $isTableCellNode,
  $isTableRowNode,
} from "@lexical/table";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  ParagraphNode,
  LexicalNode,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";

// Commands for table operations
export const INSERT_TABLE_COMMAND = createCommand<{
  rows?: number;
  columns?: number;
}>("INSERT_TABLE_COMMAND");

interface ContextMenuPosition {
  top: number;
  left: number;
}

interface ContextMenuState {
  isOpen: boolean;
  position: ContextMenuPosition;
  cellNode: TableCellNode | null;
  rowIndex: number;
  colIndex: number;
}

export default function TablePlugin() {
  const [editor] = useLexicalComposerContext();
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    position: { top: 0, left: 0 },
    cellNode: null,
    rowIndex: 0,
    colIndex: 0,
  });
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Handle Insert Table Command
  useEffect(() => {
    return editor.registerCommand(
      INSERT_TABLE_COMMAND,
      ({ rows = 3, columns = 3 }) => {
        editor.update(() => {
          const tableNode = $createTableNodeWithDimensions(rows, columns, true);
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            const focusNode = selection.focus.getNode();
            focusNode.insertAfter(tableNode);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  // Handle right-click context menu
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const cellElement = target.closest("td, th");

      if (cellElement) {
        event.preventDefault();

        setTimeout(() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const anchorNode = selection.anchor.getNode();
              let currentNode: LexicalNode | null = anchorNode;

              // Walk up the tree to find a TableCellNode
              while (currentNode) {
                if ($isTableCellNode(currentNode)) {
                  const cellNode = currentNode as TableCellNode;
                  const rowNode = cellNode.getParent();
                  if ($isTableRowNode(rowNode)) {
                    const tableNode = rowNode.getParent();
                    if ($isTableNode(tableNode)) {
                      const rowIndex = rowNode.getIndexWithinParent();
                      const colIndex = cellNode.getIndexWithinParent();

                      setContextMenu({
                        isOpen: true,
                        position: { top: event.clientY, left: event.clientX },
                        cellNode,
                        rowIndex,
                        colIndex,
                      });
                    }
                  }
                  return;
                }
                currentNode = currentNode.getParent();
              }
            }
          });
        }, 0);
      }
    };

    // Handle click outside to close menu
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setContextMenu((prev) => ({ ...prev, isOpen: false }));
      }
    };

    const editorElement = editor.getRootElement();
    if (editorElement) {
      editorElement.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("click", handleClickOutside);

      return () => {
        editorElement.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [editor]);

  const insertRowAbove = useCallback(() => {
    if (!contextMenu.cellNode) return;

    editor.update(() => {
      const cellNode = contextMenu.cellNode;
      if (!$isTableCellNode(cellNode)) return;

      const rowNode = cellNode.getParent();
      if (!$isTableRowNode(rowNode)) return;

      const tableNode = rowNode.getParent();
      if (!$isTableNode(tableNode)) return;

      const rowIndex = rowNode.getIndexWithinParent();
      const colCount = rowNode.getChildren().length;

      const newRow = new TableRowNode();
      for (let i = 0; i < colCount; i++) {
        const newCell = new TableCellNode(1);
        newCell.append(new ParagraphNode());
        newRow.append(newCell);
      }

      const rows = tableNode.getChildren();
      tableNode.clear();

      rows.forEach((row, idx) => {
        if (idx === rowIndex) {
          tableNode.append(newRow);
        }
        tableNode.append(row);
      });
    });

    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, [contextMenu.cellNode, editor]);

  const insertRowBelow = useCallback(() => {
    if (!contextMenu.cellNode) return;

    editor.update(() => {
      const cellNode = contextMenu.cellNode;
      if (!$isTableCellNode(cellNode)) return;

      const rowNode = cellNode.getParent();
      if (!$isTableRowNode(rowNode)) return;

      const tableNode = rowNode.getParent();
      if (!$isTableNode(tableNode)) return;

      const rowIndex = rowNode.getIndexWithinParent();
      const colCount = rowNode.getChildren().length;

      const newRow = new TableRowNode();
      for (let i = 0; i < colCount; i++) {
        const newCell = new TableCellNode(1);
        newCell.append(new ParagraphNode());
        newRow.append(newCell);
      }

      const rows = tableNode.getChildren();
      tableNode.clear();

      rows.forEach((row, idx) => {
        tableNode.append(row);
        if (idx === rowIndex) {
          tableNode.append(newRow);
        }
      });
    });

    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, [contextMenu.cellNode, editor]);

  const insertColumnLeft = useCallback(() => {
    if (!contextMenu.cellNode) return;

    editor.update(() => {
      const cellNode = contextMenu.cellNode;
      if (!$isTableCellNode(cellNode)) return;

      const rowNode = cellNode.getParent();
      if (!$isTableRowNode(rowNode)) return;

      const tableNode = rowNode.getParent();
      if (!$isTableNode(tableNode)) return;

      const cellIndex = cellNode.getIndexWithinParent();

      const rows = tableNode.getChildren();
      rows.forEach((row) => {
        if ($isTableRowNode(row)) {
          const newCell = new TableCellNode(1);
          newCell.append(new ParagraphNode());

          const cells = row.getChildren();
          row.clear();

          cells.forEach((cell, idx) => {
            if (idx === cellIndex) {
              row.append(newCell);
            }
            row.append(cell);
          });
        }
      });
    });

    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, [contextMenu.cellNode, editor]);

  const insertColumnRight = useCallback(() => {
    if (!contextMenu.cellNode) return;

    editor.update(() => {
      const cellNode = contextMenu.cellNode;
      if (!$isTableCellNode(cellNode)) return;

      const rowNode = cellNode.getParent();
      if (!$isTableRowNode(rowNode)) return;

      const tableNode = rowNode.getParent();
      if (!$isTableNode(tableNode)) return;

      const cellIndex = cellNode.getIndexWithinParent();

      const rows = tableNode.getChildren();
      rows.forEach((row) => {
        if ($isTableRowNode(row)) {
          const newCell = new TableCellNode(1);
          newCell.append(new ParagraphNode());

          const cells = row.getChildren();
          row.clear();

          cells.forEach((cell, idx) => {
            row.append(cell);
            if (idx === cellIndex) {
              row.append(newCell);
            }
          });
        }
      });
    });

    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, [contextMenu.cellNode, editor]);

  const deleteRow = useCallback(() => {
    if (!contextMenu.cellNode) return;

    editor.update(() => {
      const cellNode = contextMenu.cellNode;
      if (!$isTableCellNode(cellNode)) return;

      const rowNode = cellNode.getParent();
      if (!$isTableRowNode(rowNode)) return;

      const tableNode = rowNode.getParent();
      if (!$isTableNode(tableNode)) return;

      if (tableNode.getChildren().length > 1) {
        rowNode.remove();
      }
    });

    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, [contextMenu.cellNode, editor]);

  const deleteColumn = useCallback(() => {
    if (!contextMenu.cellNode) return;

    editor.update(() => {
      const cellNode = contextMenu.cellNode;
      if (!$isTableCellNode(cellNode)) return;

      const rowNode = cellNode.getParent();
      if (!$isTableRowNode(rowNode)) return;

      const tableNode = rowNode.getParent();
      if (!$isTableNode(tableNode)) return;

      const cellIndex = cellNode.getIndexWithinParent();

      if (rowNode.getChildren().length > 1) {
        const rows = tableNode.getChildren();
        rows.forEach((row) => {
          if ($isTableRowNode(row)) {
            const cells = row.getChildren();
            const cellToRemove = cells[cellIndex];
            if (cellToRemove) {
              cellToRemove.remove();
            }
          }
        });
      }
    });

    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, [contextMenu.cellNode, editor]);

  const toggleHeaderRow = useCallback(() => {
    if (!contextMenu.cellNode) return;

    editor.update(() => {
      const cellNode = contextMenu.cellNode;
      if (!$isTableCellNode(cellNode)) return;

      const rowNode = cellNode.getParent();
      if (!$isTableRowNode(rowNode)) return;

      const isHeader = rowNode.getIndexWithinParent() === 0;
      const newHeaderState = !isHeader;

      rowNode.getChildren().forEach((cell) => {
        if ($isTableCellNode(cell)) {
          cell.setHeaderStyles(newHeaderState ? 1 : 0);
        }
      });
    });

    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, [contextMenu.cellNode, editor]);

  const toggleHeaderColumn = useCallback(() => {
    if (!contextMenu.cellNode) return;

    editor.update(() => {
      const cellNode = contextMenu.cellNode;
      if (!$isTableCellNode(cellNode)) return;

      const rowNode = cellNode.getParent();
      if (!$isTableRowNode(rowNode)) return;

      const tableNode = rowNode.getParent();
      if (!$isTableNode(tableNode)) return;

      const cellIndex = cellNode.getIndexWithinParent();
      const isCurrentHeader = cellNode.getHeaderStyles() === 1;
      const newHeaderState = !isCurrentHeader;

      const rows = tableNode.getChildren();
      rows.forEach((row) => {
        if ($isTableRowNode(row)) {
          const cell = row.getChildren()[cellIndex];
          if ($isTableCellNode(cell)) {
            cell.setHeaderStyles(newHeaderState ? 1 : 0);
          }
        }
      });
    });

    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, [contextMenu.cellNode, editor]);

  return (
    <>
      {contextMenu.isOpen && (
        <div
          ref={contextMenuRef}
          className="table-context-menu"
          style={{
            top: `${contextMenu.position.top}px`,
            left: `${contextMenu.position.left}px`,
          }}
        >
          <button onClick={insertRowAbove} className="context-menu-item">
            Insert Row Above
          </button>
          <button onClick={insertRowBelow} className="context-menu-item">
            Insert Row Below
          </button>
          <button onClick={deleteRow} className="context-menu-item danger">
            Delete Row
          </button>
          <button onClick={toggleHeaderRow} className="context-menu-item">
            Toggle Header Row
          </button>
          <div className="context-menu-divider" />
          <button onClick={insertColumnLeft} className="context-menu-item">
            Insert Column Left
          </button>
          <button onClick={insertColumnRight} className="context-menu-item">
            Insert Column Right
          </button>
          <button onClick={deleteColumn} className="context-menu-item danger">
            Delete Column
          </button>
          <button onClick={toggleHeaderColumn} className="context-menu-item">
            Toggle Header Column
          </button>
        </div>
      )}
    </>
  );
}
