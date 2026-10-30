import heroImage from "@/assets/images/about-hero.jpeg";

export function AboutHero() {
  return (
    <section className="relative isolate min-h-[520px] overflow-hidden bg-navy-950 md:min-h-[600px]">
      <img
        src={heroImage}
        alt="MF Ventures team on site"
        className="animate-hero-kenburns absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/70 to-navy-950" />

      {/* Ambient glow accents — purely decorative, clipped by the section's overflow-hidden. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute -top-20 -left-16 h-72 w-72 rounded-full bg-brand-blue/25 blur-3xl" />
        <div className="animate-float-slow absolute -right-16 -bottom-20 h-72 w-72 rounded-full bg-brand-blue/20 blur-3xl [animation-delay:2.5s]" />
      </div>

      <div className="relative mx-auto flex min-h-[520px] w-full max-w-(--container-page) flex-col items-center justify-center px-6 text-center md:min-h-[600px] lg:px-8">
        <h1 className="animate-fade-up max-w-2xl text-3xl font-extrabold leading-tight text-white opacity-0 [animation-delay:150ms] md:text-4xl">
          Where requirements become results
        </h1>
        <p className="animate-fade-up mt-5 max-w-xl text-sm leading-relaxed text-white/70 opacity-0 [animation-delay:350ms] md:text-base">
          MF Ventures provides engineering support, procurement, and project
          coordination for the oil and gas industry. We take the time to
          understand each requirement, bringing the right support together to
          help keep operations and projects moving.
        </p>
      </div>
    </section>
  );
}
