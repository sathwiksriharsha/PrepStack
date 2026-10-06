import { useState } from 'react';
import { PageHeader } from '../components/ui';
import emailsData from '../data/clean/cold-emails.json';
import { Copy, Check } from 'lucide-react';

const data = emailsData as unknown as {
  categories: Array<{ title: string; templates: Array<{ id: string; title: string; role: string; category: string; }> }>;
  templates: Record<string, { template: { subject: string; body: string; tips: string[] } }>;
};

export default function ColdEmailIndex() {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(data.categories[0].templates[0].id);
  const [copied, setCopied] = useState(false);

  const templateDetail = activeTemplate ? data.templates[activeTemplate] : null;

  const handleCopy = () => {
    if (templateDetail && templateDetail.template) {
      const textToCopy = `Subject: ${templateDetail.template.subject}\n\n${templateDetail.template.body}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-3 pb-10 flex flex-col md:flex-row gap-6 container mx-auto px-4">
      {/* Sidebar for Categories */}
      <div className="w-full md:w-72 shrink-0">
        <div className="sticky top-20 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
          {data.categories.map(cat => (
            <div key={cat.title} className="mb-6 last:mb-0">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                {cat.title}
              </h3>
              <div className="space-y-1">
                {cat.templates.map(tmpl => (
                  <button
                    key={tmpl.id}
                    onClick={() => setActiveTemplate(tmpl.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-[family-name:var(--font-lexend)] transition-colors line-clamp-2
                      ${activeTemplate === tmpl.id
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                  >
                    {tmpl.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <PageHeader
          title="Cold Email Templates"
          description="High-converting cold email templates for job referrals, networking, and reaching out to recruiters/founders."
          stats={[{ label: 'Templates', value: Object.keys(data.templates).length }]}
        />

        {templateDetail ? (
           <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
             <div className="bg-gray-50 dark:bg-[#111] px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                <h2 className="font-semibold text-gray-900 dark:text-white font-[family-name:var(--font-lexend)]">
                  {data.categories.flatMap(c => c.templates).find(t => t.id === activeTemplate)?.title}
                </h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
             </div>
             <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subject</h4>
                  <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-gray-100">
                    {templateDetail.template?.subject}
                  </div>
                </div>
                <div>
                   <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Body</h4>
                   <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {templateDetail.template?.body}
                      </pre>
                   </div>
                </div>
                {templateDetail.template?.tips && templateDetail.template.tips.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pro Tips</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {templateDetail.template.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                  </div>
                )}
             </div>
           </div>
        ) : (
          <div className="py-12 text-center text-gray-500 text-sm">Select a template to view.</div>
        )}
      </div>
    </div>
  );
}
