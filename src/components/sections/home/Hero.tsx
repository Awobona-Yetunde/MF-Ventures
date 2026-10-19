import { Button } from "@/components/ui";
import heroImage from "@/assets/images/hero-worker.png";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      <img
        src={heroImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/30" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-(--container-page) flex-col justify-center px-6 pt-20 pb-16 lg:px-8">
        <h1 className="max-w-xl text-4xl font-extrabold leading-tight text-white md:text-5xl">
          Built for Complex Industrial Operations
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/75">
          Engineering and procurement support that helps keep critical projects moving.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button to="/services" variant="secondary" size="lg">
            Explore Services
          </Button>
          <Button to="/contact" variant="primary" size="lg">
            Request a Quote
          </Button>
        </div>
      </div>
    </section>
  );
}
