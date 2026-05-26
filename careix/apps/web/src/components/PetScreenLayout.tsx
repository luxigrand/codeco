import type { ReactNode } from "react";

interface PetScreenLayoutProps {
  title: string;
  children: ReactNode;
}

export function PetScreenLayout({ title, children }: PetScreenLayoutProps) {
  return (
    <div className="careix-layout" data-testid="careix-layout">
      <header className="careix-header">
        <h1 className="careix-title">{title}</h1>
      </header>
      <main className="careix-main">{children}</main>
    </div>
  );
}
