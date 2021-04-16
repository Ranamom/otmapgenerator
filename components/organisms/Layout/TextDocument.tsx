/** @jsx jsx */
import { jsx, useThemeUI } from "theme-ui"

enum TextDocumentType {
  DEFAULT,
  FULL_WIDTH,
}

interface TextDocumentProps {
  type: TextDocumentType
  children: React.ReactNode
}

/**
 * Component responsible for managing the max width
 * for a text to be properly read on the screen
 */
export const TextDocument = (props: TextDocumentProps) => {
  const { children, type } = props
  const { theme } = useThemeUI()

  return (
    <div
      sx={{
        flex: "1 auto",
        position: "relative",
        padding: "8rem 2.4rem",
        margin: "3.2rem 1.5rem",
        maxWidth: (type === TextDocumentType.FULL_WIDTH && "none") || "48rem",
        backgroundColor: theme.colors.primary[1],
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        overflow: "hidden",

        "&::after, &::before": {
          content: "''",
          position: "absolute",

          margin: "-16px",
          width: "32px",
          height: "32px",
          transform: "rotate(45deg)",
          backgroundColor: theme.colors.primary[0],
          opacity: 0.4,
        },

        "&::before": {
          top: 0,
          right: 0,
        },

        "&::after": {
          top: 0,
          left: 0,
        },

        "@media (min-width: 45rem)": {
          margin: 0,
          marginRight: "3.2rem",
        },
      }}
    >
      {children}
    </div>
  )
}
