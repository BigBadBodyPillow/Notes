import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error("Failed to load notes from localStorage:", error);
      }
    }
  }, []);

  // Save notes to localStorage whenever they change (with a small delay to batch updates)
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("notes", JSON.stringify(notes));
    }, 100);
    return () => clearTimeout(timeout);
  }, [notes]);

  const addNote = useCallback((parentId = null) => {
    const newNote = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date().toISOString(),
      parentId,
      type: "note",
    };

    setNotes((prevNotes) => {
      if (parentId === null) {
        return [...prevNotes, newNote];
      } else {
        return prevNotes.map((note) =>
          note.id === parentId && note.type === "folder"
            ? {
                ...note,
                children: [...(note.children || []), newNote],
              }
            : note,
        );
      }
    });

    setSelectedNoteId(newNote.id);
    return newNote.id;
  }, []);

  const addFolder = useCallback((parentId = null) => {
    const newFolder = {
      id: Date.now().toString(),
      title: "New Folder",
      children: [],
      type: "folder",
    };

    setNotes((prevNotes) => {
      if (parentId === null) {
        return [...prevNotes, newFolder];
      } else {
        return prevNotes.map((note) =>
          note.id === parentId && note.type === "folder"
            ? {
                ...note,
                children: [...(note.children || []), newFolder],
              }
            : note,
        );
      }
    });

    return newFolder.id;
  }, []);

  const updateNote = useCallback((id, updates) => {
    setNotes((prevNotes) => {
      const updateNoteRecursive = (items) =>
        items.map((item) =>
          item.id === id
            ? { ...item, ...updates }
            : item.children
              ? {
                  ...item,
                  children: updateNoteRecursive(item.children),
                }
              : item,
        );

      return updateNoteRecursive(prevNotes);
    });
  }, []);

  const deleteNote = useCallback((id) => {
    setNotes((prevNotes) => {
      const deleteNoteRecursive = (items) =>
        items
          .filter((item) => item.id !== id)
          .map((item) =>
            item.children
              ? {
                  ...item,
                  children: deleteNoteRecursive(item.children),
                }
              : item,
          );

      return deleteNoteRecursive(prevNotes);
    });

    setSelectedNoteId((prevId) => (prevId === id ? null : prevId));
  }, []);

  const getNoteById = useCallback(
    (id) => {
      const findNoteRecursive = (items) => {
        for (const item of items) {
          if (item.id === id) return item;
          if (item.children) {
            const found = findNoteRecursive(item.children);
            if (found) return found;
          }
        }
        return null;
      };
      return findNoteRecursive(notes);
    },
    [notes],
  );

  const getFilteredNotes = (items = notes, term = searchTerm.toLowerCase()) => {
    if (!term) return items;

    return items.reduce((filtered, item) => {
      const titleMatches = item.title.toLowerCase().includes(term);
      const contentMatches =
        item.content && item.content.toLowerCase().includes(term);
      const hasMatchingChildren =
        item.children && getFilteredNotes(item.children, term).length > 0;

      if (titleMatches || contentMatches || hasMatchingChildren) {
        const filteredItem = { ...item };
        if (item.children) {
          filteredItem.children = getFilteredNotes(item.children, term);
        }
        filtered.push(filteredItem);
      }

      return filtered;
    }, []);
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `notes-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importNotes = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedNotes = JSON.parse(e.target.result);
          if (Array.isArray(importedNotes)) {
            setNotes(importedNotes);
            resolve();
          } else {
            reject(new Error("Invalid notes format"));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        selectedNoteId,
        setSelectedNoteId,
        addNote,
        addFolder,
        updateNote,
        deleteNote,
        getNoteById,
        searchTerm,
        setSearchTerm,
        getFilteredNotes,
        exportNotes,
        importNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within NotesProvider");
  }
  return context;
}
