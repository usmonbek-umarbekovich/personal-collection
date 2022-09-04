import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
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

function ManageItem({ action, handleSubmit }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserInfo();
  const { id } = useParams();
  const tagRef = useRef();
  const colRef = useRef();

  const [itemTagSkip, setItemTagSkip] = useState(0);
  const [tagSkip, setTagSkip] = useState(0);
  const [colSkip, setColSkip] = useState(0);

  const itemTagParams = useMemo(
    () => ({ limit: 10, skip: itemTagSkip }),
    [itemTagSkip]
  );
  const tagParams = useMemo(() => ({ limit: 10, skip: tagSkip }), [tagSkip]);
  const colParams = useMemo(() => ({ limit: 6, skip: colSkip }), [colSkip]);

  const itemTagCallback = useCallback(
    async (params, controller) => {
      if (action !== 'update') return null;
      return itemService.getItemTags(id)(params, controller);
    },
    [action, id]
  );
  const tagCallback = useCallback(async (params, controller) => {
    return itemService.getAllTags(params, controller);
  }, []);
  const colCallback = useCallback(
    async (params, controller) => {
      if (action === 'update') return null;
      return userService.getUserCollections(user._id)(params, controller);
    },
    [action, user._id]
  );

  let [itemTags, itemTagLoading, itemTagHasMore] = useLazyLoad(
    itemTagParams,
    itemTagCallback
  );
  let [savedTags, tagLoading, tagHasMore] = useLazyLoad(tagParams, tagCallback);
  let [savedCollections, colLoading, colHasMore] = useLazyLoad(
    colParams,
    colCallback
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
    document.title = `${capitalize(action)} Item`;
  }, [action]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (action !== 'update') return;
    if (itemTagLoading) return;
    if (itemTagHasMore) {
      setItemTagSkip(prevSkip => prevSkip + itemTagParams.limit);
    }
  }, [action, itemTagHasMore, itemTagLoading, itemTagParams.limit]);

  useEffect(() => {
    if (tagLoading) return;
    if (tagHasMore) setTagSkip(prevSkip => prevSkip + tagParams.limit);
  }, [tagHasMore, tagLoading, tagParams.limit]);

  useEffect(() => {
    if (action === 'update') return;
    if (colLoading) return;
    if (colHasMore) setColSkip(prevSkip => prevSkip + colParams.limit);
  }, [action, colHasMore, colLoading, colParams.limit]);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      collectionId: '',
      tags: [],
      picture: null,
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
      picture: Yup.mixed(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      if (action === 'update') {
        const { collectionId, ...others } = values;
        values = others;
      }

      if (values.picture) {
        const reader = new FileReader();
        reader.readAsDataURL(values.picture);
        reader.addEventListener('load', () => {
          values.picture = reader.result;
          handleRequest(values, { setSubmitting });
        });
      } else {
        const { picture, ...data } = values;
        handleRequest(data, { setSubmitting });
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  useEffect(() => {
    if (!location.state) return;

    const item = location.state;
    formik.setValues({
      ...formik.values,
      ...item,
      tags: [],
      picture: null,
      collectionId: item.collectionId._id,
    });

    if (!colRef.current) return;
    colRef.current.setValue({
      value: item.collectionId._id,
      label: capitalize(item.collectionId.name),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, location.state]);

  useEffect(() => {
    if (action !== 'update') return;
    formik.setFieldValue(
      'tags',
      itemTags.map(tag => tag.name)
    );

    if (!tagRef.current) return;
    tagRef.current.setValue(
      itemTags.map(({ name }) => ({ value: name, label: name }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, itemTags]);

  const handleImageSelect = e => {
    const image = e.target.files[0];

    if (['image/png', 'image/jpg', 'image/jpeg'].includes(image.type)) {
      formik.setFieldValue('picture', image);
      formik.validateField('picture');
    } else {
      formik.setFieldError('picture', 'You can only upload image');
    }
  };

  const handleRequest = (data, { setSubmitting }) => {
    handleSubmit({ id, data })
      .then(() => navigate(-1))
      .finally(() => setSubmitting(false));
  };

  if (!user) return null;

  return (
    <section className="py-5">
      <Container className="col-md-6 m-auto">
        <h1 className="text-center mb-5">
          {action === 'create' ? 'Add' : 'Update'} an item
        </h1>
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
              ref={colRef}
              isDisabled={action === 'update'}
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
              ref={tagRef}
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
          <Form.Group controlId="picture" className="mb-4">
            <Form.Control
              type="file"
              size="lg"
              accept="image/png, image/jpg, image/jpeg"
              onChange={handleImageSelect}
              isInvalid={!!formik.errors.picture}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.picture}
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
                {action === 'create' ? 'Adding' : 'Updating'}
              </>
            ) : (
              `${action === 'create' ? 'Add' : 'Update'} Item`
            )}
          </Button>
        </Form>
      </Container>
    </section>
  );
}

export default ManageItem;
