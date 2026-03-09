import { useEffect, useRef, useCallback } from 'react';

const InfiniteScroll = ({
  children,
  loadMore,
  hasMore,
  loading,
  threshold = 300,
  loader = null,
}) => {
  const observerRef = useRef(null);
  const loadingRef = useRef(loading);

  // Update loading ref when loading changes
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loadingRef.current) {
        loadMore();
      }
    },
    [hasMore, loadMore]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleObserver, threshold]);

  return (
    <>
      {children}
      
      {/* Observer target */}
      <div ref={observerRef} className="w-full py-4">
        {loading && (
          loader || (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )
        )}
        
        {!hasMore && !loading && (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            No more items to load
          </p>
        )}
      </div>
    </>
  );
};

export default InfiniteScroll;
