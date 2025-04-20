import { useState, useRef, ChangeEvent } from "react";
import {
  EDITOR_HEADER_BORDER_COLOR,
  TEXT_COLOR,
  DIVIDER_COLOR,
  SELECTION_COLOR,
  BUTTON_HOVER_BACKGROUND_COLOR,
} from "../Styles";
import { useNotes, Note } from "../context/NoteContext";
import { debounce } from "../utils";
import styled from "styled-components";
import Button from "./Button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const EditorHeader = styled.div`
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${EDITOR_HEADER_BORDER_COLOR};
  display: flex;
  justify-content: space-between;
`;

const EditorTitle = styled.input`
  background: none;
  border: none;
  color: ${TEXT_COLOR};
  width: 100%;
  outline: none;
  &:focus {
    border-bottom: 1px solid ${DIVIDER_COLOR};
  }
`;

const EditorActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Editor = styled.textarea`
  flex: 1;
  width: 100%;
  height: 100%;
  background: #000;
  color: ${TEXT_COLOR};
  font-family: 'Courier New', monospace;
  line-height: 1.5;
  border: none;
  padding: 1rem;
  resize: none;e
  outline: none;

  letter-spacing: 0.05em;
  white-space: pre-wrap;
  word-break: break-word;
  &::selection {
    background-color: ${SELECTION_COLOR};
  }
`;

const PreviewContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: #000;
  color: ${TEXT_COLOR}

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  p { 
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  code {
    background-color: ${BUTTON_HOVER_BACKGROUND_COLOR}
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
  }
`;

type EditorPreviewProps = {
  isExampleContainer: boolean;
  selectedNode?: Note;
};

export const EditorPreview = ({
  isExampleContainer,
  selectedNode,
}: EditorPreviewProps) => {
  if (isExampleContainer) {
    return (
      <PreviewContainer>
        <h2>Welcome to note-term!</h2>
        <br />
        <p>Create a note from the sidebar to get started!</p>
      </PreviewContainer>
    );
  }
  return (
    <PreviewContainer>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {selectedNode?.content}
      </ReactMarkdown>
    </PreviewContainer>
  );
};

export default () => {
  const [isPreview, setIsPreview] = useState(false);
  const { selectedNote, setSelectedNote } = useNotes();
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  const debouncedNoteUpdate = debounce((newNote: Note) => {
    setSelectedNote(newNote);
  }, 100);

  const onTogglePreview = () => {
    setIsPreview(!isPreview);
  };

  // Todo: make saving automatic
  const onSave = () => {
    if (!editorRef.current || !selectedNote) {
      return;
    }
    const newContent = editorRef.current.value;
    const updatedNote: Note = { ...selectedNote, content: newContent };
    setSelectedNote(updatedNote);
  };

  const onDelete = () => {};

  const onTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = { ...selectedNote } as Note;
    newNote.content = e.target.value;
    debouncedNoteUpdate(newNote);
  };

  return (
    <EditorContainer>
      {selectedNote ? (
        <>
          <EditorHeader>
            <EditorTitle
              defaultValue={
                selectedNote ? selectedNote.title : "Welcome to Note-Term"
              }
            />
            <EditorActionsContainer>
              <Button onClick={onTogglePreview}>
                {isPreview ? "Edit" : "Preview"}
              </Button>
              <Button onClick={onSave}>Save</Button>
              <Button onClick={onDelete}>Delete</Button>
            </EditorActionsContainer>
          </EditorHeader>

          {isPreview ? (
            <EditorPreview
              isExampleContainer={false}
              selectedNode={selectedNote}
            />
          ) : (
            <Editor
              ref={editorRef}
              defaultValue={selectedNote?.content}
              placeholder="Start typing..."
              onChange={onTextChange}
            />
          )}
        </>
      ) : (
        <EditorPreview isExampleContainer={true} />
      )}
    </EditorContainer>
  );
};
