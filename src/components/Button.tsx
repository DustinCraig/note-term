import styled from 'styled-components';
import { TEXT_COLOR, BUTTON_BORDER_COLOR, BUTTON_HOVER_BACKGROUND_COLOR } from '../Styles';

export default styled.button`
    background: none;
    border: 1px solid ${BUTTON_BORDER_COLOR};
    color: ${TEXT_COLOR};
    padding: 0.3rem 0.6rem;
    margin-right: 0.5rem;
    cursor: pointer;

    &:hover {
        background-color: ${BUTTON_HOVER_BACKGROUND_COLOR}
    }
`;
