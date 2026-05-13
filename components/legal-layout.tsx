import { ReactNode } from "react";

export function LegalLayout({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-2xl px-5 pt-10 pb-24 sm:px-6 sm:pt-14">
      <header className="mb-6 border-b border-(--border-subtle) pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">
          {title}
        </h1>
        <p className="mt-1 text-[12px] text-(--text-tertiary)">
          시행일 {effectiveDate}
        </p>
      </header>
      <div className="prose-rolling space-y-5 text-[14.5px] leading-[1.75] text-(--text-secondary)">
        {children}
      </div>
      <style>{`
        .prose-rolling h2 {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-top: 28px;
          margin-bottom: 10px;
        }
        .prose-rolling p { margin: 0; }
        .prose-rolling ul { margin: 8px 0 0 0; padding-left: 1.2em; list-style: disc; }
        .prose-rolling ul li { margin-bottom: 4px; }
      `}</style>
    </article>
  );
}
