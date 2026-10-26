import { Reveal } from "@/components/ui";
import { ContactCTA, Hero, TrustedByLogos, WhatWeDo, WhoWeAre, WhyChooseUs } from "@/components/sections/home";

export default function Home() {
  return (
    <>
      <Hero />
      <Reveal>
        <TrustedByLogos />
      </Reveal>
      <Reveal>
        <WhoWeAre />
      </Reveal>
      <Reveal>
        <WhatWeDo />
      </Reveal>
      {/* WhyChooseUs reveals its own heading and cards individually, with a stagger. */}
      <WhyChooseUs />
      <Reveal>
        <ContactCTA />
      </Reveal>
    </>
  );
}
