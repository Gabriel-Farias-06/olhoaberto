import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.secondary};
  align-items: center;
  justify-content: center;
  width: 30rem;
  height: 100%;
  padding: 2rem;
`;
