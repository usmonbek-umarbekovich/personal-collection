import { useEffect, useState } from 'react';

const useLazyLoad = (params, callback) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (!callback) return;
    setLoading(true);

    const controller = new AbortController();
    callback(params, controller)
      .then(currData => {
        if (!currData) return;

        setData(prevData => prevData.concat(currData));
        setHasMore(currData.length > 0);
      })
      .catch(e => {
        console.log(e.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [params, callback]);

  return [data, loading, hasMore, setData];
};

export default useLazyLoad;
