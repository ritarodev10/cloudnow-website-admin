import { StatsBlockProps } from "@/types/service-page-builder";

interface StatsBlockComponentProps {
  props: StatsBlockProps;
  isPreview?: boolean;
}

export function StatsBlock({ props }: StatsBlockComponentProps) {
  const { title, subtitle, stats = [], layout = "horizontal", columns = 3 } = props;

  const gridClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const renderStat = (stat: { id: string; label: string; value: string; description?: string; icon?: string }) => (
    <div key={stat.id} className="text-center">
      {stat.icon && <div className="text-4xl mb-4">{stat.icon}</div>}
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
      <div className="text-lg text-gray-600">{stat.label}</div>
    </div>
  );

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>}
            {subtitle && <p className="text-xl opacity-90 max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}

        {layout === "horizontal" && <div className="flex flex-wrap justify-center gap-8">{stats.map(renderStat)}</div>}

        {layout === "grid" && <div className={`grid ${gridClasses[columns]} gap-8`}>{stats.map(renderStat)}</div>}
      </div>
    </section>
  );
}
