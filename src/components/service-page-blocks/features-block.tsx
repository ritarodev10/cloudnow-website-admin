import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeaturesBlockProps } from "@/types/service-page-builder";
import Image from "next/image";

interface FeaturesBlockComponentProps {
  props: FeaturesBlockProps;
  isPreview?: boolean;
}

export function FeaturesBlock({ props }: FeaturesBlockComponentProps) {
  const { title, subtitle, features = [], columns = 3, layout = "grid" } = props;

  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const renderFeature = (feature: {
    id: string;
    title: string;
    description: string;
    icon?: string;
    image?: string;
  }) => (
    <Card key={feature.id} className="h-full">
      <CardHeader>
        {feature.icon && <div className="text-4xl mb-4">{feature.icon}</div>}
        {feature.image && (
          <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            <Image
              src={feature.image}
              alt={feature.title}
              width={200}
              height={128}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
        <CardTitle className="text-xl">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{feature.description}</p>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>}
            {subtitle && <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}

        {layout === "grid" && <div className={`grid ${gridClasses[columns]} gap-6`}>{features.map(renderFeature)}</div>}

        {layout === "list" && (
          <div className="space-y-6">
            {features.map((feature) => (
              <Card key={feature.id} className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-shrink-0">
                  {feature.icon && <div className="text-3xl">{feature.icon}</div>}
                  {feature.image && (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={64}
                        height={64}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {layout === "cards" && (
          <div className={`grid ${gridClasses[columns]} gap-6`}>
            {features.map((feature) => (
              <Card key={feature.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {feature.icon && <div className="text-5xl mb-4">{feature.icon}</div>}
                  {feature.image && (
                    <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={80}
                        height={80}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
