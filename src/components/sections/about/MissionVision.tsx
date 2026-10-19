import { Section } from "@/components/ui";
import missionPhoto from "@/assets/images/mission-photo.png";
import visionPhoto from "@/assets/images/vision-photo.png";

export function MissionVision() {
  return (
    <Section tone="light">
      <div className="flex flex-col gap-16">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-14">
          <img
            src={missionPhoto}
            alt="MF Ventures engineers reviewing site equipment"
            className="h-64 w-full max-w-sm rounded-lg object-cover md:h-80 md:w-80"
          />
          <div className="max-w-sm text-center">
            <h3 className="text-xl font-extrabold tracking-tight text-ink md:text-2xl">OUR MISSION</h3>
            <p className="mt-3 text-base leading-relaxed text-muted">
              To provide reliable engineering, procurement, and project support that helps oil and gas operations
              meet their requirements efficiently and effectively.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 md:flex-row-reverse md:justify-center md:gap-14">
          <img
            src={visionPhoto}
            alt="MF Ventures engineer inspecting industrial equipment"
            className="h-64 w-full max-w-sm rounded-lg object-cover md:h-80 md:w-80"
          />
          <div className="max-w-sm text-center">
            <h3 className="text-xl font-extrabold tracking-tight text-ink md:text-2xl">OUR VISION</h3>
            <p className="mt-3 text-base leading-relaxed text-muted">
              To become a trusted engineering and procurement partner, recognised for dependable service, technical
              capability, and timely delivery across the energy industry.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
