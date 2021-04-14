import { Theme } from "theme-ui"

declare module "theme-ui" {
  interface CustomTheme extends Omit<Theme, "colors"> {
    colors: object
  }

  export interface ThemeUIContext {
    theme: CustomTheme
    colorMode: string
    setColorMode: React.Dispatch<React.SetStateAction<string>>
  }

  export function useThemeUI(): ThemeUIContext
}
