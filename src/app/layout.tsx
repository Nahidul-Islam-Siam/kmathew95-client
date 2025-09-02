import { NextUiProvider } from "@/lib/providers/NextUIProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { SocketProvider } from "@/lib/providers/SocketProvider";
import AuthenticateProvider from "@/lib/providers/AuthenticateProvider";
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
      <head></head>
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} antialiased !bg-white`}
      >
        <NextUiProvider>
          <ReduxProvider>
            <SocketProvider>
              <AuthenticateProvider>
                <>
                  <div className="min-h-screen h-full grid grid-rows-[auto_1fr_auto] max-w-[100vw] overflow-hidden">
                    {children}
                  </div>
                  {/* <ScrollToTopButton /> */}
                  <Toaster richColors position="top-right" />
                </>{" "}
              </AuthenticateProvider>
            </SocketProvider>
          </ReduxProvider>
        </NextUiProvider>
      </body>
    </html>
  );
}
