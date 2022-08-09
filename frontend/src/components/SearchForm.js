import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';

function SearchForm() {
  const setSearchParams = useSearchParams()[1];
  const [term, setTerm] = useState('');
  const prevTermRef = useRef('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!term.trim()) {
      if (location.pathname === '/search') return navigate(-1); // TODO: Navigate to PREV
    } else {
      const termChanged = !(prevTermRef.current === term);
      if (location.pathname !== '/search' && termChanged)
        return navigate('/search');
      if (location.pathname !== '/search' && !termChanged) return setTerm('');

      const timeout = setTimeout(
        () => setSearchParams({ term }, { replace: true }),
        300
      );
      return () => clearTimeout(timeout);
    }
  }, [term, location.pathname, navigate, setSearchParams]);

  useEffect(() => {
    prevTermRef.current = term;
  }, [term]);

  return (
    <Form className="search-form" onSubmit={e => e.preventDefault()}>
      <Form.Control
        type="search"
        placeholder="Search for everything"
        className="me-2"
        aria-label="Search"
        value={term}
        onChange={e => setTerm(e.target.value)}
      />
    </Form>
  );
}
export default SearchForm;
