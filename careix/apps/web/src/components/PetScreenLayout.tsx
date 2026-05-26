import type { ReactNode } from "react";

interface PetScreenLayoutProps {
  title: string;
  children: ReactNode;
  brand?: boolean;
}

export function PetScreenLayout({ title, children, brand }: PetScreenLayoutProps) {
  return (
    <div className="careix-layout" data-testid="careix-layout">
      <header className={`careix-header ${brand ? "careix-header--brand" : ""}`}>
        <h1 className="careix-title">{brand ? "careix" : title}</h1>
        {brand && <span className="careix-header__subtitle">{title}</span>}
      </header>
      <main className="careix-main">{children}</main>
    </div>
  );
}
