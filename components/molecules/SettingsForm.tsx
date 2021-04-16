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

function getDeepKeys(obj) {
  var keys = []
  for (var key in obj) {
    keys.push(key)
    if (typeof obj[key] === "object") {
      var subkeys = getDeepKeys(obj[key])
      keys = keys.concat(
        subkeys.map(function (subkey) {
          return key + "." + subkey
        })
      )
    }
  }
  return keys
}

export default function SettingsForm(props: ISettingsFormProps) {
  const { settings } = props
  const { register } = useForm<MapGeneratorSettings>()

  const settingsKeys: Array<keyof MapGeneratorSettings> = getDeepKeys(
    settings
  ) as any

  function renderFormFields(keys, parentKeys = []) {
    const fields = keys.map((key) => {
      const isObject =
        typeof (parentKeys.length
          ? get(settings, parentKeys.concat(key))
          : settings[key]) === "object"

      /** If it's an object, render all subkeys */
      if (isObject) {
        const subKeys = getDeepKeys(
          parentKeys.length ? get(settings, parentKeys) : settings[key]
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
            {renderFormFields(subKeys, parentKeys.concat(key))}
          </Label>
        )
      }

      const value = get(settings, parentKeys.concat(key))
      /**
       * If not an object, it should not render if it's a sub-key
       * Otherwise, if root key, just render it.
       */
      return value ? (
        <Label
          key={key}
          sx={{
            flexDirection: "column",
          }}
          htmlFor={key}
        >
          {key}
          <Input {...register(key)} name={key} value={value} />
        </Label>
      ) : null
    })

    return fields
  }

  return <form>{renderFormFields(settingsKeys)}</form>
}
