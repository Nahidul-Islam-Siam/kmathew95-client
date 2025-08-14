import { NextUiProvider } from "@/lib/providers/NextUIProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import FacebookPixel from "@/FacebookPixel";
// import ScrollToTopButton from "@/components/UI/ScrollToTopButton/ScrollToTopButton";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SkillSet - Found Your Perfect Service",
  description:
    "SkillSet is your go-to platform for finding the perfect service provider. Whether you need a skilled freelancer, a reliable contractor, or a specialized service, SkillSet connects you with top professionals to meet your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4743849065459298"
          crossOrigin="anonymous"
        />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} antialiased !bg-white`}
      >
        <NextUiProvider>
          <ReduxProvider>
            <>
              <div className="min-h-screen h-full grid grid-rows-[auto_1fr_auto] max-w-[100vw] overflow-hidden">
                <FacebookPixel />
                {children}
              </div>
              {/* <ScrollToTopButton /> */}
              <Toaster richColors position="top-right" />
            </>
          </ReduxProvider>
        </NextUiProvider>
      </body>
    </html>
  );
}
