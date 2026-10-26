import heroImage from "@/assets/images/about-hero.jpeg";

export function AboutHero() {
  return (
    <section className="relative isolate h-screen overflow-hidden bg-navy-950">
      <img
        src={heroImage}
        alt="MF Ventures team on site"
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/70 to-navy-950" />

      <div className="relative mx-auto flex h-screen w-full max-w-(--container-page) flex-col items-center justify-center px-6 text-center lg:px-8">
        <h1 className="max-w-2xl text-3xl font-extrabold leading-tight text-white md:text-4xl">
          Where requirements become results
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
          MF Ventures provides engineering support, procurement, and project coordination for the oil and gas
          industry. We take the time to understand each requirement, bringing the right support together to help
          keep operations and projects moving.
        </p>
      </div>
    </section>
  );
}
