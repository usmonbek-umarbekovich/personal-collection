import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { useUserInfo } from '../contexts/userInfoContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import collectionService from '../services/collectionService';
import useLazyLoad from '../hooks/useLazyLoad';
import { capitalize } from '../helpers';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function ManageCollection({ action, handleSubmit }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserInfo();
  const { id } = useParams();
  const topicRef = useRef();

  const [skip, setSkip] = useState(0);
  const params = useMemo(() => ({ limit: 5, skip }), [skip]);
  let [savedTopics, loading, hasMore] = useLazyLoad(
    params,
    collectionService.getAllTopics
  );

  savedTopics = [...new Set(savedTopics)].map(topic => {
    return {
      value: topic,
      label: capitalize(topic),
    };
  });

  useEffect(() => {
    document.title = `${capitalize(action)} Collection`
  }, [action])

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (loading) return;
    if (hasMore) setSkip(prevSkip => prevSkip + 5);
  }, [hasMore, loading]);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      topic: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(30, 'Name must be at most 30 characters')
        .required('Name is required'),
      topic: Yup.string()
        .max(30, 'Topic name must be at most 30 characters')
        .required('Please choose a topic for your collection'),
      description: Yup.string(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit({ id, data: values }).then(() => {
        setSubmitting(false);
        navigate(-1);
      });
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  useEffect(() => {
    if (!location.state) return;

    const collection = location.state;
    formik.setValues({
      ...formik.values,
      ...collection,
    });

    topicRef.current.setValue({
      value: collection.topic,
      label: capitalize(collection.topic),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!user) return null;

  return (
    <section className="py-5">
      <Container className="col-md-6 m-auto">
        <h1 className="text-center mb-5">
          {action === 'create' ? 'Create' : 'Update'} a collection
        </h1>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label className="fs-4">Name</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              size="lg"
              placeholder="Enter collection name"
              isInvalid={!!formik.errors.name}
              {...formik.getFieldProps('name')}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="topic" className="mb-3">
            <Form.Label className="fs-4">Topic</Form.Label>
            <CreatableSelect
              ref={topicRef}
              options={savedTopics}
              className="fs-5"
              styles={{
                placeholder: provided => ({
                  ...provided,
                  paddingLeft: '0.25rem',
                }),
                input: provided => ({
                  ...provided,
                  padding: '0.25rem',
                }),
              }}
              placeholder="Enter collection topic"
              onChange={option => formik.setFieldValue('topic', option.value)}
            />
            {formik.errors.topic && (
              <Form.Text className="text-danger">
                {formik.errors.topic}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="description" className="mb-4">
            <Form.Label className="fs-4">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              size="lg"
              placeholder="Describe your collection"
              isInvalid={!!formik.errors.description}
              {...formik.getFieldProps('description')}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.description}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            type="submit"
            className="w-100"
            size="lg"
            disabled={formik.isSubmitting}>
            {formik.isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
                {action === 'create' ? 'Creating' : 'Updating'}
              </>
            ) : (
              `${action === 'create' ? 'Create' : 'Update'} collection`
            )}
          </Button>
        </Form>
      </Container>
    </section>
  );
}

export default ManageCollection;
