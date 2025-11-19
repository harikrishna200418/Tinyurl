"use client";

import React from 'react';
import { Link } from '@/lib/db';

interface LinksTableProps {
  links: Link[];
  onLinkDeleted: () => void;
}

export default function LinksTable({ links, onLinkDeleted }: LinksTableProps) {

  const handleDelete = async (code: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      await fetch(`/api/links/${code}`, { method: 'DELETE' });
      onLinkDeleted();
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // small feedback could be added; keep minimal here
    } catch (e) {
      console.error('copy failed', e);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-500">Short Code</th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">Target URL</th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">Clicks</th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">Last Clicked</th>
            <th className="px-6 py-3 text-right font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {links.map((link) => (
            <tr key={link.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <a href={`/${link.code}`} className="text-blue-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                    {link.code}
                  </a>
                  <button
                    onClick={() => handleCopy(`${window.location.origin}/${link.code}`)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                    title="Copy short URL"
                  >
                    Copy
                  </button>
                  <a href={`/code/${link.code}`} className="text-sm text-gray-500 hover:text-gray-700" title="View stats">Stats</a>
                </div>
              </td>
              <td className="px-6 py-4 max-w-xs truncate" title={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                  {link.url}
                </a>
              </td>
              <td className="px-6 py-4">{link.clicks}</td>
              <td className="px-6 py-4">
                {link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleString() : 'Never'}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => handleDelete(link.code)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
