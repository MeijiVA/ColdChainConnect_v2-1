interface PlaceholderPanelProps {
  title: string;
  description: string;
  icon: string;
  panelId: string;
}

export function PlaceholderPanel({
  title,
  description,
  icon,
  panelId,
}: PlaceholderPanelProps) {
  return (
    <div className="flex-1 px-4 md:px-6 lg:px-7 py-4 md:py-6 overflow-y-auto scrollbar-visible">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-rajdhani text-3xl font-bold text-white letter-spacing-tight">
            {title}
          </h1>
          <p className="text-xs text-muted mt-1">{description}</p>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-2xl border border-border p-12 flex flex-col items-center justify-center min-h-96 text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="font-rajdhani text-2xl font-bold text-navy mb-2">
          {title} Module
        </h2>
        <p className="text-muted max-w-md mb-6">{description}</p>
        <p className="text-sm text-gray-400">
          This module is coming soon. Continue prompting to fill in the contents
          of this section.
        </p>
      </div>
    </div>
  );
}
