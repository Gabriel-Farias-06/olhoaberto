
import styled from "styled-components";

export const AppContainer = styled.div`

background-color: var(--bg-color);
color: var(--text-color);
display: flex;
height: 100vh;

.fa-regular, .fa-solid {
    color: var(--text-color);
    cursor: pointer;
}

.fa-regular:hover, .fa-solid:hover {
    transition: 0.1s;
    color: var(--text-hover-color);
}

`



