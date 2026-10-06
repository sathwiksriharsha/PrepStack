export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen pt-3 pb-10 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-lexend)] text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-gray-500">This section is currently under construction in the local build.</p>
      </div>
    </div>
  );
}
