import { Theme } from "theme-ui"

const defaultColorPalette = {
  /** From index 0 to 4, it means from darker to lighter */
  /** Primary is darker tone, secondary is lighter tone to create contrast */
  primary: ["#6d401fff", "#7c4e31ff", "#805534ff", "#935f38ff", "#a3734fff"],
  secondary: ["#e2d9d3ff", "#d7cac2ff", "#ceb7a9ff", "#bc9882ff", "#ae8164ff"],
}

const theme: Theme = {
  colors: {
    ...defaultColorPalette,
    /** Generate light mode from default color palette, by swaping the variables */
    modes: {
      light: {
        primary: defaultColorPalette.secondary,
        secondary: defaultColorPalette.primary,
      },
    },
  },
  fonts: {
    body:
      'Rubik, system-ui,  Roboto, "Segoe UI", -apple-system, BlinkMacSystemFont, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", cursive, sans-serif',
  },
  space: Array.from({ length: 24 })
    .fill(0)
    .map((_, index) => index * 4),
  text: {
    heading: {
      color: "secondary.2",
      marginBottom: 18,
      textAlign: "center",
    },
    error: {
      color: "#b71c1c",
    },
    xsmall: {
      fontSize: 13,
    },
  },
  sizes: {
    container: "1180px",
  },
  buttons: {
    primary: {
      display: "flex",
      alignItems: "center",
      color: "primary.0",
      bg: "secondary.2",
      "&:hover": {
        bg: "secondary.1",
      },
      cursor: "pointer",
    },
    secondary: {
      color: "primary.1",
      bg: "secondary.2",
    },
  },
  forms: {
    select: {
      backgroundColor: "primary.1",
    },
    input: {
      backgroundColor: "primary.1",

      /** override browser agent input autofill */
      "&:-webkit-autofill": {
        boxShadow: (theme) => `0 0 0 50px ${theme.colors.primary[1]} inset`,
        border: (theme) => `1px solid ${theme.colors.secondary[3]} !important`,
        color: (theme) => `${theme.colors.secondary[3]} !important`,
      },
    },
    checkbox: {
      backgroundColor: "primary.1",
      fill: "secondary.3",
    },
  },
  styles: {
    root: {
      fontSize: "1.5rem",
      textRendering: "optimizeLegibility",
      fontFamily: "body",
      lineHeight: 1.45,
      color: "secondary.0",
      minHeight: "100%",
      background: (theme) =>
        `linear-gradient(to left bottom, ${Object.keys(theme.colors)
          .filter((key) => key.indexOf("primary") !== -1)
          .map((key) => theme.colors[key])})`,
    },
    h1: {
      variant: "text.heading",
      fontSize: 1,
      fontWeight: "normal",
    },
    h2: {
      variant: "text.heading",
      fontSize: 1,
    },
    p: {
      margin: 0,
    },
    img: {
      maxWidth: "100%",
      height: "auto",
    },
    a: {
      color: "secondary.3",
      cursor: "pointer",
      "&:hover": {
        color: "secondary.4",
      },
      "&:any-link": {
        color: "secondary.3",
        textDecoration: "none",
      },
    },
  },
}

export default theme
