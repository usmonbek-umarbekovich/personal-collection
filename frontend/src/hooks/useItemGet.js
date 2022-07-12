import { useEffect, useState } from 'react';
import axios from 'axios';
import itemService from '../services/itemService';

const useItemGet = (limit, skip) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);

    const controller = new AbortController();
    itemService
      .getItems(limit, skip, controller)
      .then(data => {
        setItems(prevBooks => prevBooks.concat(data));
        setHasMore(data.length > 0);
        setLoading(false);
      })
      .catch(e => {
        if (axios.isCancel(e)) return;
      });
    return () => controller.abort();
  }, [limit, skip]);

  return { loading, items, hasMore };
};

export default useItemGet;
