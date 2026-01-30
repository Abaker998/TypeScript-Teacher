import { Metadata } from 'next';
import { getAllComparisons } from '@/data/comparisons';
import ComparisonCard from '@/components/ComparisonCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Behind the Code',
  description: 'Explore the architectural decisions and trade-offs behind the TypeScript Teacher app',
};

/**
 * Why We Built It This Way page
 *
 * Displays architectural decision comparisons showing:
 * - What we chose for the app
 * - What alternatives we considered
 * - The pros/cons of each option
 * - Our reasoning for the final decision
 *
 * This page teaches learners about real-world software architecture trade-offs.
 */
export default function WhyWeBuiltItThisWayPage() {
  const comparisons = getAllComparisons();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-purple-600 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gradient-purple mb-2">Behind the Code</h1>
          <p className="text-lg text-gray-600">
            Explore the architectural decisions and trade-offs we made building this app.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Intro section */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
          <p className="text-gray-700">
            Building a teaching app involves many decisions. On this page, we explain the key choices we made and why.
            Each card shows the alternatives we considered, their pros and cons, and our reasoning. This is a great way
            to understand real-world trade-offs in software architecture.
          </p>
        </div>

        {/* Comparison Cards */}
        <div>
          {comparisons.map((comparison) => (
            <ComparisonCard key={comparison.id} comparison={comparison} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-gray-600 mb-4">
            Ready to dive deeper? Explore the lessons to see these concepts in action.
          </p>
          <Link
            href="/lessons/variables-and-types"
            className="inline-block bg-gradient-purple hover:opacity-90 text-white font-semibold py-2 px-6 rounded-lg transition-opacity"
          >
            Start Learning
          </Link>
        </div>
      </main>
    </div>
  );
}
