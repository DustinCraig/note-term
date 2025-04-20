import styled from "styled-components";
import { TREE_ITEM_HOVER } from "../Styles";
import { useNotes, Note } from "../context/NoteContext";
import { useFolders, Folder } from "../context/FolderContext";

const TreeView = styled.div`
  flex: 1;
`;

const TreeItem = styled.div`
  padding: 0.3rem 0;
  cursor: pointer;

  &:hover {
    color: ${TREE_ITEM_HOVER};
  }
`;

const FolderItem = styled(TreeItem)`
  font-weight: bold;
`;

const NoteItem = styled(TreeItem)<{ $paddingLeft?: number }>`
  padding-left: ${({ $paddingLeft = 0 }) => $paddingLeft}rem;
`;

export default () => {
  const { notes, addNote, setSelectedNote } = useNotes();
  const { folders } = useFolders();

  const onNoteClick = (note: Note) => {
    setSelectedNote(note);
  };

  const onNoteCreate = (folderId: string) => {
    const noteName = prompt("Enter note name:");
    if (!noteName) {
      return prompt("Must enter note name");
    }
    addNote(noteName, folderId);
  };

  return (
    <TreeView>
      {/* Root Nodes */}
      {notes
        .filter((note) => !note.folderId)
        .map((note) => (
          <NoteItem key={note.id} onClick={() => onNoteClick(note)}>
            {note.title}
          </NoteItem>
        ))}

      {/* Folders and child nodes */}
      {folders.map((folder) => (
        <div key={folder.id}>
          <FolderItem>{folder.name}</FolderItem>
          {notes
            .filter((note) => note.folderId === folder.id)
            .map((note) => (
              <NoteItem
                key={note.id}
                onClick={() => onNoteClick(note)}
                $paddingLeft={0.5}
              >
                {note.title}
              </NoteItem>
            ))}
          <NoteItem onClick={() => onNoteCreate(folder.id)} $paddingLeft={0.5}>
            + Note
          </NoteItem>
        </div>
      ))}
    </TreeView>
  );
};
