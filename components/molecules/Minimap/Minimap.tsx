/** @jsx jsx */
import { Flex, jsx } from "theme-ui"

import { useRef, useState, useEffect } from "react"
import dynamic from "next/dynamic"

import { MapGeneratorSettings } from "../SettingsForm"
import { LoadingIcon } from "../../atoms/icons/LoadingIcon"
import { getIsMobileUserAgent } from "../../../utils/utils"

export interface IMinimapProps {
  settings: MapGeneratorSettings
}

function Minimap(props: IMinimapProps) {
  const { settings } = props

  const [layerData, setLayerData] = useState(null)
  const [activeLayer, setActiveLayer] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const workerRef = useRef<Worker>()

  /** Start Web Worker and respond to layerData messages */
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../../../generator-web-worker.ts", import.meta.url)
    )

    console.log("started worker")
    console.log(workerRef.current)
    /** Set new layerData whenever it is sent from Web Worker */
    workerRef.current.onmessage = (evt) => {
      setIsLoading(false)
      if (evt.data.layerData) {
        setLayerData(evt.data.layerData)
      }
    }

    return () => {
      workerRef.current.terminate()
    }
  }, [setLayerData])

  /** Post new seetings to Web Worker whenever the state changes */
  useEffect(() => {
    console.log("posting message to: ")
    console.log(workerRef.current)
    setIsLoading(true)
  }, [settings])

  /*
   * Writes the currently active layer to the canvas
   */
  useEffect(() => {
    if (canvasRef.current && layerData) {
      setActiveLayer((previous) => Math.min(Math.max(previous, 0), 7))

      const context = canvasRef?.current?.getContext("2d")

      const isMobile = getIsMobileUserAgent()
      // Resize the canvas to fit the map
      canvasRef.current.width = Math.max(
        isMobile ? 345 : 512,
        layerData.metadata.WIDTH
      )
      canvasRef.current.height = Math.max(
        isMobile ? 345 : 512,
        layerData.metadata.HEIGHT
      )

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
      context.font = "bold 12px sans-serif"
      context.fillText(
        "Map size: " +
          layerData.metadata.WIDTH +
          "x" +
          layerData.metadata.HEIGHT,
        8,
        16
      )
      context.fillText("Minimap preview floor: " + activeLayer, 8, 32)
      context.fillText(
        "Seed: " + layerData.metadata.SEED.toString(16).toUpperCase(),
        8,
        48
      )
    }
  }, [layerData, canvasRef])

  function getPixelData() {
    /* function getPixelData
     * Compiles all layers to a single image with transparency
     */

    return layerData.data[activeLayer].slice(0)

    /** Transparency code */
    // const TRANSPARENCY_VALUE = 0x40

    // const pixelData = layerData.data[0].slice(0)

    // for (let i = 1; i <= activeLayer; i++) {
    //   for (let j = 0; j < layerData.data[i].length; j += 4) {
    //     // Check if value is black and set transparency
    //     if (
    //       layerData.data[i][j] === 0 &&
    //       layerData.data[i][j + 1] === 0 &&
    //       layerData.data[i][j + 2] === 0
    //     ) {
    //       pixelData[j + 3] = TRANSPARENCY_VALUE
    //       continue
    //     }

    //     // Copy layer pixel data
    //     pixelData[j] = layerData.data[i][j]
    //     pixelData[j + 1] = layerData.data[i][j + 1]
    //     pixelData[j + 2] = layerData.data[i][j + 2]
    //   }
    // }

    // return pixelData
  }

  return (
    <Flex
      sx={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",
      }}
    >
      {isLoading ? (
        <LoadingIcon />
      ) : (
        <canvas
          sx={{
            width: "100%",
          }}
          ref={canvasRef}
        />
      )}
    </Flex>
  )
}

export default dynamic(() => Promise.resolve(Minimap), {
  ssr: false,
})
