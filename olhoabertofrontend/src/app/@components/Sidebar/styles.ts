import styled from "styled-components";

export const Sidebar = styled.div`
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.secondary};
  width: 30rem;
  height: 100%;
  padding: 1rem;
`;
