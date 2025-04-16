import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Note {
  id: string; 
  title: string; 
  content: string; 
  folderId?: string; 
};

export type NoteContextType = {
  notes: Note[];
  addNote: (title: string, folderId?: string) => boolean;
  deleteNote: (note: Note) => boolean;
}

export const NoteContext = createContext<NoteContextType | null>(null);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = (title: string, folderId?: string) => {
    const note: Note = {
      title, 
      content: 'New note!',
      folderId,
      id: uuidv4()
    };
    setNotes([...notes, note]);
    return true;
  };

  const deleteNote = (note: Note) => {
    setNotes(notes.filter((n) => n.id !== note.id));
    return true;
  }

  return <NoteContext.Provider value={{ notes, addNote, deleteNote }}>{children}</NoteContext.Provider>
}

export const useNotes = () => {
  const notesContext = useContext(NoteContext);
  if (!notesContext) {
    throw new Error('Notes context is null');
  }
  return notesContext;
}