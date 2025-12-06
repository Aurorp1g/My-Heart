import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Heart - Aurorp1g",
  description: "Aurorp1g's personal heart website",
};

const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
  
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
  const fontFaceStyle = `
    @font-face {
      font-family: 'xwwk';
      font-display: swap;
      src: url('${assetPrefix}/woff/霞鹜文楷.woff2') format("woff2");
    }
  `;
  return (
    <html lang="zh-CN" style={{ '--asset-prefix': `'${assetPrefix}'` } as React.CSSProperties}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <style dangerouslySetInnerHTML={{ __html: fontFaceStyle }} />
      </head>
      <body>{children}</body>
    </html>
  );
}