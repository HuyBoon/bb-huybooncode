import { Inter, JetBrains_Mono } from "next/font/google";

export const inter = Inter({
    subsets: ["latin", "vietnamese"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-inter", 
    display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin", "vietnamese"],
    variable: "--font-jetbrains-mono",
    display: "swap",
});
