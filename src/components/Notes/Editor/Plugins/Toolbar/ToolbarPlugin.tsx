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
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import {
  $createHeadingNode,
  HeadingNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $isLinkNode, $toggleLink } from "@lexical/link";
import { useCallback, useEffect, useRef, useState } from "react";

//assets
// @ts-ignore
import Link from "../../../../../assets/link.svg?react";
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
      {/* <Divider /> */}
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
      <button
        onClick={handleInsertLink}
        className={"toolbar-item spaced link " + (isLink ? "active" : "")}
        aria-label="Insert Link"
      >
        <Link />
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
      </button>{" "}
    </div>
  );
}
