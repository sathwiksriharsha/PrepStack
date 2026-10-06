import { useParams } from 'react-router-dom';
import { ProblemTable } from '../components/ProblemTable';
import companyQuestionsData from '../data/clean/company-questions.json';

const allQuestions = companyQuestionsData as Record<string, {
  companyName: string; description: string; logoSrc: string;
  totalQuestions: number; storageKey: string; slug: string; href: string;
  questions: Array<{
    index: number; title: string; tags: string[];
    provider: string; providerUrl: string; difficulty: string; popularity: string;
  }>;
}>;

export default function CompanyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? allQuestions[slug] : null;

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Company Not Found</h2>
          <p className="text-gray-500">The company sheet you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <ProblemTable
      title={`${data.companyName} DSA Interview Questions`}
      description={data.description}
      questions={data.questions}
      storageKey={data.storageKey}
      totalQuestions={data.totalQuestions}
      showPopularity={true}
      showProvider={true}
      showTags={true}
    />
  );
}
