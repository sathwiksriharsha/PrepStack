import { Link } from 'react-router-dom';
import siteMapData from '../data/clean/site-map.json';
import { PageHeader } from '../components/ui';

// Simple mapping for icons since we can't dynamic import lucide react icons easily in the loop without mapping
import { FileCode, Building2, Fingerprint, BadgeDollarSign, Database, Boxes, MonitorPlay, BookOpen, Users, Sparkles, MessageSquare, Mail, NotebookText, FileText } from 'lucide-react';
const iconMap: Record<string, React.ElementType> = {
  FileCode, Building2, Fingerprint, BadgeDollarSign, Database, Boxes,
  MonitorPlay, BookOpen, Users, Sparkles, MessageSquare, Mail, NotebookText, FileText
};

export default function Dashboard() {
  return (
    <div className="min-h-screen pt-3 pb-10">
      <div className="container mx-auto px-4">
        <PageHeader
          title="Interview Preparation Dashboard"
          description="Track your progress across Data Structures, System Design, SQL, and Behavioral rounds."
        />

        <div className="space-y-10">
          {Object.entries(siteMapData.sections).map(([key, section]) => (
            <section key={key}>
              <h2 className="text-xl font-bold font-[family-name:var(--font-lexend)] text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                {section.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {section.items.map(item => {
                  const Icon = iconMap[item.icon] || FileCode;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="group flex flex-col p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200 no-underline"
                    >
                      <div className="size-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white font-[family-name:var(--font-lexend)] mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-500 mt-auto">Click to view section →</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
