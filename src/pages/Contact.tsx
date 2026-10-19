import { Section } from "@/components/ui";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactHero, ContactInfo } from "@/components/sections/contact";

export default function Contact() {
  return (
    <>
      <ContactHero />

      <Section tone="surface">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          <ContactInfo tone="light" />
          <ContactForm submitLabel="Submit an Inquiry" />
        </div>
      </Section>
    </>
  );
}
