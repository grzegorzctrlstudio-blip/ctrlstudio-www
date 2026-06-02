import type { Homepage } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { VideoPlayer } from "@/components/ui/VideoPlayer";

export function Showreel({ data }: { data: Homepage["showreel"] }) {
  return (
    <section id="showreel" className="section">
      <div className="container-x flex flex-col gap-12">
        <SectionHeading
          eyebrow="Showreel"
          title={data.text}
          titleClassName="display-lg max-w-[18ch]"
        />
        <Reveal>
          <VideoPlayer src={data.src} poster={data.poster} label="CTRLstudio — showreel" />
        </Reveal>
      </div>
    </section>
  );
}
