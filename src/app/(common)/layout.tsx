import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
// import ScrollToTopButton from "@/components/UI/ScrollToTopButton/ScrollToTopButton";

import { NextUiProvider } from "@/lib/providers/NextUIProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "ARC (Allied Restoration Contractors)",
  description:
    "Award Winning Service Allied Restoration Contractors, Repairs & Replacement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NextUiProvider>
        <ReduxProvider>
          <>
    <div className="min-h-screen flex flex-col max-w-[100vw]">
  
    <Navbar />

              <main className="flex-grow min-h-[60vh] pt-16">
    {children}
  </main>

              <Footer />
            </div>

         
          </>
        </ReduxProvider>
      </NextUiProvider>
    </div>
  );
}
