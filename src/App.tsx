import styled from "styled-components";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { GlobalStyles } from "./Styles";
import { FolderProvider } from "./context/FolderContext";
import { NoteProvider } from "./context/NoteContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

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

function NoteApp() {
  return (
    <FolderProvider>
      <NoteProvider>
        <AppContainer>
          <Sidebar />
          <Editor />
        </AppContainer>
      </NoteProvider>
    </FolderProvider>
  );
}
