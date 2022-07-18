import { useEffect, useState } from 'react';
import axios from 'axios';

const useLazyLoad = (params, callback) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);

    const controller = new AbortController();
    callback(params, controller)
      .then(currData => {
        setData(prevData => prevData.concat(currData));
        setHasMore(currData.length > 0);
      })
      .catch(e => {
        if (axios.isCancel(e)) return;
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [params, callback]);

  return [data, loading, hasMore];
};

export default useLazyLoad;
