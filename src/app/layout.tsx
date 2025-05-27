import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from '@/components/ClientComponents';
import { markPro, markProHeavy, markProMedium } from './fonts';


export const metadata: Metadata = {
  title: "Voice Gen UI",
  description: "Next-generation UI for Telecoms",
  authors: [{ name: "Voice Assistant" }],
  openGraph: {
    title: "Voice Gen UI",
    description: "Next-generation UI for Telecoms",
    type: "website",
    images: [
      {
        url: "https://lovable.dev/opengraph-image-p98pqg.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${markPro.variable} ${markProHeavy.variable} ${markProMedium.variable}`}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
        {/* Keep this script tag if needed for your project */}
        <script 
          async
          src="https://cdn.gpteng.co/gptengineer.js" 
          type="module" 
        />
      </body>
    </html>
  );
}