'use client';
import { FC, useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { SanityBlogPost, SanityBlogTag, SanityBlogTopic } from '../../../types/sanity';
import SelectComponent from '../../molecules/select';
import { Icon } from '../../atoms';
import { BlogPagination } from '../../molecules/pagination/blogPagination';
import { ResourceCard } from '../../organisms/resourceCard';

interface ResourceListingProps {
  items: SanityBlogPost[];
  topics?: SanityBlogTopic[] | null;
  tags?: SanityBlogTag[] | null;
  totalPages: number;
  cardsPerRow?: 2 | 3 | 4;
  topicsPlaceholder?: string;
  tagsPlaceholder?: string;
}

export const ResourceListing: FC<ResourceListingProps> = ({
  items,
  topics,
  tags,
  totalPages,
  cardsPerRow = 3,
  topicsPlaceholder = 'All Topics',
  tagsPlaceholder = 'All Tags',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter items based on search query and selected filters
  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.title?.toLowerCase().includes(query) ||
          item.excerpt?.toLowerCase().includes(query)
      );
    }

    // Topic/Industry filter (works for both blog posts with topics and case studies with industries)
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(item => {
        // Check for topics field (blog posts) or industries field (case studies)
        const itemTopics = item.topics || (item as any).industries;
        return itemTopics?.some((topic: any) => selectedTopics.includes(topic.name || ''));
      });
    }

    // Tag/WorkType filter (works for both blog posts with tags and case studies with workTypes)
    if (selectedTags.length > 0) {
      filtered = filtered.filter(item => {
        // Check for tags field (blog posts) or workTypes field (case studies)
        const itemTags = item.tags || (item as any).workTypes;
        return itemTags?.some((tag: any) => selectedTags.includes(tag.name || ''));
      });
    }

    return filtered;
  }, [items, searchQuery, selectedTopics, selectedTags]);

  const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage, [currentPage]);
  const endIndex = useMemo(() => startIndex + itemsPerPage, [startIndex]);

  const paginatedPosts  = useMemo(() => {
    if (!filteredItems) return [];
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, startIndex, endIndex])

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/blog?page=${page}`, { scroll: false });
    // Scroll to top of blog listing
    const articleGrid = document.getElementById('article-grid');
    if (articleGrid) {
      const rect = articleGrid.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top - 100;
      window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
    setCurrentPage(1);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTopics([]);
    setSelectedTags([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery.trim() || selectedTopics.length > 0 || selectedTags.length > 0;

  return (
    <div className="flex flex-col gap-12">
      <div>
        <div className="rounded bg-background">
          {/* Filters */}
          <div className="py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Topic Filter */}
            {topics && topics.length > 0 && (
              <div className="flex-1">
                <SelectComponent
                  multiple
                  items={topics.map(topic => ({
                    value: topic.name || '',
                    label: topic.name || '',
                  }))}
                  value={selectedTopics}
                  onValueChange={(values) => {
                    setSelectedTopics(values);
                    setCurrentPage(1);
                  }}
                  placeholder={topicsPlaceholder}
                />
              </div>
            )}

            {/* Tag Filter */}
            {tags && tags.length > 0 && (
              <div className="flex-1">
                <SelectComponent
                  multiple
                  items={tags.map(tag => ({
                    value: tag.name || '',
                    label: tag.name || '',
                  }))}
                  value={selectedTags}
                  onValueChange={(values) => {
                    setSelectedTags(values);
                    setCurrentPage(1);
                  }}
                  placeholder={tagsPlaceholder}
                />
              </div>
            )}

            {/* Search Input */}
            <div className="flex items-center px-5 py-2.5 rounded border border-secondary bg-input shadow-xs">
              <Icon icon="search-lg" size={16} className="mr-2 text-body" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1 bg-transparent outline-none text-md text-body placeholder:text-body/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 p-1 hover:bg-rest rounded-full text-body"
                >
                  <Icon icon="x-close" size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      {hasActiveFilters && (
        <div className="flex justify-between items-center">
          <p className="text-md text-body">
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
          </p>
          <button
            onClick={clearAllFilters}
            className="text-sm font-medium text-link hover:text-link-hover"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Blog Grid */}
      {paginatedPosts.length > 0 ? (
        <div
          className={`grid grid-cols-1 gap-6 ${
            cardsPerRow === 2 
              ? 'md:grid-cols-2' 
              : cardsPerRow === 3 
                ? 'md:grid-cols-2 lg:grid-cols-3' 
                : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}
          id="article-grid"
        >
          {/* {paginatedPosts.map(post => (
            <ResourceCard key={post._id} {...post} />
          ))} */}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-body">
            {hasActiveFilters
              ? 'No posts found matching your search criteria'
              : 'No posts available'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 text-sm font-medium text-lavender-600 border border-lavender-600 rounded-md hover:bg-lavender-50 transition-colors"
            >
              Clear filters and show all posts
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredItems.length > itemsPerPage && (
        <div className="flex justify-center mt-8">
          <BlogPagination
            currentPage={currentPage}
            totalItems={filteredItems.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

