import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata = {
    title: "Vastra culture - Smart Dropshipping Ecosystem",
    description: "Next-generation dropshipping platform for customers, sellers, and suppliers. Featuring automated inventory, order forwarding, and ultra-fast local deliveries.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
            </body>
        </html>
    );
}
