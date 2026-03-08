import { Theme } from '@rebass/preset';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
