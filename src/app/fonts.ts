import localFont from "next/font/local";

export const markPro = localFont({
  src: [
    {
      path: "../fonts/MarkPro.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-mark-pro",
});

export const markProHeavy = localFont({
  src: [
    {
      path: "../fonts/MarkPro-Heavy.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-mark-pro-heavy",
});

export const markProMedium = localFont({
  src: [
    {
      path: "../fonts/MarkPro-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-mark-pro-medium",
});

export const markProLight = localFont({
  src: [
    {
      path: "../fonts/MarkPro-Light.ttf",
      weight: "350",
      style: "normal",
    },
  ],
  variable: "--font-mark-pro-light",
});

// Combined font variables to add to body
export const fonts = [
  markPro.variable,
  markProHeavy.variable,
  markProMedium.variable,
];
