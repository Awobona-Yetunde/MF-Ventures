import { Eyebrow, Section } from "@/components/ui";
import { ContactForm } from "@/components/sections/ContactForm";
import photo from "@/assets/images/contact-workers.png";

export function ContactCTA() {
  return (
    <Section tone="navy">
      <Eyebrow light>Let Us Work Together</Eyebrow>
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">READY TO WORK WITH US?</h2>
      <p className="mt-3 text-base text-white/70">Tell us what you need. Let's explore how we can help</p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
        <div className="overflow-hidden rounded-xl">
          <img src={photo} alt="MF Ventures field team on site" className="h-full w-full object-cover" />
        </div>
        <ContactForm />
      </div>
    </Section>
  );
}
