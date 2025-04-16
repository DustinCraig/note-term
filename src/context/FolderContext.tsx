import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export type Folder = {
  id: string;
  name: string;
};

export type FolderContextType = {
  folders: Folder[];
  addFolder: (folderName: string) => boolean;
  deleteFolder: (folder: Folder) => boolean;
};

export const FolderContext = createContext<FolderContextType | null>(null);

export const FolderProvider = ({ children }: { children: ReactNode}) => {
  const [folders, setFolders] = useState<Folder[]>([]);

  const addFolder = (folderName: string) => {
    if (!folderName) {
      throw new Error('Got empty folder name');
    }
    const folder: Folder = {
      id: uuidv4(),
      name: folderName
    };
    setFolders([...folders, folder]);
    return true;
  }

  const deleteFolder = (folder: Folder) => {
    setFolders(folders.filter((f) => f.id !== folder.id));
    return true;
  }

  return <FolderContext.Provider value={{ folders, addFolder, deleteFolder }}>{children}</FolderContext.Provider>
}

export const useFolders = () => {
  const folderContext = useContext(FolderContext);
  if (!folderContext) {
    throw new Error('Folder context is null');
  }
  return folderContext;
} 