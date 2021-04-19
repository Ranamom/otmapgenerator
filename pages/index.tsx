/** @jsx jsx */
import { useEffect, useRef, useState } from "react"
import { Button, Flex, jsx, Link, Text } from "theme-ui"

import GeneratorWorker from "worker-loader!../utils/generator.worker"
import { Layout } from "../components/organisms/Layout/Layout"
import SettingsForm, {
  MapGeneratorSettings,
  MOUNTAIN_TYPE,
} from "../components/molecules/SettingsForm"
import Minimap from "../components/molecules/Minimap/Minimap"
import {
  TextDocument,
  TextDocumentType,
} from "../components/organisms/Layout/TextDocument"
import { LoadingIcon } from "../components/atoms/icons/LoadingIcon"
import { DEFAULT_CONFIG } from "otmapgen/OTMapGen"

const DEFAULT_SETTINGS: MapGeneratorSettings = DEFAULT_CONFIG

export default function Home() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  // const [colorMode, setColorMode] = useColorMode()
  const [isLoading, setIsLoading] = useState(false)
  const [generatedBlob, setGeneratedBlob] = useState<Blob>()
  const workerRef = useRef<Worker>()

  /** Start Web Worker and respond to generatedBlob messages */
  useEffect(() => {
    workerRef.current = new GeneratorWorker()

    /** Set new generatedBlob whenever it is sent from Web Worker */
    workerRef.current.onmessage = (evt) => {
      setIsLoading(false)
      if (evt.data.generatedBlob) {
        setGeneratedBlob(evt.data.generatedBlob)
      }
    }

    return () => {
      workerRef.current.terminate()
    }
  }, [setGeneratedBlob])

  /** If there is generatedBlob, just create an element to download it */
  useEffect(() => {
    if (generatedBlob) {
      const CONTENT_TYPE = "application/octet-stream"
      const FILENAME = "map-" + settings.VERSION + ".otbm"

      var aElement = document.createElement("a")

      // Firefox fix
      document.body.appendChild(aElement)
      aElement.target = "_self"

      // Write encoded component and click download link
      aElement.href = window.URL.createObjectURL(
        new Blob([generatedBlob], { type: CONTENT_TYPE })
      )
      aElement.download = FILENAME
      aElement.click()

      // Clean up
      aElement.remove()
    }
  }, [generatedBlob])

  return (
    <div className="container">
      <main>
        <Layout>
          <Flex>
            <TextDocument type={TextDocumentType.DEFAULT}>
              <Text as="h1" sx={{ fontSize: 22 }}>
                Open Tibia Map Generator
              </Text>
              <Text>
                Uses{" "}
                <Link
                  href="https://www.npmjs.com/package/otmapgen"
                  target="_blank"
                >
                  OTMapGen
                </Link>{" "}
                (2D simplex noise to create releastic terrain) to preview
                minimap and generate OTBM files from settings
              </Text>
              {/* <button
                onClick={(e) => {
                  setColorMode(colorMode === "default" ? "light" : "default")
                }}
              >
                Toggle {colorMode === "default" ? "light" : "dark"}
              </button> */}
            </TextDocument>
          </Flex>

          <Flex
            sx={{
              alignItems: "flex-start",
              flexDirection: "column",
              alignSelf: "stretch",
              gap: 2,

              "@media (min-width: 45rem)": {
                flexDirection: "row",
              },
            }}
          >
            <Flex
              sx={{
                flex: "0 auto",
              }}
            >
              <SettingsForm settings={settings} setSettings={setSettings} />
            </Flex>

            <Flex
              sx={{
                flex: "1 auto",
                flexDirection: "column",
              }}
            >
              <Minimap settings={settings} />
              <Flex
                mt={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  alignSelf: "flex-start",
                }}
              >
                Generate OTBM file from settings:
                <Button
                  onClick={() => {
                    setIsLoading(true)
                    workerRef.current.postMessage({
                      settings,
                    })
                  }}
                  mt={1}
                >
                  {isLoading ? (
                    <LoadingIcon
                      sx={{
                        stroke: "primary.0",
                        marginX: 8,
                      }}
                      size={"16"}
                    />
                  ) : (
                    "Generate OTBM"
                  )}
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Layout>
      </main>
    </div>
  )
}
