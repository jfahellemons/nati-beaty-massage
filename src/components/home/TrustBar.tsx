import { Icon } from "@/components/ui/Icon";

const items = [
  { label: "Hoge Kwaliteit", icon: "quality" },
  { label: "Gecertificeerd", icon: "certified" },
  { label: "Serene Omgeving", icon: "leaf" },
  { label: "Aandachtige Zorg", icon: "heart" },
] as const;

export function TrustBar() {
  return (
    <section
      aria-label="Waarom Nataly"
      className="relative z-2 -mt-11 rounded-t-[44px] bg-ivory px-[clamp(20px,5vw,64px)] pt-11 pb-10"
    >
      <ul className="mx-auto grid max-w-[1192px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-center gap-3.5 py-2.5">
            <Icon name={item.icon} size={34} strokeWidth={1.1} className="text-bronze" />
            <span className="font-serif text-2xl tracking-[0.01em] text-bronze-darkest">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
