import { privacy } from "@/content/privacy";

// "On this page": numbered links to every section. A sticky sidebar from lg up, a normal card above the policy below.
export function PrivacyToc() {
  const items = [...privacy.sections, privacy.contact];

  return (
    <nav aria-label={privacy.tocLabel} className="rounded-3xl bg-home-card p-6 text-home-ink shadow-card lg:sticky lg:top-24">
      <h2 className="type-label text-navy">{privacy.tocLabel}</h2>
      <ol className="mt-4 flex flex-col gap-1">
        {items.map((item, i) => (
          <li key={item.id} className="type-small flex gap-3">
            <span aria-hidden className="w-5 shrink-0 pt-1.5 text-right tabular-nums">
              {i + 1}
            </span>
            <a
              href={`#${item.id}`}
              className="rounded-lg py-1.5 font-medium text-navy underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
