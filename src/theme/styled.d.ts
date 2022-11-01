import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components'

export type Color = string
export interface Colors {
  // base
  white: Color
  black: Color

  // text
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color

  // backgrounds / greys
  bg0: Color
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color
  bg6: Color
  bg7: Color

  modalBG: Color
  advancedBG: Color
  inputBorder: Color

  //blues
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color

  primaryText1: Color

  // pinks
  secondary1: Color
  secondary2: Color
  secondary3: Color

  // other
  red1: Color
  red2: Color
  red3: Color
  green1: Color
  yellow1: Color
  yellow2: Color
  yellow3: Color
  blue1: Color
  blue2: Color

  blue4: Color

  error: Color
  success: Color
  warning: Color

  textPrimary: Color
  textSecondary: Color

  backgroundOutline: Color

  accentActive: Color

  breakpoint: {
    sm: number
    md: number
    lg: number
    xl: number
    xxl: number
    xxxl: number
  }

  transition: {
    duration: {
      slow: string
      medium: string
      fast: string
    }
    timing: {
      ease: string
      in: string
      out: string
      inOut: string
    }
  }
}

export interface Grids {
  sm: number
  md: number
  lg: number
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {
    grids: Grids

    bgCard: string,

    // shadows
    shadow1: string

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
      upToXl: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
