/** @jsx jsx */
import { Flex, jsx } from "theme-ui"
import { useForm } from "react-hook-form"
import { Button, Checkbox, Input, Label } from "theme-ui"
import { get } from "lodash"
import { Fragment } from "react"

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
  setSettings: React.Dispatch<React.SetStateAction<MapGeneratorSettings>>
}

export default function SettingsForm(props: ISettingsFormProps) {
  const { settings, setSettings } = props
  const { register, handleSubmit } = useForm<MapGeneratorSettings>({
    defaultValues: settings,
  })

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
        <Fragment key={key}>
          {key.length > 3 && (
            <Flex sx={{ gridColumn: "1/2" }}>
              <h3>{key} params:</h3>
            </Flex>
          )}

          <div
            key={key}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              gridColumn: "1/3",
            }}
          >
            {subKeys.map((subKey) =>
              renderFormFields(subKey, parentKeys.concat(key))
            )}
          </div>
        </Fragment>
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
    const isNumberInput = typeof inputValue === "number"

    return (
      <Label
        key={inputName}
        sx={{
          flexDirection: "column",
        }}
      >
        {key}:
        {typeof inputValue === "boolean" ? (
          <Checkbox
            {...register(inputName as any)}
            name={inputName}
            defaultChecked={inputValue}
          />
        ) : (
          <Input
            {...register(inputName as any)}
            name={inputName}
            type={isNumberInput ? "number" : "text"}
            defaultValue={isNumberInput ? Number(inputValue) : inputValue}
          />
        )}
      </Label>
    )
  }

  const fields = Object.keys(settings).map((key) => {
    return renderFormFields(key)
  })

  function handleFormSubmit(data) {
    setSettings(data)
  }

  return (
    <form
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 2,
      }}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      {fields}

      <Button mt={2} type="submit">
        Generate minimap
      </Button>
    </form>
  )
}
