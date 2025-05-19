// styles/styled.d.ts
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      secondary: string;
      text: string;
      primary: string;
    };
    fontSizes?: {
      small?: string;
      medium?: string;
      large?: string;
    };
  }
}
