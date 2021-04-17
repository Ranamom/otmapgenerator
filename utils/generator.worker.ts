import { OTMapGenerator } from "otmapgen/OTMapGen"

const ctx: Worker = self as any

const generator = new OTMapGenerator()

/**
 * This Worker will fetch layer data from OTMapGen based on defined settings
 * So it prevents the interface to be freezed by the process.
 */
ctx.addEventListener?.("message", async (message) => {
  const { data: { settings } = {} } = message

  if (settings) {
    try {
      const generated = generator.generate(message.data.settings)
      ctx.postMessage({ generatedBlob: generated })
    } catch (error) {
      console.error(error)
    }
  }
})
