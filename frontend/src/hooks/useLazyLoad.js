import { useEffect, useState } from 'react';

const useLazyLoad = (params, callback) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (!callback || !params.limit) return setLoading(false);
    setLoading(true);

    const controller = new AbortController();
    callback(params, controller)
      .then(currData => {
        if (!currData) return;

        if (Array.isArray(currData)) {
          setData(prevData => prevData.concat(currData));
          setHasMore(currData.length > 0);
        } else {
          setData(prevData => {
            return [
              ...prevData,
              {
                items: currData.items,
                collections: currData.collections,
                users: currData.users,
              },
            ];
          });
          setHasMore(Object.values(currData).some(data => data.length > 0));
        }
      })
      .catch(e => console.log(e.message))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [params, callback]);

  return [data, loading, hasMore, setData];
};

export default useLazyLoad;
