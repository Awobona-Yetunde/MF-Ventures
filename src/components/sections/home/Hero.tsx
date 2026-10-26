import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import heroWorker from "@/assets/images/hero-worker.jpeg";
import whoWeAre from "@/assets/images/who-we-are-home.png";
import contactWorkers from "@/assets/images/contact-workers.jpeg";
import aboutHero from "@/assets/images/about-hero.png";

const SLIDES = [heroWorker, whoWeAre, contactWorkers, aboutHero];
const SLIDE_DURATION_MS = 2000;

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      <div className="absolute inset-0">
        {SLIDES.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            className={cn(
              "animate-hero-kenburns absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
              index === activeIndex ? "opacity-60" : "opacity-0",
            )}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/30" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-(--container-page) flex-col justify-center px-6 pt-20 pb-16 lg:px-8">
        <h1 className="animate-fade-up max-w-xl text-4xl leading-tight font-extrabold text-white opacity-0 [animation-delay:150ms] md:text-5xl">
          Built for Complex Industrial Operations
        </h1>
        <p className="animate-fade-up mt-5 max-w-md text-base leading-relaxed text-white/75 opacity-0 [animation-delay:350ms]">
          Engineering and procurement support that helps keep critical projects moving.
        </p>
        <div className="animate-fade-up mt-8 flex flex-wrap gap-4 opacity-0 [animation-delay:550ms]">
          <Button to="/services" variant="secondary" size="lg">
            Explore Services
          </Button>
          <Button to="/contact" variant="primary" size="lg">
            Request a Quote
          </Button>
        </div>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {SLIDES.map((src, index) => (
            <button
              key={src}
              type="button"
              aria-label={`Show background photo ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
