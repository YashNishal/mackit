export function SiteFooter({ generatedAt }: { generatedAt?: string }) {
  const formatted = generatedAt
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(generatedAt))
    : null;

  return (
    <footer className="border-t border-border/80 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Apps install on your Mac. Nothing is uploaded.</p>
        {formatted ? <p>Catalog updated {formatted}</p> : null}
      </div>
    </footer>
  );
}
