import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import AgeGate from "../components/AgeGate";

// Headings: Cormorant Garamond (elegant serif). Body aur buttons: Jost (clean geometric, logo se milta hua)
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-serif" });
const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-sans" });

export const metadata = {
  title: "SEPELA – Premium ready-to-drink cocktails",
  description: "Pink Gin & Tonic, Rum & Ginger and Lime, Whisky & Cola. 250 ml, 7% Vol.",
};

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {children}
        <AgeGate />
      </body>
    </html>
  );
}
