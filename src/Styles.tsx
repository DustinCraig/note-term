import styled, { createGlobalStyle } from "styled-components";

export const TEXT_COLOR = '#fff';
export const DIVIDER_COLOR = '#333';
export const BACKGROUND_COLOR = '#000';
export const BUTTON_BORDER_COLOR = '#444'
export const BUTTON_HOVER_BACKGROUND_COLOR = '#222';

export const GlobalStyles = createGlobalStyle`
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body,html {
    font-family: 'Courier New', monospace;
    background-color: ${BACKGROUND_COLOR};
    color: ${TEXT_COLOR};
    height: 100%;
    overflow: hidden;
}

#app {
    height: 100vh;
    width: 100vw;
}
`;
