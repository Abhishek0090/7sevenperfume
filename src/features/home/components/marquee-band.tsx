const ITEMS = [
  "Handcrafted in small batches",
  "Long-lasting Eau de Parfum",
  "Order directly on WhatsApp",
  "Gift-ready packaging",
  "Seven signature scents",
];

/** Infinite ticker on a noir band. The list is rendered twice so the -50% loop is seamless. */
export function MarqueeBand() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span className="px-8 font-heading text-lg text-gold-light italic md:text-xl">{item}</span>
          <span className="text-gold">&#10022;</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Highlights" className="overflow-hidden border-y border-gold/30 bg-noir py-5">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
