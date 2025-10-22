import { Card, CardContent } from "@/components/ui/card";
import { ImageBlockProps } from "@/types/service-page-builder";

interface ImageBlockComponentProps {
  props: ImageBlockProps;
  isPreview?: boolean;
}

export function ImageBlock({ props, isPreview = false }: ImageBlockComponentProps) {
  const { src, alt, caption, alignment = "center", size = "medium", link } = props;

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const sizeClasses = {
    small: "max-w-sm",
    medium: "max-w-2xl",
    large: "max-w-4xl",
    full: "max-w-full",
  };

  const imageElement = <img src={src} alt={alt} className={`w-full h-auto rounded-lg ${sizeClasses[size]}`} />;

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-0">
            <div className={alignmentClasses[alignment]}>
              {link ? (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:opacity-90 transition-opacity"
                >
                  {imageElement}
                </a>
              ) : (
                imageElement
              )}

              {caption && <p className="text-sm text-gray-600 mt-4 italic">{caption}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

