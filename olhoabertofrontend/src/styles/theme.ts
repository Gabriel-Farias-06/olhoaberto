import { DefaultTheme } from "styled-components";

const fontSizes = {
  small: "0.9rem",
  medium: "1rem",
  large: "1.2rem",
};

export const lightTheme: DefaultTheme = {
  colors: {
    primary: "#FFFFFF",
    secondary: "#F0F0F0",
    text: "#292929",
  },
  fontSizes,
};

export const darkTheme = {
  colors: {
    primary: "#0D0D0D",
    secondary: "#242424",
    text: "#E0E0E0",
  },
  fontSizes,
};
