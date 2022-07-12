import { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useNavigate, useParams } from 'react-router-dom';
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

function EditCollectionPage() {
  const [skip, setSkip] = useState(0);
  let [savedTopics, loading, hasMore] = useLazyLoad(
    5,
    skip,
    collectionService.getCollectionTopics
  );

  savedTopics = [...new Set(savedTopics)].map(topic => {
    return {
      value: topic,
      label: capitalize(topic),
    };
  });

  const { user } = useUserInfo();
  const navigate = useNavigate();
  const { id } = useParams();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      topic: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      description: Yup.string(),
      topic: Yup.string().required('Please choose a topic for your collection'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      collectionService.updateCollection(id, values).then(() => {
        setSubmitting(false);
        navigate('/');
      });
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  useEffect(() => {
    if (loading) return;
    if (hasMore) setSkip(prevSkip => prevSkip + 5);
  }, [hasMore, loading]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    collectionService.getSingleCollection(id).then(data => {
      formik.setValues(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!user) return null;

  return (
    <section className="py-5">
      <Container className="col-md-6 m-auto">
        <h1 className="text-center mb-5">Create a collection</h1>
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
              value={{
                value: formik.values.topic,
                label: capitalize(formik.values.topic),
              }}
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
                Updating
              </>
            ) : (
              'Update Collection'
            )}
          </Button>
        </Form>
      </Container>
    </section>
  );
}

export default EditCollectionPage;
