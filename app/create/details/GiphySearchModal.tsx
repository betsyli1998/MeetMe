'use client';

import { useState } from 'react';
import { GiphyImage } from '@/types';

interface GiphySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  initialQuery: string;
}

export default function GiphySearchModal({
  isOpen,
  onClose,
  onSelectImage,
  initialQuery,
}: GiphySearchModalProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<GiphyImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setOffset(0);
    try {
      const response = await fetch('/api/giphy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, limit: 12, offset: 0 }),
      });
      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error('Error searching GIPHY:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    const newOffset = offset + 12;
    setLoading(true);
    try {
      const response = await fetch('/api/giphy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, limit: 12, offset: newOffset }),
      });
      const data = await response.json();
      if (data.success) {
        setResults([...results, ...data.data]);
        setOffset(newOffset);
      }
    } catch (error) {
      console.error('Error loading more GIFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = (url: string) => {
    onSelectImage(url);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Search Event Images</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for GIFs..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="mt-2 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-300"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Results Grid */}
        {results.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {results.map((gif) => (
                <div
                  key={gif.id}
                  onClick={() => handleSelectImage(gif.images.downsized.url)}
                  className="cursor-pointer rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                >
                  <img
                    src={gif.images.downsized.url}
                    alt={gif.title}
                    className="w-full h-40 object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="text-primary hover:underline disabled:text-gray-400"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          </>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && searchQuery && (
          <p className="text-center text-gray-500">
            No GIFs found. Try a different search term.
          </p>
        )}
      </div>
    </div>
  );
}
