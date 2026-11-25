import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/claire-star.png"
          alt=""
          width={36}
          height={36}
          className="rounded-lg"
        />
        <span className="font-display text-xl text-navy">{site.name}</span>
      </Link>
      <nav className="flex gap-5 text-sm font-medium">
        {site.nav.map((item) => (
          <a key={item.href} href={item.href} className="hover:text-navy">
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
