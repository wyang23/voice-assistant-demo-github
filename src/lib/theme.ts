// This file helps with type definitions for your custom theme properties
export type TelecomColors = {
    DEFAULT: string;
    darker: string;
    text: string;
    highlight: string;
    accent: string;
    teal: string;
  };
  
  declare module 'tailwindcss/types/config' {
    interface ThemeConfig {
      extend?: {
        colors?: {
          telecom?: TelecomColors;
        };
      };
    }
  }