import { Card, CardContent } from "@/components/ui/card";
import { TextBlockProps } from "@/types/service-page-builder";

interface TextBlockComponentProps {
  props: TextBlockProps;
  isPreview?: boolean;
}

export function TextBlock({ props }: TextBlockComponentProps) {
  const { content, alignment = "left", fontSize = "medium", backgroundColor } = props;

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const fontSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  return (
    <section className="py-8" style={{ backgroundColor }}>
      <div className="max-w-4xl mx-auto px-4">
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-0">
            <div
              className={`${alignmentClasses[alignment]} ${fontSizeClasses[fontSize]} prose prose-gray max-w-none`}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

