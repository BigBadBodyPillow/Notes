import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import { useNotes } from "../../../../context/NotesContext";

interface SavePluginProps {
  noteId: string;
}

export default function SavePlugin({ noteId }: SavePluginProps) {
  const [editor] = useLexicalComposerContext();
  const { updateNote, getNoteById } = useNotes();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadedNoteIdRef = useRef<string | null>(null);

  // Load note content once when noteId changes
  useEffect(() => {
    if (loadedNoteIdRef.current === noteId) return;

    const currentNote = getNoteById(noteId);
    if (currentNote?.content) {
      try {
        const editorState = editor.parseEditorState(currentNote.content);
        editor.setEditorState(editorState);
      } catch (e) {
        console.warn("Could not load editor state from note");
      }
    }
    loadedNoteIdRef.current = noteId;
  }, [noteId, getNoteById, editor]);

  // Save note content with debouncing
  useEffect(() => {
    const removeUpdateListener = editor.registerUpdateListener(
      ({ editorState }) => {
        // Clear previous timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        // Debounce the save by 300ms
        saveTimeoutRef.current = setTimeout(() => {
          const serializedState = JSON.stringify(editorState.toJSON());
          updateNote(noteId, { content: serializedState });
        }, 300);
      },
    );

    return () => {
      removeUpdateListener();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editor, noteId, updateNote]);

  return null;
}
