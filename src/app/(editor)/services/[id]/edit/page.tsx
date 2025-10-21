import { ServicePageEditor } from "@/components/service-page-builder/service-page-editor";
import { Service, PageContent } from "@/types";

interface EditServicePageProps {
  params: {
    id: string;
  };
}

// Mock service data - replace with actual API call
const mockService: Service = {
  id: "1",
  title: "IT Consulting",
  slug: "it-consulting",
  description: "Transform your business with our tailored IT consulting services",
  category: "IT Consulting",
  status: "active",
  featured: true,
  pageContent: {
    blocks: [
      {
        id: "hero_1",
        type: "hero",
        category: "header",
        props: {
          title: "IT Consulting Services",
          subtitle: "Transform your business with expert IT solutions",
          description:
            "We provide comprehensive IT consulting services to help your business thrive in the digital age.",
          ctaText: "Get Started",
          ctaLink: "#contact",
          alignment: "center",
          height: "large",
        },
        order: 0,
      },
      {
        id: "features_1",
        type: "features",
        category: "content",
        props: {
          title: "Our Services",
          features: [
            {
              id: "1",
              title: "Strategic Planning",
              description: "Comprehensive IT strategy development",
            },
            {
              id: "2",
              title: "Technology Assessment",
              description: "Evaluate your current technology stack",
            },
            {
              id: "3",
              title: "Implementation Support",
              description: "Expert guidance through implementation",
            },
          ],
          columns: 3,
          layout: "grid",
        },
        order: 1,
      },
    ],
    metadata: {
      lastEditedAt: new Date(),
      version: 1,
    },
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function EditServicePage({ params }: EditServicePageProps) {
  // TODO: Fetch service data from API
  const service = mockService;

  return <ServicePageEditor service={service} initialContent={service.pageContent} />;
}
