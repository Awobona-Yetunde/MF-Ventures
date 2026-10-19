import { Eyebrow, Section } from "@/components/ui";
import founderPhoto from "@/assets/images/founder-photo.png";

export function MeetFounder() {
  return (
    <Section tone="navy">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[280px_1fr]">
        <img
          src={founderPhoto}
          alt="Dr. Fred Afor George, Founder of MF Ventures"
          className="h-80 w-full rounded-lg object-cover md:h-96"
        />
        <div>
          <Eyebrow light>Meet The Founder</Eyebrow>
          <h2 className="mt-4 text-2xl font-extrabold text-white md:text-3xl">DR. FRED AFOR GEORGE</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/75 md:text-base">
            <p>
              Dr. Fred Afor George is a Mechanical Engineer with over 22 years of experience supporting engineering
              services within the oil and gas industry.
            </p>
            <p>
              A graduate of Mechanical Engineering from the University of Benin, Dr. George has furthered his
              academic and professional development through master's and professional doctorate degrees. He also
              holds professional credentials including DFCISM and FCIA.
            </p>
            <p>
              Through his leadership and strategic direction, he has contributed to the growth and development of
              MF Ventures Services Ltd, with a focus on strengthening its engineering and industry support.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
