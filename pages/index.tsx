/** @jsx jsx */
import { useEffect, useRef, useState } from "react"
import { jsx, Text, useColorMode } from "theme-ui"
import { OTMapGenerator } from "otmapgen/OTMapGen"

import { Layout } from "../components/organisms/Layout/Layout"
import SettingsForm, {
  SettingsType,
  MOUNTAIN_TYPE,
} from "../components/molecules/SettingsForm"

const DEFAULT_SETTINGS: SettingsType = {
  SEED: "",
  WIDTH: 128,
  HEIGHT: 128,
  VERSION: "10.98",
  TERRAIN_ONLY: false,
  GENERATION: {
    A: 1,
    B: 0.92,
    C: 0.25,
    CAVE_DEPTH: 20,
    CAVE_ROUGHNESS: 0.45,
    CAVE_CHANCE: 0.009,
    SAND_BIOME: true,
    EUCLIDEAN: false,
    SMOOTH_COASTLINE: true,
    ADD_CAVES: true,
    WATER_LEVEL: 2,
    EXPONENT: 1.4,
    LINEAR: 6,
    MOUNTAIN_TYPE: MOUNTAIN_TYPE.ICY,
    FREQUENCIES: [
      { f: 1, weight: 0.3 },
      { f: 2, weight: 0.2 },
      { f: 4, weight: 0.2 },
      { f: 8, weight: 0.125 },
      { f: 16, weight: 0.1 },
      { f: 32, weight: 0.05 },
      { f: 64, weight: 0.0025 },
    ],
  },
}

const _transparent = false

export default function Home() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [layerData, setLayerData] = useState(null)
  const [activeLayer, setActiveLayer] = useState(0)
  const [colorMode, setColorMode] = useColorMode()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generator = new OTMapGenerator()

  console.log(generator)
  // const layerData = OTMapGen

  useEffect(() => {
    setTimeout(() => {
      const layerData = generator.generateMinimap(settings)
      setLayerData(layerData)
    }, 10)
  }, [settings])

  /*
   * Writes the currently active layer to the canvas
   */

  useEffect(() => {
    if (canvasRef.current && layerData) {
      setActiveLayer((previous) => Math.min(Math.max(previous, 0), 7))

      const context = canvasRef?.current?.getContext("2d")

      // Resize the canvas to fit the map
      canvasRef.current.width = Math.max(512, layerData.metadata.WIDTH)
      canvasRef.current.height = Math.max(512, layerData.metadata.HEIGHT)

      // Fill canvas with black background
      context.fillStyle = "black"
      context.fillRect(
        0,
        0,
        canvasRef?.current?.width,
        canvasRef?.current?.height
      )

      const pixelData = getPixelData()

      // Convert UInt8ClampedArray to canvas image data
      const imgData = new ImageData(
        pixelData,
        layerData.metadata.WIDTH,
        layerData.metadata.HEIGHT
      )

      // Put the RGBA image data
      context.putImageData(imgData, 0, 0)

      // PNG Watermark
      context.fillStyle = "white"
      context.font = "bold 14px sans-serif"
      context.fillText("Minimap Preview Floor: " + activeLayer, 6, 18)
      context.fillText(
        "Seed: " + layerData.metadata.SEED.toString(16).toUpperCase(),
        6,
        36
      )
    }
  }, [layerData, canvasRef])

  function getPixelData() {
    /* function getPixelData
     * Compiles all layers to a single image with transparency
     */

    const TRANSPARENCY_VALUE = 0x40

    if (!_transparent) {
      return layerData.data[activeLayer].slice(0)
    }

    const pixelData = layerData.data[0].slice(0)

    for (let i = 1; i <= activeLayer; i++) {
      for (let j = 0; j < layerData.data[i].length; j += 4) {
        // Check if value is black and set transparency
        if (
          layerData.data[i][j] === 0 &&
          layerData.data[i][j + 1] === 0 &&
          layerData.data[i][j + 2] === 0
        ) {
          pixelData[j + 3] = TRANSPARENCY_VALUE
          continue
        }

        // Copy layer pixel data
        pixelData[j] = layerData.data[i][j]
        pixelData[j + 1] = layerData.data[i][j + 1]
        pixelData[j + 2] = layerData.data[i][j + 2]
      }
    }

    return pixelData
  }

  return (
    <div className="container">
      <main>
        <Layout>
          <Text as="h1" sx={{ fontSize: 22 }}>
            Open Tibia Map Generator
          </Text>
          <Text>abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcd</Text>
          <button
            onClick={(e) => {
              setColorMode(colorMode === "default" ? "light" : "default")
            }}
          >
            Toggle {colorMode === "default" ? "light" : "dark"}
          </button>

          <SettingsForm settings={settings} />
          <canvas ref={canvasRef} />
        </Layout>
      </main>
    </div>
  )
}
