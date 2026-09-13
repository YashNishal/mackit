export function SiteFooter({ generatedAt }: { generatedAt?: string }) {
  const formatted = generatedAt
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(generatedAt))
    : null;

  return (
    <footer className="border-t-2 border-foreground bg-background py-3">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-3 font-sans text-[13px] sm:flex-row sm:items-center sm:justify-between">
        <p>About MacKit... Apps install on your Mac. Nothing is uploaded.</p>
        {formatted ? <p className="font-mono text-[11px]">Catalog updated {formatted}</p> : null}
      </div>
    </footer>
  );
}
