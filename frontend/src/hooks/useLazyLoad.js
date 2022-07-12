import { useEffect, useState } from 'react';
import axios from 'axios';

const useTagGet = (limit, skip, callback) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);

    const controller = new AbortController();
    callback(limit, skip, controller)
      .then(currData => {
        setData(prevData => prevData.concat(currData));
        setHasMore(currData.length > 0);
      })
      .catch(e => {
        if (axios.isCancel(e)) return;
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [limit, skip, callback]);

  return [data, loading, hasMore];
};

export default useTagGet;
