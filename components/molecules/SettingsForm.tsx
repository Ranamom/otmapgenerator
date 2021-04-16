import * as React from "react"
import { useForm } from "react-hook-form"
import { Input, Label } from "theme-ui"
import { get } from "lodash"

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
  const { register } = useForm<MapGeneratorSettings>()

  function renderFormFields(key, parentKeys = []) {
    const isObject =
      typeof (parentKeys.length
        ? get(settings, parentKeys.concat(key))
        : settings[key]) === "object"

    /** If it's an object, render all subkeys */
    if (isObject) {
      const subKeys = Object.keys(
        parentKeys.length
          ? get(settings, parentKeys.concat(key))
          : settings[key]
      )

      return (
        <Label
          key={key}
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
          }}
        >
          {subKeys.map((subKey) =>
            renderFormFields(subKey, parentKeys.concat(key))
          )}
        </Label>
      )
    }

    /**
     * Otherwise, if not an object, just render it using the parentKeys to access object name and value
     */

    let inputName = ""
    /** Concatenate parent keys to generate input name */
    parentKeys.map((parentKey) => {
      inputName += `${parentKey}.`
    })
    inputName += key

    const inputValue = get(settings, parentKeys.concat(key))

    return (
      <Label
        key={inputName}
        sx={{
          flexDirection: "column",
        }}
        htmlFor={inputName}
      >
        {key}
        <Input
          {...register(inputName as any)}
          name={inputName}
          value={inputValue}
        />
      </Label>
    )
  }

  const fields = Object.keys(settings).map((key) => {
    return renderFormFields(key)
  })

  return <form>{fields}</form>
}
