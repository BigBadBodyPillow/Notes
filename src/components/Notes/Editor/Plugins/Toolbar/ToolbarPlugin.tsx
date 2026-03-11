/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  ParagraphNode,
  $isTextNode,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import {
  $createHeadingNode,
  HeadingNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $isLinkNode, $toggleLink } from "@lexical/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { INSERT_TABLE_COMMAND } from "../Table/TablePlugin";

//assets
// @ts-ignore
import AlignLeft from "../../../../../assets/align-left.svg?react";
// @ts-ignore
import AlignCenter from "../../../../../assets/align-center.svg?react";
// @ts-ignore
import AlignRight from "../../../../../assets/align-right.svg?react";
// @ts-ignore
import AlignJustified from "../../../../../assets/align-justified.svg?react";
// @ts-ignore
import Undo from "../../../../../assets/arrow-back-up.svg?react";
// @ts-ignore
import Redo from "../../../../../assets/arrow-forward.svg?react";
// @ts-ignore
import Link from "../../../../../assets/link.svg?react";
// @ts-ignore
import Table from "../../../../../assets/table.svg?react";

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState<string>("paragraph");
  const [isLink, setIsLink] = useState(false);
  const [fontSize, setFontSize] = useState<string>("15px");
  const [fontColor, setFontColor] = useState<string>("#f156fffc");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      // Update block type
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      if ($isHeadingNode(element)) {
        const headingElement = element as HeadingNode;
        setBlockType(headingElement.getTag());
      } else {
        setBlockType(element.getType());
      }

      // Update link state
      const parent = anchorNode.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(anchorNode));

      // Update font size
      const selectedNode = selection.anchor.getNode();
      if ($isTextNode(selectedNode)) {
        const style = selectedNode.getStyle();
        const fontSizeMatch = style.match(/font-size:\s*(\d+(?:\.\d+)?)px/);
        if (fontSizeMatch) {
          setFontSize(fontSizeMatch[1] + "px");
        } else {
          setFontSize("15px");
        }

        // Update font color
        const colorMatch = style.match(/color:\s*(rgb\(\d+,\s*\d+,\s*\d+\))/);
        if (colorMatch) {
          const rgb = colorMatch[1];
          // Convert rgb to hex
          const rgbValues = rgb.match(/\d+/g);
          if (rgbValues && rgbValues.length === 3) {
            const hex =
              "#" +
              rgbValues
                .map((x) => {
                  const hex = parseInt(x).toString(16);
                  return hex.length === 1 ? "0" + hex : hex;
                })
                .join("")
                .toUpperCase();
            setFontColor(hex);
          } else {
            setFontColor("#ffffff");
          }
        } else {
          setFontColor("#ffffff");
        }
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            $updateToolbar();
          },
          { editor },
        );
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateToolbar]);

  const handleHeadingChange = (headingSize: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (headingSize === "paragraph") {
          $setBlocksType(selection, () => new ParagraphNode());
        } else if (["h1", "h2", "h3"].includes(headingSize)) {
          $setBlocksType(selection, () =>
            $createHeadingNode(headingSize as any),
          );
        }
      }
    });
  };

  const handleFontSizeChange = (size: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        nodes.forEach((node) => {
          if ($isTextNode(node)) {
            const style = node.getStyle();
            const newStyle = style.replace(
              /font-size:\s*\d+(?:\.\d+)?px;?/g,
              "",
            );
            node.setStyle(newStyle + `font-size: ${size}px;`);
          }
        });
      }
    });
  };

  const handleFontColorChange = (color: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        nodes.forEach((node) => {
          if ($isTextNode(node)) {
            const style = node.getStyle();
            // Convert hex to rgb
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            const rgb = `rgb(${r}, ${g}, ${b})`;
            const newStyle = style.replace(
              /color:\s*rgb\(\d+,\s*\d+,\s*\d+\);?/g,
              "",
            );
            node.setStyle(newStyle + `color: ${rgb};`);
          }
        });
      }
    });
  };

  const handleInsertLink = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const url = prompt("Enter the URL:");
        if (url) {
          $toggleLink(url);
        }
      }
    });
  };

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <Redo />
      </button>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <Undo />
      </button>
      <Divider />
      <select
        value={blockType}
        onChange={(e) => handleHeadingChange(e.target.value)}
        className="toolbar-item spaced heading"
        aria-label="Block Type"
      >
        <option value="paragraph">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>
      <select
        value={fontSize.replace("px", "")}
        onChange={(e) => handleFontSizeChange(e.target.value)}
        className="toolbar-item spaced toolbar-font-size"
        aria-label="Font Size"
      >
        <option value="8">8px</option>
        <option value="10">10px</option>
        <option value="12">12px</option>
        <option value="14">14px</option>
        <option value="15">15px</option>
        <option value="18">18px</option>
        <option value="24">24px</option>
        <option value="32">32px</option>
        <option value="48">48px</option>
        <option value="72">72px</option>
      </select>
      <input
        type="color"
        value={fontColor}
        onChange={(e) => handleFontColorChange(e.target.value)}
        className="toolbar-item toolbar-color-input"
        aria-label="Font Color"
        title="Font Color"
      />
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={"toolbar-item spaced bold " + (isBold ? "active" : "")}
        aria-label="Format Bold"
      >
        B
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={"toolbar-item spaced italic " + (isItalic ? "active" : "")}
        aria-label="Format Italics"
      >
        i
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={
          "toolbar-item spaced underline " + (isUnderline ? "active" : "")
        }
        aria-label="Format Underline"
      >
        U
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={
          "toolbar-item spaced strikethrough " +
          (isStrikethrough ? "active" : "")
        }
        aria-label="Format Strikethrough"
      >
        S
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="toolbar-item spaced"
        aria-label="Left Align"
      >
        <AlignLeft />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="toolbar-item spaced"
        aria-label="Center Align"
      >
        <AlignCenter />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="toolbar-item spaced"
        aria-label="Right Align"
      >
        <AlignRight />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        <AlignJustified />
      </button>
      <Divider />
      <button
        onClick={handleInsertLink}
        className={"toolbar-item spaced link " + (isLink ? "active" : "")}
        aria-label="Insert Link"
      >
        <Link />
      </button>
      {/* <button
        onClick={() => {
          editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: 3, columns: 3 });
        }}
        className="toolbar-item spaced table "
        aria-label="Insert Table"
      >
        <Table />
      </button> */}
    </div>
  );
}
