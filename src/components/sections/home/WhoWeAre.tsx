import { Button, Eyebrow } from "@/components/ui";
import { Section } from "@/components/ui";
import photo from "@/assets/images/who-we-are-home.png";

export function WhoWeAre() {
  return (
    <Section tone="surface">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow>Who We Are</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink md:text-4xl">
            Engineering support built around your needs
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted">
            From sourcing the right equipment to providing engineering support, MF Ventures helps keep the moving
            parts of oil and gas operations working together. We bring procurement, technical support and project
            coordination into one reliable service, helping clients move from requirement to delivery with greater
            ease.
          </p>
          <Button to="/about" className="mt-7">
            Learn more
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl">
          <img
            src={photo}
            alt="MF Ventures field technicians on an active drilling site"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </Section>
  );
}
