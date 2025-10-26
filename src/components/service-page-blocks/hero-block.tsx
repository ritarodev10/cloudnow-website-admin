import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeroBlockProps } from "@/types/service-page-builder";

interface HeroBlockComponentProps {
  props: HeroBlockProps;
  isPreview?: boolean;
}

export function HeroBlock({ props, isPreview = false }: HeroBlockComponentProps) {
  const {
    title,
    subtitle,
    description,
    backgroundImage,
    backgroundVideo,
    ctaText,
    ctaLink,
    ctaSecondaryText,
    ctaSecondaryLink,
    alignment = "center",
    height = "large",
  } = props;

  const heightClasses = {
    small: "min-h-[300px]",
    medium: "min-h-[500px]",
    large: "min-h-[700px]",
    full: "min-h-screen",
  };

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <section
      className={`relative ${heightClasses[height]} flex items-center justify-center overflow-hidden`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Video */}
      {backgroundVideo && (
        <video className="absolute inset-0 w-full h-full object-cover z-0" autoPlay muted loop playsInline>
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      {(backgroundImage || backgroundVideo) && <div className="absolute inset-0 bg-black/40 z-10" />}

      {/* Content */}
      <div className={`relative z-20 max-w-4xl mx-auto px-4 ${alignmentClasses[alignment]}`}>
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8">
            {title && <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">{title}</h1>}

            {subtitle && <h2 className="text-xl md:text-2xl text-gray-700 mb-4">{subtitle}</h2>}

            {description && <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">{description}</p>}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {ctaText && ctaLink && (
                <Button
                  size="lg"
                  className="px-8 py-3"
                  onClick={isPreview ? undefined : () => window.open(ctaLink, "_blank")}
                >
                  {ctaText}
                </Button>
              )}

              {ctaSecondaryText && ctaSecondaryLink && (
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3"
                  onClick={isPreview ? undefined : () => window.open(ctaSecondaryLink, "_blank")}
                >
                  {ctaSecondaryText}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}





