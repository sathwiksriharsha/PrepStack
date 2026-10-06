import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import playlistsData from '../data/clean/playlists.json';

type PlaylistCategory = {
  title: string;
  description: string;
  items: Array<{ url: string; title: string; img: string }>;
};

const data = playlistsData as Record<string, PlaylistCategory>;

export default function PlaylistsPage({ slug }: { slug: string }) {
  // If slug is passed as prop or from params
  const { categoryId } = useParams();
  const activeSlug = slug || categoryId;
  
  const category = activeSlug ? data[activeSlug] : null;

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Playlists not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-3 pb-10">
      <div className="container mx-auto px-4">
        <PageHeader
          title={category.title}
          description={category.description}
          stats={[{ label: 'Playlists', value: category.items.length }]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {category.items.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-200 no-underline"
            >
              {item.img && (
                <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-900 dark:text-white font-[family-name:var(--font-lexend)] text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
                  {item.title}
                </h3>
                <div className="mt-auto flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-sm">YouTube</span>
                  <span>Watch Playlist →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
