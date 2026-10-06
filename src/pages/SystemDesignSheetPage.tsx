import { ProblemTable } from '../components/ProblemTable';
import sdData from '../data/clean/system-design.json';

const data = sdData as {
  title: string; description: string; totalQuestions: number; storageKey: string;
  questions: Array<{ id: number; title: string; type: string; articleLink: string; ytLink: string; }>;
};

// Map System Design questions to ProblemTable format
const mappedQuestions = data.questions.map((q, i) => ({
  index: i + 1,
  title: q.title,
  tags: [q.type],
  difficulty: 'Hard', // System Design defaults to Hard
  provider: q.ytLink ? 'YouTube' : q.articleLink ? 'Article' : undefined,
  providerUrl: q.ytLink || q.articleLink || undefined,
}));

export default function SystemDesignSheetPage() {
  return (
    <ProblemTable
      title={data.title}
      description={data.description}
      questions={mappedQuestions}
      storageKey={data.storageKey}
      totalQuestions={data.totalQuestions}
      showPopularity={false}
      showProvider={true}
      showTags={true}
    />
  );
}
