
"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import AddLinkForm from "@/components/AddLinkForm";
import LinksTable from "@/components/LinksTable";
import type { Link as PrismaLink } from '@prisma/client';

export default function Home() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/links');
      if (!response.ok) {
        throw new Error('Failed to fetch links.');
      }
      const data = await response.json();
      setLinks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto p-4">
        <div className="my-8">
          <AddLinkForm onLinkAdded={fetchLinks} />
        </div>
        <div className="my-8">
          {loading && <p className="text-center">Loading links...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && links.length === 0 && (
            <div className="text-center p-8 bg-white border rounded-lg shadow-sm">
              <h3 className="text-lg font-medium">No links yet!</h3>
              <p className="text-gray-500">Use the form above to create your first short link.</p>
            </div>
          )}
          {!loading && !error && links.length > 0 && (
            <LinksTable links={links} onLinkDeleted={fetchLinks} />
          )}
        </div>
      </main>
    </div>
  );
}
