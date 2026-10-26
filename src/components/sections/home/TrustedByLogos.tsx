import { Section } from "@/components/ui";
import logoSeplat from "@/assets/images/logo-seplat.svg";
import logoChevron from "@/assets/images/logo-chevron.svg";
import logoTotalEnergies from "@/assets/images/logo-totalenergies.png";
import logoShell from "@/assets/images/logo-shell.svg";

const LOGOS = [
  { src: logoSeplat, alt: "Seplat Energy" },
  { src: logoChevron, alt: "Chevron" },
  { src: logoTotalEnergies, alt: "TotalEnergies" },
  { src: logoShell, alt: "Shell" },
];

export function TrustedByLogos() {
  return (
    <Section tone="light" padding="sm">
      <p className="text-center text-sm text-muted">Trusted by organizations across the energy industry</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 ">
        {LOGOS.map((logo) => (
          <img key={logo.alt} src={logo.src} alt={logo.alt} className="h-9 w-auto object-contain" />
        ))}
      </div>
    </Section>
  );
}
