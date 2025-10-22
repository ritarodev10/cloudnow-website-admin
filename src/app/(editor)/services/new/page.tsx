"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ServicePageEditor } from "@/components/service-page-builder/service-page-editor";
import { TemplateSelector } from "@/components/service-page-builder/template-selector";
import { ComponentTemplate, TemplateCategory, PageContent } from "@/types/service-page-builder";

// Mock template data - replace with actual API call
const mockTemplates: ComponentTemplate[] = [
  {
    id: "standard-service",
    name: "Standard Service",
    description: "A clean, professional layout perfect for most services",
    category: "business",
    blocks: [
      {
        id: "hero_1",
        type: "hero",
        category: "header",
        props: {
          title: "Your Service Title",
          subtitle: "Compelling subtitle that describes your service",
          ctaText: "Get Started",
          ctaLink: "#contact",
        },
        order: 0,
      },
      {
        id: "features_1",
        type: "features",
        category: "content",
        props: {
          title: "Key Features",
          features: [
            { id: "1", title: "Feature 1", description: "Description of feature 1" },
            { id: "2", title: "Feature 2", description: "Description of feature 2" },
            { id: "3", title: "Feature 3", description: "Description of feature 3" },
          ],
        },
        order: 1,
      },
      {
        id: "cta_1",
        type: "cta",
        category: "conversion",
        props: {
          title: "Ready to Get Started?",
          description: "Contact us today to learn more about our services",
          buttonText: "Contact Us",
          buttonLink: "#contact",
        },
        order: 2,
      },
    ],
    tags: ["business", "professional", "standard"],
  },
  {
    id: "premium-service",
    name: "Premium Service",
    description: "A sophisticated layout with testimonials and pricing",
    category: "premium",
    blocks: [
      {
        id: "hero_1",
        type: "hero",
        category: "header",
        props: {
          title: "Premium Service",
          subtitle: "Experience the difference with our premium offering",
          description: "Comprehensive solution designed for discerning clients",
          ctaText: "Learn More",
          ctaLink: "#features",
        },
        order: 0,
      },
      {
        id: "stats_1",
        type: "stats",
        category: "social-proof",
        props: {
          title: "Proven Results",
          stats: [
            { id: "1", value: "99%", label: "Success Rate" },
            { id: "2", value: "500+", label: "Happy Clients" },
            { id: "3", value: "24/7", label: "Support" },
          ],
        },
        order: 1,
      },
      {
        id: "testimonials_1",
        type: "testimonials",
        category: "social-proof",
        props: {
          title: "What Our Clients Say",
          testimonials: [
            {
              id: "1",
              name: "John Doe",
              role: "CEO",
              company: "Tech Corp",
              content: "Exceptional service that exceeded our expectations",
            },
          ],
        },
        order: 2,
      },
    ],
    tags: ["premium", "testimonials", "stats"],
  },
];

const mockTemplateCategories: TemplateCategory[] = [
  {
    id: "business",
    name: "Business",
    description: "Professional business templates",
    templates: mockTemplates.filter((t) => t.category === "business"),
  },
  {
    id: "premium",
    name: "Premium",
    description: "High-end service templates",
    templates: mockTemplates.filter((t) => t.category === "premium"),
  },
];

export default function NewServicePage() {
  const router = useRouter();
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [, setSelectedTemplate] = useState<ComponentTemplate | null>(null);
  const [initialContent, setInitialContent] = useState<PageContent | undefined>();

  const handleSelectTemplate = (template: ComponentTemplate) => {
    setSelectedTemplate(template);

    // Convert template blocks to page content
    const pageContent: PageContent = {
      blocks: template.blocks.map((block, index) => ({
        ...block,
        id: `block_${Date.now()}_${index}`,
        order: index,
      })),
      metadata: {
        lastEditedAt: new Date(),
        version: 1,
      },
    };

    setInitialContent(pageContent);
    setShowTemplateSelector(false);
  };

  const handleStartFromScratch = () => {
    setSelectedTemplate(null);
    setInitialContent({
      blocks: [],
      metadata: {
        lastEditedAt: new Date(),
        version: 1,
      },
    });
    setShowTemplateSelector(false);
  };

  const handleBack = () => {
    router.push("/services");
  };

  if (showTemplateSelector) {
    return (
      <TemplateSelector
        templates={mockTemplates}
        templateCategories={mockTemplateCategories}
        onSelectTemplate={handleSelectTemplate}
        onStartFromScratch={handleStartFromScratch}
        onBack={handleBack}
      />
    );
  }

  return <ServicePageEditor initialContent={initialContent} />;
}
