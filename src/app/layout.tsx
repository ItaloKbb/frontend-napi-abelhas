import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import "./globals.css";

export const metadata: Metadata = {
  title: "NAPI Abelhas",
  description: "Sistema de Gestão de Amostras Apícolas",
};

const clerkAppearance = {
  variables: {
    colorPrimary: "var(--color-primary)" as string,
    colorDanger: "var(--color-error)" as string,
    colorSuccess: "var(--color-success)" as string,
    colorWarning: "var(--color-warning)" as string,
    colorNeutral: "var(--color-neutral)" as string,
    colorText: "var(--color-base-content)" as string,
    colorTextSecondary: "var(--color-base-content)" as string,
    colorBackground: "var(--color-base-100)" as string,
    colorInputText: "var(--color-base-content)" as string,
    colorInputBackground: "var(--color-base-200)" as string,
    borderRadius: "var(--radius-field)" as string,
    fontFamily: "inherit" as string,
  },
  elements: {
    card: "bg-base-100 text-base-content shadow-xl",
    navbar: "bg-base-100 text-base-content",
    headerTitle: "text-base-content",
    headerSubtitle: "text-base-content/70",
    formButtonPrimary: "btn btn-primary",
    formFieldInput: "input input-bordered bg-base-200 text-base-content",
    footerActionLink: "text-primary underline",
    userButtonPopoverCard: "bg-base-100 text-base-content shadow-xl",
    organizationSwitcherPopoverCard: "bg-base-100 text-base-content shadow-xl",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('napi-abelhas-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`
          }}
        />
      </head>
      <body>
        <ClerkProvider localization={ptBR} appearance={clerkAppearance}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
