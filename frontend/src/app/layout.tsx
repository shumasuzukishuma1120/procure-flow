import type { Metadata } from "next";
import "@/app/globals.css";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: {
    default: "Procure Flow",
    template: "%s | Procure Flow",
  },
  description: "社内の購入申請から承認・発注・受領までを管理する購買ワークフローシステム",
  applicationName: "Procure Flow",
  robots: {
    index: false,
    follow: false,
  },
};

type Theme = "light" | "dark";

export default async function RootLayout({ children }:{children:React.ReactNode} ) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const theme: Theme = themeCookie === "dark" ? "dark" : "light";

  return (
    <html lang="ja" className={theme === "dark" ? "dark" : undefined}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
