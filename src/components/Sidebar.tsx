import { DIVIDER_COLOR, BACKGROUND_COLOR, TEXT_COLOR } from '../Styles';
import { useFolders } from '../context/FolderContext';
import { useNotes } from '../context/NoteContext';
import Button from './Button';
import styled from 'styled-components';

const Sidebar = styled.div`
  width: 15%;
  background-color: ${BACKGROUND_COLOR};
  border-right: 1px solid ${DIVIDER_COLOR};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottomr: 1px solid ${DIVIDER_COLOR};
`;

const SidebarTitle = styled.h1`
  font-size: 1.2rem;
  color: ${TEXT_COLOR};
  margin-bottom: 0.5rem;
`;


export default () => {
  const { addFolder } = useFolders();
  const { addNote } = useNotes();

  const onCreateFolderClick = () => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) { 
      return prompt('Must enter a folder name');
    }
    // Todo duplicate checking 
    addFolder(folderName);
  }

  const onCreateNoteClick = () => {
    const noteName = prompt('Enter note name:');
    if (!noteName) {
      return prompt('Must enter a note name');
    }
    addNote(noteName)
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarTitle>note-term</SidebarTitle>
        <div>
          <Button onClick={onCreateFolderClick}>+ Folder</Button>
          <Button onClick={onCreateNoteClick}>+ Note</Button>
        </div>
      </SidebarHeader>
    </Sidebar>
  )
}