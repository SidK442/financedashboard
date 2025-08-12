import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const sourceCode = Source_Code_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-code",
});

export const metadata: Metadata = {
  title: "Financial Insight - Advanced Quantitative Analysis Platform",
  description: "Enterprise-grade financial data visualization and analysis platform powered by advanced machine learning algorithms",
  keywords: "quantitative finance, algorithmic analysis, data visualization, machine learning, financial modeling, MIT-grade analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sourceCode.variable} font-sans antialiased bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-50 dark:bg-gray-900`}
      >
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
