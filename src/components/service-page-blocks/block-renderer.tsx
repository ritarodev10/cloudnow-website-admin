import {
  PageBlock,
  HeroBlockProps,
  FeaturesBlockProps,
  CtaBlockProps,
  FaqBlockProps,
  ServiceTestimonialsBlockProps,
  StatsBlockProps,
  TextBlockProps,
  ImageBlockProps,
} from "@/types/service-page-builder";
import { HeroBlock } from "./hero-block";
import { FeaturesBlock } from "./features-block";
import { CtaBlock } from "./cta-block";
import { FaqBlock } from "./faq-block";
import { TestimonialsBlock } from "./testimonials-block";
import { StatsBlock } from "./stats-block";
import { TextBlock } from "./text-block";
import { ImageBlock } from "./image-block";

interface BlockRendererProps {
  block: PageBlock;
  isPreview?: boolean;
}

export function BlockRenderer({ block, isPreview = false }: BlockRendererProps) {
  const { type, props } = block;

  switch (type) {
    case "hero":
      return <HeroBlock props={props as unknown as HeroBlockProps} isPreview={isPreview} />;
    case "features":
      return <FeaturesBlock props={props as unknown as FeaturesBlockProps} isPreview={isPreview} />;
    case "cta":
      return <CtaBlock props={props as unknown as CtaBlockProps} isPreview={isPreview} />;
    case "faq":
      return <FaqBlock props={props as unknown as FaqBlockProps} isPreview={isPreview} />;
    case "testimonials":
      return <TestimonialsBlock props={props as unknown as ServiceTestimonialsBlockProps} isPreview={isPreview} />;
    case "stats":
      return <StatsBlock props={props as unknown as StatsBlockProps} isPreview={isPreview} />;
    case "text":
      return <TextBlock props={props as unknown as TextBlockProps} isPreview={isPreview} />;
    case "image":
      return <ImageBlock props={props as unknown as ImageBlockProps} isPreview={isPreview} />;
    default:
      return (
        <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p>Unknown block type: {type}</p>
        </div>
      );
  }
}
