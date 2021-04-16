/** @jsx jsx */
import { useState } from "react"
import { jsx, Text, useColorMode } from "theme-ui"

import { Layout } from "../components/organisms/Layout/Layout"
import SettingsForm, {
  MapGeneratorSettings,
  MOUNTAIN_TYPE,
} from "../components/molecules/SettingsForm"
import Minimap from "../components/molecules/Minimap/Minimap"

const DEFAULT_SETTINGS: MapGeneratorSettings = {
  SEED: "",
  WIDTH: 256,
  HEIGHT: 256,
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
  const [colorMode, setColorMode] = useColorMode()

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
        </Layout>
        <Minimap settings={settings} />
      </main>
    </div>
  )
}
