import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  id?: string;
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  id,
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="eyebrow flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-line-strong" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <TextReveal
        as="h2"
        id={id}
        text={title}
        className={cn(
          "display-xl text-gradient max-w-[20ch]",
          align === "center" && "max-w-[24ch]",
          titleClassName,
        )}
      />
      {intro && (
        <Reveal delay={0.1}>
          <p className={cn("lead max-w-2xl", align === "center" && "mx-auto")}>
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
