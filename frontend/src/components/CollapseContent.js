import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaEllipsisH } from 'react-icons/fa';

function CollapseContent({
  children,
  controlId,
  className = '',
  Icon = FaEllipsisH,
  iconSize = 3,
  btnProps = {},
  listProps = {},
}) {
  btnProps = {
    style: { width: '2.75rem', height: '2.75rem' },
    ...btnProps,
    className: classNames('d-flex rounded-circle p-1', btnProps.className),
  };
  listProps = {
    ...listProps,
    className: classNames(
      'position-absolute top-100 mt-2',
      listProps.className
    ),
  };
  iconSize = 7 - iconSize;

  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const handleBlur = (e, id) => {
    if (!e.relatedTarget || !e.relatedTarget.closest(`#${id}`)) {
      return setOpen(false);
    }
  };

  return (
    <div
      className={classNames('position-relative', className)}
      style={{ zIndex: 1000 }}>
      <Button
        onClick={() => setOpen(!open)}
        onBlur={e => handleBlur(e, controlId)}
        aria-controls={controlId}
        aria-expanded={open}
        {...btnProps}>
        <Icon className={`m-auto fs-${iconSize}`} />
      </Button>
      <Collapse in={open} timeout={200}>
        <ListGroup id={controlId} {...listProps}>
          {children}
        </ListGroup>
      </Collapse>
    </div>
  );
}

export default CollapseContent;
