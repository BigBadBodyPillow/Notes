/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export default function LinkPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      let target = event.target as HTMLElement;

      // Walk up the DOM tree to find an anchor tag
      while (target && target !== document.body) {
        if (target.tagName === "A") {
          const href = (target as HTMLAnchorElement).href;
          if (href) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            // Open link in new tab
            window.open(href, "_blank");
            return;
          }
        }
        target = target.parentElement as HTMLElement;
      }
    };

    const editorElement = editor.getRootElement();
    if (editorElement) {
      // Use capture phase to intercept events before ContentEditable handles them
      editorElement.addEventListener("mousedown", handleMouseDown, true);

      return () => {
        editorElement.removeEventListener("mousedown", handleMouseDown, true);
      };
    }
  }, [editor]);

  return null;
}
