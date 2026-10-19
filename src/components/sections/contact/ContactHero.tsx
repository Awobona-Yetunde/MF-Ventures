import photo from "@/assets/images/contact-workers.png";

export function ContactHero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      <img
        src={photo}
        alt="MF Ventures field team on site"
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/70 to-navy-950" />

      <div className="relative mx-auto flex min-h-[460px] w-full max-w-(--container-page) flex-col items-center justify-center px-6 text-center lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">CONTACT US</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 md:text-base">
          Engineering & Procurement Support Built Around Your Operations.
        </p>
      </div>
    </section>
  );
}
