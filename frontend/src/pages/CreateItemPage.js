import { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../contexts/userInfoContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import itemService from '../services/itemService';
import userService from '../services/userService';
import useLazyLoad from '../hooks/useLazyLoad';
import { capitalize } from '../helpers';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function CreateItemPage() {
  const [tagSkip, setTagSkip] = useState(0);
  const [colSkip, setColSkip] = useState(0);
  const tagParams = useMemo(() => ({ limit: 10, skip: tagSkip }), [tagSkip]);
  const colParams = useMemo(() => ({ limit: 6, skip: colSkip }), [colSkip]);

  const { user } = useUserInfo();
  const navigate = useNavigate();

  let [savedTags, tagLoading, tagHasMore] = useLazyLoad(
    tagParams,
    itemService.getAllTags
  );
  let [savedCollections, colLoading, colHasMore] = useLazyLoad(
    colParams,
    userService.getUserCollections(user._id)
  );

  savedTags = savedTags.map(tag => {
    return {
      value: tag.name,
      label: tag.name,
    };
  });
  savedCollections = savedCollections.map(col => {
    return {
      value: col._id,
      label: capitalize(col.name),
    };
  });

  useEffect(() => {
    if (tagLoading) return;
    if (tagHasMore) setTagSkip(prevSkip => prevSkip + tagParams.limit);
  }, [tagHasMore, tagLoading, tagParams.limit]);

  useEffect(() => {
    if (colLoading) return;
    if (colHasMore) setColSkip(prevSkip => prevSkip + colParams.limit);
  }, [colHasMore, colLoading, colParams.limit]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      collectionId: '',
      tags: [],
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(30, 'Name must be at most 30 characters')
        .required('Name is required'),
      collectionId: Yup.string().required(
        'You must choose a collection for the item'
      ),
      tags: Yup.array(),
      description: Yup.string(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      itemService.createItem(values).then(() => {
        setSubmitting(false);
        navigate(-1);
      });
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  if (!user) return null;

  return (
    <section className="py-5">
      <Container className="col-md-6 m-auto">
        <h1 className="text-center mb-5">Add an item to the collection</h1>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label className="fs-4">Name</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              size="lg"
              placeholder="Enter item name"
              isInvalid={!!formik.errors.name}
              {...formik.getFieldProps('name')}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="collectionId" className="mb-3">
            <Form.Label className="fs-4">Collection</Form.Label>
            <Select
              options={savedCollections}
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
              placeholder="Enter collection for the item"
              onChange={option => {
                formik.setFieldValue('collectionId', option.value);
              }}
            />
            {formik.errors.collectionId && (
              <Form.Text className="text-danger">
                {formik.errors.collectionId}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="tags" className="mb-3">
            <Form.Label className="fs-4">Tags</Form.Label>
            <CreatableSelect
              isMulti
              options={savedTags}
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
              placeholder="Enter tags related to the item"
              onChange={option =>
                formik.setFieldValue(
                  'tags',
                  option.map(op => op.value)
                )
              }
            />
            {formik.errors.tags && (
              <Form.Text className="text-danger">
                {formik.errors.tags}
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
                Adding
              </>
            ) : (
              'Add Item'
            )}
          </Button>
        </Form>
      </Container>
    </section>
  );
}

export default CreateItemPage;
