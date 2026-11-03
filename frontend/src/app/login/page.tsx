import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, FileCheck2, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { getRequestOrigin } from "@/features/auth/server/get-request-origin";
import { getSafeCallbackUrl } from "@/features/auth/utils/get-safe-callback-url";

const authErrorMessages: Record<string, string> = {
  AccessDenied: "このシステムを利用する権限がありません。システム管理者へお問い合わせください。",
  Configuration: "認証設定に問題が発生しました。システム管理者へお問い合わせください。",
  OAuthAccountNotLinked: "このメールアドレスは別のログイン方法に関連付けられています。",
  OAuthCallbackError: "認証結果を確認できませんでした。もう一度ログインしてください。",
  OAuthSignin: "認証画面を開始できませんでした。時間をおいて再度お試しください。",
  SessionRequired: "セッションの有効期限が切れました。もう一度ログインしてください。",
  Verification: "認証情報を確認できませんでした。もう一度ログインしてください。",
};

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    error?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [session, params, requestOrigin] = await Promise.all([
    auth(),
    searchParams,
    getRequestOrigin(),
  ]);
  const callbackUrl = getSafeCallbackUrl(params.callbackUrl, requestOrigin);
  const errorCode = Array.isArray(params.error) ? params.error[0] : params.error;
  const errorMessage = errorCode
    ? (authErrorMessages[errorCode] ?? "ログインに失敗しました。時間をおいて再度お試しください。")
    : undefined;

  if (session && session.error !== "RefreshAccessTokenError") {
    redirect(callbackUrl);
  }

  return (
    <main className="flex min-h-svh flex-col bg-slate-100 dark:bg-slate-950">
      <header className="border-b bg-background shadow-xs">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-5 sm:px-8">
          <span className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <FileCheck2 aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-base font-semibold leading-tight tracking-tight">Procure Flow</p>
            <p className="text-xs text-muted-foreground">購買管理システム</p>
          </div>
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Card className="gap-0 bg-background py-0 shadow-sm ring-slate-200 dark:ring-slate-800">
            <CardHeader className="gap-2 border-b px-7 py-7 sm:px-9">
              <CardTitle className="text-xl font-semibold tracking-tight">ログイン</CardTitle>
              <CardDescription className="leading-6">
                社内アカウントを使用してログインしてください。
              </CardDescription>
            </CardHeader>

            <CardContent className="px-7 py-7 sm:px-9 sm:py-8">
              {errorMessage && (
                <p
                  role="alert"
                  className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm leading-5 text-destructive"
                >
                  {errorMessage}
                </p>
              )}

              <form
                action={async () => {
                  "use server";
                  await signIn("cognito", {
                    redirectTo: callbackUrl,
                  });
                }}
              >
                <Button type="submit" size="lg" className="h-10 w-full bg-blue-600 hover:bg-blue-700">
                  ログインする
                  <ArrowRight aria-hidden="true" className="ml-1" />
                </Button>
              </form>

              <div className="mt-5 flex items-start gap-2.5 rounded-md border bg-slate-50 px-3.5 py-3 text-xs leading-5 text-muted-foreground dark:bg-slate-900">
                <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-blue-600" />
                <p>
                  ログイン後、Amazon Cognitoによる認証を行います。許可された社員のみ利用できます。
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-2 text-center text-xs text-muted-foreground">
            <p>ログインに問題がある場合は、システム管理者へお問い合わせください。</p>
            <p>Procure Flow — 社内利用専用</p>
          </div>
        </div>
      </section>
    </main>
  );
}
