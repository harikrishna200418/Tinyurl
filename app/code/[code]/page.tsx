
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { Link } from '@/lib/db';

export default function CodeStatsPage() {
  const params = useParams();
  const code = params.code as string;
  const [link, setLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (code) {
      const fetchLink = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/links/${code}`);
          if (response.status === 404) {
            throw new Error('Link not found.');
          }
          if (!response.ok) {
            throw new Error('Failed to fetch link details.');
          }
          const data = await response.json();
          setLink(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
          setLoading(false);
        }
      };
      fetchLink();
    }
  }, [code]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto p-4">
        <div className="my-8">
          {loading && <p className="text-center">Loading stats...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {link && (
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Stats for /{link.code}</h2>
              <div className="space-y-3">
                <p><strong>Short Code:</strong> {link.code}</p>
                <p><strong>Original URL:</strong> <a href={link.url} className="text-blue-600 hover:underline break-all">{link.url}</a></p>
                <p><strong>Total Clicks:</strong> {link.clicks}</p>
                <p><strong>Last Clicked:</strong> {link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleString() : 'Never'}</p>
                <p><strong>Created:</strong> {new Date(link.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
