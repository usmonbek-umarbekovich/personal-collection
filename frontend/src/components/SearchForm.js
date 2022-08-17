import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function SearchForm() {
  const [term, setTerm] = useState('');
  const [type, setType] = useState({ label: 'All Documents', value: 'all' });
  const setSearchParams = useSearchParams()[1];
  const prevTermRef = useRef('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!term.trim()) {
      if (location.pathname === '/search') return navigate(-1);
    } else {
      const termChanged = !(prevTermRef.current === term);
      if (location.pathname !== '/search') {
        if (termChanged) return navigate('/search');
        else return setTerm('');
      }

      const timeout = setTimeout(
        () => setSearchParams({ term, type: type.value }, { replace: true }),
        300
      );
      return () => clearTimeout(timeout);
    }
  }, [term, type.value, location.pathname, navigate, setSearchParams]);

  useEffect(() => {
    prevTermRef.current = term;
  }, [term]);

  return (
    <Form className="search-form me-2" onSubmit={e => e.preventDefault()}>
      <InputGroup className="justify-content-end">
        <Form.Control
          type="search"
          placeholder="Search for everything"
          aria-label="Search"
          className="w-50"
          value={term}
          onChange={e => setTerm(e.target.value)}
        />
        <DropdownButton title={type.label} align="end">
          <Dropdown.Item
            eventKey="all"
            active={type.value === 'all'}
            onClick={() => setType({ label: 'All Documents', value: 'all' })}>
            All Documents
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            eventKey="collection"
            active={type.value === 'collection'}
            onClick={() =>
              setType({ label: 'Collections', value: 'collection' })
            }>
            Collections
          </Dropdown.Item>
          <Dropdown.Item
            eventKey="item"
            active={type.value === 'item'}
            onClick={() => setType({ label: 'Items', value: 'item' })}>
            Items
          </Dropdown.Item>
          <Dropdown.Item
            eventKey="user"
            active={type.value === 'user'}
            onClick={() => setType({ label: 'Users', value: 'user' })}>
            Users
          </Dropdown.Item>
        </DropdownButton>
      </InputGroup>
    </Form>
  );
}
export default SearchForm;
