/** @jsx jsx */
import { jsx, useThemeUI } from "theme-ui"

import * as React from "react"
import { Container } from "theme-ui"
import NProgress from "nprogress"
import Router from "next/router"

export interface IAppProps {
  children: React.ReactNode
  type?: "full"
}

export function Layout(props: IAppProps) {
  const themeContext = useThemeUI()
  const { theme } = themeContext
  const { children, type } = props

  /** add progress bar on component mount */
  React.useEffect(() => {
    NProgress.configure({
      template: `
      <div class="bar"
      style="background: ${theme.colors.secondary[3]}" role="bar">
        <div class="peg" style="box-shadow: 0 0 10px ${theme.colors.secondary[3]}, 0 0 5px ${theme.colors.secondary[3]}">
        </div>
      </div>
      <div class="spinner" role="spinner">
        <div class="spinner-icon"></div>
      </div>`,
    })

    Router.events.on("routeChangeStart", () => NProgress.start())
    Router.events.on("routeChangeComplete", () => NProgress.done())
    Router.events.on("routeChangeError", () => NProgress.done())
  }, [NProgress, Router])

  return (
    <Container>
      <div
        sx={{
          "@media(min-width: 45rem)": {
            padding: "8rem 0",
          },
        }}
      >
        <div
          sx={{
            display: "flex",
            marginTop: "3.2rem",
            flexDirection: "column",
            "@media (min-width: 45rem)": {
              alignItems: "flex-start",
            },
          }}
        >
          {children}
        </div>
      </div>
    </Container>
  )
}
