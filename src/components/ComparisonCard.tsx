'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Comparison } from '@/types/comparison';

interface ComparisonCardProps {
  comparison: Comparison;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ comparison }) => {
  return (
    <div className="comparison-card bg-white border-2 border-purple-200 rounded-lg p-6 mb-6">
      {/* Title */}
      <h3 className="text-2xl font-bold mb-2">{comparison.title}</h3>
      <p className="text-gray-600 mb-6 text-lg">{comparison.question}</p>

      {/* Options Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 font-semibold">Option</th>
              <th className="px-4 py-2 font-semibold">Pros</th>
              <th className="px-4 py-2 font-semibold">Cons</th>
            </tr>
          </thead>
          <tbody>
            {comparison.options.map((option, i) => (
              <tr
                key={i}
                className={`border-b ${
                  option.chosen ? 'bg-purple-50' : 'bg-white'
                }`}
              >
                <td className="px-4 py-4">
                  <span className="font-semibold">{option.name}</span>
                  {option.chosen && (
                    <span className="ml-2 inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded">
                      ✓ Chosen
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <ul className="space-y-2">
                    {option.pros.map((pro, j) => (
                      <li key={j} className="text-green-700">
                        <span className="font-semibold">+ {pro.item}</span>
                        <div className="text-sm text-gray-600">{pro.description}</div>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-4">
                  <ul className="space-y-2">
                    {option.cons.map((con, j) => (
                      <li key={j} className="text-red-700">
                        <span className="font-semibold">- {con.item}</span>
                        <div className="text-sm text-gray-600">{con.description}</div>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reasoning */}
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
        <h4 className="font-semibold text-purple-900 mb-2">Why We Chose This</h4>
        <div className="text-gray-700 prose prose-sm max-w-none">
          <ReactMarkdown>{comparison.reasoning}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;
