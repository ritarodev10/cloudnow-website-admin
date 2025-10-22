import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ServiceTestimonialsBlockProps } from "@/types/service-page-builder";
import { getTestimonialsByGroupId } from "@/data/testimonial-groups";
import { getGroupById } from "@/data/testimonial-groups";
import { Star } from "lucide-react";

interface TestimonialsBlockComponentProps {
  props: ServiceTestimonialsBlockProps;
  isPreview?: boolean;
}

export function TestimonialsBlock({ props }: TestimonialsBlockComponentProps) {
  const { groupId, displayStyle = "grid", showGroupName = true, maxItems, title, subtitle } = props;

  // Get testimonials from group
  const testimonials = groupId ? getTestimonialsByGroupId(groupId) : [];
  const group = groupId ? getGroupById(groupId) : null;

  // Limit testimonials if maxItems is specified
  const displayTestimonials = maxItems ? testimonials.slice(0, maxItems) : testimonials;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderTestimonial = (testimonial: {
    id: string;
    name: string;
    title: string;
    company: string;
    testimony: string;
    image?: string;
    rating: number;
  }) => (
    <Card key={testimonial.id} className="h-full">
      <CardContent className="p-6">
        {testimonial.rating && (
          <div className="flex items-center gap-1 mb-4">
            {renderStars(testimonial.rating)}
            <span className="text-sm text-muted-foreground ml-1">({testimonial.rating})</span>
          </div>
        )}

        <blockquote className="text-gray-600 mb-6 italic">&ldquo;{testimonial.testimony}&rdquo;</blockquote>

        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={testimonial.image} alt={testimonial.name} />
            <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
          </Avatar>

          <div>
            <div className="font-semibold text-gray-900">{testimonial.name}</div>
            <div className="text-sm text-gray-600">
              {testimonial.title} at {testimonial.company}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!groupId || testimonials.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Testimonials</h2>
            <p className="text-gray-600">No testimonials available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>}
          {subtitle && <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
          {showGroupName && group && (
            <div className="mt-4">
              <Badge variant="outline" className="text-sm">
                {group.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Testimonials Display */}
        {displayStyle === "carousel" && (
          <div className="relative">
            <div className="overflow-x-auto">
              <div className="flex gap-6 pb-4 min-w-max">{displayTestimonials.map(renderTestimonial)}</div>
            </div>
          </div>
        )}

        {displayStyle === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTestimonials.map(renderTestimonial)}
          </div>
        )}

        {displayStyle === "list" && (
          <div className="space-y-6">
            {displayTestimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 flex-shrink-0">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      {testimonial.rating && (
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(testimonial.rating)}
                          <span className="text-sm text-muted-foreground ml-1">({testimonial.rating})</span>
                        </div>
                      )}

                      <blockquote className="text-gray-600 mb-4 italic text-lg">
                        &ldquo;{testimonial.testimony}&rdquo;
                      </blockquote>

                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">
                        {testimonial.title} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
