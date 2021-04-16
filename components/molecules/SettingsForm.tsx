import * as React from "react"

export enum MOUNTAIN_TYPE {
  ICY = "ICY_MOUNTAIN",
  DEFAULT = "MOUNTAIN",
}

export type MapGeneratorSettings = {
  SEED: string
  WIDTH: number
  HEIGHT: number
  VERSION: string
  TERRAIN_ONLY: boolean
  GENERATION: {
    A: number
    B: number
    C: number
    CAVE_DEPTH: number
    CAVE_ROUGHNESS: number
    CAVE_CHANCE: number
    SAND_BIOME: boolean
    EUCLIDEAN: boolean
    SMOOTH_COASTLINE: boolean
    ADD_CAVES: boolean
    WATER_LEVEL: number
    EXPONENT: number
    LINEAR: number
    MOUNTAIN_TYPE: MOUNTAIN_TYPE.ICY
    FREQUENCIES: [
      { f: number; weight: number },
      { f: number; weight: number },
      { f: number; weight: number },
      { f: number; weight: number },
      { f: number; weight: number },
      { f: number; weight: number },
      { f: number; weight: number }
    ]
  }
}

export interface ISettingsFormProps {
  settings: MapGeneratorSettings
}

export default function SettingsForm(props: ISettingsFormProps) {
  const { settings } = props

  const keys = Object.keys(settings)
  return <form></form>
}
