import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CtaBlockProps } from "@/types/service-page-builder";

interface CtaBlockComponentProps {
  props: CtaBlockProps;
  isPreview?: boolean;
}

export function CtaBlock({ props, isPreview = false }: CtaBlockComponentProps) {
  const {
    title,
    description,
    buttonText,
    buttonLink,
    buttonSecondaryText,
    buttonSecondaryLink,
    background = "primary",
    backgroundImage,
    alignment = "center",
  } = props;

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const backgroundClasses = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
    image: "text-white",
  };

  return (
    <section
      className={`py-16 relative overflow-hidden ${backgroundClasses[background]}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Overlay for Image */}
      {backgroundImage && <div className="absolute inset-0 bg-black/50" />}

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <Card className={`${background === "image" ? "bg-transparent border-transparent shadow-none" : ""}`}>
          <CardContent className={`p-8 ${background === "image" ? "text-white" : ""}`}>
            <div className={alignmentClasses[alignment]}>
              {title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>}

              {description && <p className="text-lg mb-8 max-w-2xl mx-auto">{description}</p>}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {buttonText && buttonLink && (
                  <Button
                    size="lg"
                    className="px-8 py-3"
                    variant={background === "primary" ? "secondary" : "default"}
                    onClick={isPreview ? undefined : () => window.open(buttonLink, "_blank")}
                  >
                    {buttonText}
                  </Button>
                )}

                {buttonSecondaryText && buttonSecondaryLink && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-3"
                    onClick={isPreview ? undefined : () => window.open(buttonSecondaryLink, "_blank")}
                  >
                    {buttonSecondaryText}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
