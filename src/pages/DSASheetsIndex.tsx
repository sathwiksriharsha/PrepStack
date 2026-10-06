import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui';

const sheets = [
  {
    id: 'striver-a2z-dsa-sheet',
    title: 'Strivers A2Z DSA Sheet',
    description: 'This course is created for students who want to learn DSA from start to finish in a clear and well-structured way.',
    creator: 'Striver (TakeUForward)',
    problems: 455
  },
  {
    id: 'love-babbar-dsa-sheet',
    title: 'Love Babbar DSA Sheet',
    description: 'A comprehensive list of 450 DSA problems covering all major data structures and algorithms.',
    creator: 'Love Babbar',
    problems: 450
  },
  {
    id: 'neetcode-dsa-sheet',
    title: 'Neetcode 150 DSA Sheet',
    description: 'A curated list of 150 Leetcode problems designed to help you ace your technical interviews.',
    creator: 'NeetCode',
    problems: 150
  }
];

export default function DSASheetsIndex() {
  return (
    <div className="min-h-screen pt-3 pb-10">
      <div className="container mx-auto px-4">
        <PageHeader 
          title="Top 7+ Best DSA Sheets for Coding Interviews" 
          description="Master Data Structures and Algorithms with the world's most popular curated problem sheets."
          stats={[{ label: 'Total Sheets', value: '7+' }]}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {sheets.map(sheet => (
            <Link key={sheet.id} to={`/preparation/dsa-sheets/${sheet.id}`} className="group bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-200 no-underline flex flex-col h-full">
              <div className="mb-4">
                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 mb-3">
                  {sheet.creator}
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white font-[family-name:var(--font-lexend)] text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                  {sheet.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                  {sheet.description}
                </p>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                 <span className="text-xs font-semibold text-gray-500">{sheet.problems} Problems</span>
                 <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                   Start Practice →
                 </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
