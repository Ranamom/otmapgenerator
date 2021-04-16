import { OTMapGenerator } from "otmapgen/OTMapGen"

import { MapGeneratorSettings } from "../SettingsForm"

const ctx: Worker = self as any

const generator = new OTMapGenerator()

async function fetchLayerData(settings: MapGeneratorSettings) {
  const layerData = await new Promise((resolve, reject) => {
    const data = generator.generateMinimap(settings)

    if (!data) reject()

    resolve(data)
  })

  return layerData
}

ctx.addEventListener?.("message", async (message) => {
  const { data: { settings } = {} } = message
  if (settings) {
    try {
      const layerData = await fetchLayerData(message.data.settings)
      ctx.postMessage({ layerData })
    } catch (error) {
      console.error(error)
    }
  }
})
