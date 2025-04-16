import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { GlobalStyles } from './Styles';
import { FolderProvider } from './context/FolderContext';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css'; // Import CSS for enhanced cursor animations


// Styled components
const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #000;
  border-right: 1px solid #333;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #333;
`;

const SidebarTitle = styled.h1`
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const SidebarButton = styled.button`
  background: none;
  border: 1px solid #444;
  color: #fff;
  padding: 0.3rem 0.6rem;
  margin-right: 0.5rem;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  
  &:hover {
    background-color: #222;
  }
`;

const TreeView = styled.div`
  flex: 1;
`;

const TreeItem = styled.div`
  padding: 0.3rem 0;
  cursor: pointer;
  
  &:hover {
    color: #ccc;
  }
`;

const FolderItem = styled(TreeItem)`
  color: #aaa;
  font-weight: bold;
`;

const NoteItem = styled(TreeItem)`
  padding-left: 1rem;
`;

const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const EditorHeader = styled.div`
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
`;

const EditorTitle = styled.input`
  background: none;
  border: none;
  color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  width: 100%;
  outline: none;
  
  &:focus {
    border-bottom: 1px solid #555;
  }
`;

// Custom Editor with smooth cursor
const CustomEditor = ({ value, onChange, placeholder }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}) => {
  // Use a standard textarea but enhance it with CSS
  return (
    <SmoothCursorTextArea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      spellCheck={false}
      autoFocus
    />
  );
};

// Styled components for the editor with a smooth cursor
const SmoothCursorTextArea = styled.textarea`
  flex: 1;
  width: 100%;
  height: 100%;
  background: #000;
  color: #fff;
  font-family: 'Courier Prime', 'Courier New', monospace;
  font-size: 1rem;
  line-height: 1.5;
  border: none;
  padding: 1rem;
  resize: none;
  outline: none;
  
  /* Terminal-like cursor style */
  caret-color: #fff;
  caret-shape: block;
  
  /* Styling for a more terminal-like experience */
  letter-spacing: 0.05em;
  white-space: pre-wrap;
  word-break: break-word;
  
  /* Create smooth cursor effect with CSS */
  /* Enhanced selection and cursor appearance */
  &::selection {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  /* Smooth cursor animation effect */
  @keyframes cursor-blink {
    0%, 49% {
      opacity: 1;
    }
    50%, 100% {
      opacity: 0;
    }
  }
  
  /* Block cursor style with smooth movement */
  @supports (caret-color: transparent) and (caret-shape: block) {
    caret-color: #fff;
    caret-shape: block;
    animation: cursor-blink 1s step-end infinite;
  }
  
  /* This creates a smooth cursor movement effect when typing */
  transition: background-position 0.05s ease;
  background-position: 0 0;
  
  /* Smooth typing feel */
  &:focus {
    background-position: 0 0;
  }
`;

const PreviewContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: #000;
  color: #fff;
  font-family: 'Courier New', monospace;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  code {
    background-color: #222;
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
  }
  
  pre {
    background-color: #111;
    padding: 1rem;
    overflow-x: auto;
    margin-bottom: 1rem;
  }
  
  blockquote {
    border-left: 3px solid #333;
    padding-left: 1rem;
    margin-left: 0;
    color: #aaa;
  }
  
  ul, ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
`;

// Create a simple blinking cursor for the TypeWriterText component
const TypeWriterCursor = styled.span`
  display: inline-block;
  width: 0.6em;
  height: 1.2em;
  background-color: #fff;
  vertical-align: middle;
  margin-left: 2px;
  animation: cursor-blink 1s step-end infinite;
`;

// Terminal TypeWriter Effect Component
const TypeWriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const index = useRef(0);

  useEffect(() => {
    if (index.current < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text.charAt(index.current));
        index.current += 1;
      }, 50); // Adjust speed as needed

      return () => clearTimeout(timer);
    }
  }, [displayText, text]);

  return (
    <>
      {displayText}
      {index.current < text.length && <TypeWriterCursor />}
    </>
  );
};

// Types
interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
}

interface Folder {
  id: string;
  name: string;
}

// Main App Component
export function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<NoteApp />} />
          <Route path="/note/:noteId" element={<NoteApp />} />
        </Routes>
      </Router>
    </>
  );
}

// Note App Component
function NoteApp() {
  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('note-term-folders');
    return saved ? JSON.parse(saved) : [];
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('note-term-notes');
    if (saved) {
      return JSON.parse(saved);
    } else {
      // Create a welcome note for first-time users
      return [{
        id: 'welcome-note',
        title: 'Welcome to Note-Term',
        content: `# Welcome to Note-Term!

This is a terminal-inspired note-taking app. Here are some things you can do:

## Features

* Create and organize notes in folders
* Write using Markdown syntax
* Preview rendered Markdown
* Use keyboard shortcuts for faster workflow

## Markdown Examples

### Formatting

**Bold text** and *italic text*

### Lists

- Item 1
- Item 2
  - Nested item

### Code

\`\`\`javascript
// This is a code block
function hello() {
  console.log("Hello, terminal!");
}
\`\`\`

### Tables

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

## Keyboard Shortcuts

* **Ctrl+M**: Toggle preview mode
* **Ctrl+S**: Create new note
* **Ctrl+D**: Delete current note

Enjoy using Note-Term!`,
        folderId: null
      }];
    }
  });

  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  const navigate = useNavigate();
  const { noteId } = useParams<{ noteId: string }>();

  // Add keyboard event listener for shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+M: Toggle preview mode
      if (e.ctrlKey && e.key === 'm' && activeNote) {
        e.preventDefault();
        setIsPreview(!isPreview);
      }

      // Ctrl+S: Create new note
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        createNote();
      }

      // Ctrl+D: Delete current note
      if (e.ctrlKey && e.key === 'd' && activeNote) {
        e.preventDefault();
        deleteNote();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNote, isPreview]);

  // Load active note when URL changes
  useEffect(() => {
    if (noteId) {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setActiveNote(note);
      }
    }
  }, [noteId, notes]);

  // Set welcome note as active on first load if no note is selected
  useEffect(() => {
    if (!noteId && notes.length > 0 && !activeNote) {
      setActiveNote(notes[0]);
      navigate(`/note/${notes[0].id}`);
    }
  }, []);

  // Save to localStorage whenever notes or folders change
  useEffect(() => {
    localStorage.setItem('note-term-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('note-term-folders', JSON.stringify(folders));
  }, [folders]);

  // Create a new folder
  const createFolder = () => {
    const name = prompt('Enter folder name:');
    if (name) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name
      };
      setFolders([...folders, newFolder]);
    }
  };

  // Create a new note
  const createNote = (folderId: string | null = null) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      folderId
    };

    setNotes([...notes, newNote]);
    setActiveNote(newNote);
    navigate(`/note/${newNote.id}`);
  };

  // Update note content
  const updateNoteContent = (content: string) => {
    if (activeNote) {
      const updatedNote = { ...activeNote, content };
      setActiveNote(updatedNote);

      setNotes(notes.map(note =>
        note.id === activeNote.id ? updatedNote : note
      ));
    }
  };

  // Update note title
  const updateNoteTitle = (title: string) => {
    if (activeNote) {
      const updatedNote = { ...activeNote, title };
      setActiveNote(updatedNote);

      setNotes(notes.map(note =>
        note.id === activeNote.id ? updatedNote : note
      ));
    }
  };

  // Delete a note
  const deleteNote = () => {
    if (activeNote && confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== activeNote.id));
      setActiveNote(null);
      navigate('/');
    }
  };

  return (
    <FolderProvider>
      <AppContainer>
        <Sidebar>
          <SidebarHeader>
            <SidebarTitle>note-term</SidebarTitle>
            <div>
              <SidebarButton onClick={createFolder}>+ Folder</SidebarButton>
              <SidebarButton onClick={() => createNote()}>+ Note</SidebarButton>
            </div>
          </SidebarHeader>

          <TreeView>
            {/* Root notes */}
            {notes.filter(note => !note.folderId).map(note => (
              <NoteItem
                key={note.id}
                onClick={() => {
                  setActiveNote(note);
                  navigate(`/note/${note.id}`);
                }}
              >
                {note.title}
              </NoteItem>
            ))}

            {/* Folders and their notes */}
            {folders.map(folder => (
              <div key={folder.id}>
                <FolderItem>{folder.name}</FolderItem>
                {notes
                  .filter(note => note.folderId === folder.id)
                  .map(note => (
                    <NoteItem
                      key={note.id}
                      onClick={() => {
                        setActiveNote(note);
                        navigate(`/note/${note.id}`);
                      }}
                    >
                      {note.title}
                    </NoteItem>
                  ))
                }
                <NoteItem
                  onClick={() => createNote(folder.id)}
                  style={{ color: '#555' }}
                >
                  + New Note
                </NoteItem>
              </div>
            ))}
          </TreeView>
        </Sidebar>

        <EditorContainer>
          {activeNote ? (
            <>
              <EditorHeader>
                <EditorTitle
                  value={activeNote.title}
                  onChange={(e) => updateNoteTitle(e.target.value)}
                  placeholder="Untitled Note"
                />
                <div>
                  <SidebarButton onClick={() => setIsPreview(!isPreview)}>
                    {isPreview ? 'Edit' : 'Preview'}
                  </SidebarButton>
                  <SidebarButton onClick={deleteNote}>Delete</SidebarButton>
                </div>
              </EditorHeader>

              {isPreview ? (
                <PreviewContainer>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {activeNote.content}
                  </ReactMarkdown>
                </PreviewContainer>
              ) : (
                <CustomEditor
                  value={activeNote.content}
                  onChange={(e) => updateNoteContent(e.target.value)}
                  placeholder="Start typing..."
                />
              )}
            </>
          ) : (
            <PreviewContainer>
              <h2><TypeWriterText text="Welcome to Note-Term" /></h2>
              <p>Select a note from the sidebar or create a new one to get started.</p>
              <p>Keyboard shortcuts:</p>
              <ul>
                <li>Ctrl+M: Toggle preview mode</li>
                <li>Ctrl+S: Create new note</li>
                <li>Ctrl+D: Delete current note</li>
              </ul>
            </PreviewContainer>
          )}
        </EditorContainer>
      </AppContainer>
    </FolderProvider>
  );
}
