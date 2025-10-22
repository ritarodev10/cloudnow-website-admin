import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaqBlockProps } from "@/types/service-page-builder";
import { useState } from "react";

interface FaqBlockComponentProps {
  props: FaqBlockProps;
  isPreview?: boolean;
}

export function FaqBlock({ props, isPreview = false }: FaqBlockComponentProps) {
  const { title, subtitle, faqs = [], layout = "accordion" } = props;

  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const renderAccordionItem = (faq: any) => {
    const isOpen = openItems.has(faq.id);

    return (
      <Card key={faq.id} className="mb-4">
        <CardHeader
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => !isPreview && toggleItem(faq.id)}
        >
          <CardTitle className="text-lg flex items-center justify-between">
            {faq.question}
            <span className="text-2xl font-light">{isOpen ? "−" : "+"}</span>
          </CardTitle>
        </CardHeader>
        {isOpen && (
          <CardContent>
            <p className="text-gray-600">{faq.answer}</p>
          </CardContent>
        )}
      </Card>
    );
  };

  const renderGridItem = (faq: any) => (
    <Card key={faq.id} className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{faq.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{faq.answer}</p>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>}
            {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
          </div>
        )}

        {layout === "accordion" && <div className="space-y-4">{faqs.map(renderAccordionItem)}</div>}

        {layout === "grid" && <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{faqs.map(renderGridItem)}</div>}
      </div>
    </section>
  );
}

