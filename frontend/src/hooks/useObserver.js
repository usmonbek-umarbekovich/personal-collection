import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import useLazyLoad from './useLazyLoad';

const useObserver = (query, callback, { once = false } = {}) => {
  const [skip, setSkip] = useState(0);
  const params = useMemo(() => ({ skip, ...query }), [query, skip]);
  const [data, loading, hasMore, setData] = useLazyLoad(params, callback);

  useEffect(() => {
    setSkip(0);
    setData([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, query]);

  const observer = useRef();
  const lastElement = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      if (once) return;

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setSkip(prevSkip => prevSkip + query.limit);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, query.limit, once]
  );

  return [data, lastElement, loading, setData];
};

export default useObserver;
