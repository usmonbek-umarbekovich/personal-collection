import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { capitalize } from '../helpers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import userService from '../services/userService';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useUserInfo } from '../contexts/userInfoContext';

function Register({ action }) {
  const { registerUser, updateUser, user } = useUserInfo();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${capitalize(action)} Account`;
  }, [action]);

  useEffect(() => {
    if (user && action === 'create') return navigate('/');
    if (!user && action === 'update') return navigate('/login');
  }, [user, action, navigate]);

  const handleImageSelect = e => {
    const image = e.target.files[0];

    if (['image/png', 'image/jpg', 'image/jpeg'].includes(image.type)) {
      formik.setFieldValue('avatar', image);
      formik.validateField('avatar');
    } else {
      formik.setFieldError('avatar', 'You can only upload image');
    }
  };

  const handleRequest = (data, { setSubmitting }) => {
    const callback = {
      create: registerUser,
      update: updateUser,
    };

    callback[action]({ id, data })
      .then(() => {
        if (action === 'update') navigate(-1);
      })
      .finally(() => setSubmitting(false));
  };

  const schema = Yup.object({
    firstName: Yup.string()
      .max(20, 'First Name must be 20 characters at most')
      .required('First Name is required'),
    lastName: Yup.string()
      .max(20, 'First Name must be 20 characters at most')
      .required('Last Name is required'),
    email: Yup.string()
      .email()
      .max(30, 'Email must be 30 characters at most')
      .required('Email is required'),
    bio: Yup.string().max(250, 'Bio must be 250 characters at most'),
    password: Yup.string().required('Password is required'),
    avatar: Yup.mixed(),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      bio: '',
      avatar: null,
    },
    validationSchema: action === 'create' ? schema : schema.omit(['password']),
    onSubmit: (values, { setSubmitting }) => {
      if (values.avatar) {
        const reader = new FileReader();
        reader.readAsDataURL(values.avatar);
        reader.addEventListener('load', () => {
          values.avatar = reader.result;
          handleRequest(values, { setSubmitting });
        });
      } else {
        handleRequest(values, { setSubmitting });
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  useEffect(() => {
    if (action !== 'update') return;
    userService.getSingleUser(id).then(userData => {
      const formikData = {
        firstName: userData.name.first,
        lastName: userData.name.last,
        email: userData.email,
        bio: userData.bio,
        avatar: userData.avatar,
      };
      formik.setValues(formikData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, action]);

  if (action === 'create' && user) return null;
  if (action === 'update' && !user) return null;

  return (
    <Container className="col-md-6 m-auto py-5">
      <h1 className="text-center mt-2 mb-4">
        {action === 'create' ? 'Create an account' : 'Update account info'}
      </h1>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Row className="mb-3 gap-3 gap-lg-0">
          <Form.Group as={Col} lg="6" controlId="firstName">
            <Form.Label className="fs-4">First Name</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              size="lg"
              placeholder="First Name"
              isInvalid={!!formik.errors.firstName}
              {...formik.getFieldProps('firstName')}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.firstName}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} lg="6" controlId="lastName">
            <Form.Label className="fs-4">Last Name</Form.Label>
            <Form.Control
              type="text"
              size="lg"
              placeholder="Last Name"
              isInvalid={!!formik.errors.lastName}
              {...formik.getFieldProps('lastName')}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.lastName}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Form.Group controlId="bio" className="mb-3">
          <Form.Label className="fs-4">Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            size="lg"
            placeholder="Tell us something about you"
            isInvalid={!!formik.errors.bio}
            {...formik.getFieldProps('bio')}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.bio}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label className="fs-4">Email Address</Form.Label>
          <Form.Control
            type="email"
            size="lg"
            placeholder="Enter Email"
            isInvalid={!!formik.errors.email}
            {...formik.getFieldProps('email')}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.email}
          </Form.Control.Feedback>
        </Form.Group>
        {action === 'create' && (
          <Form.Group controlId="password" className="mb-3">
            <Form.Label className="fs-4">Password</Form.Label>
            <Form.Control
              type="password"
              size="lg"
              placeholder="Enter Password"
              autoComplete="off"
              isInvalid={!!formik.errors.password}
              {...formik.getFieldProps('password')}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </Form.Group>
        )}
        <Form.Group controlId="avatar" className="mb-4">
          <Form.Control
            type="file"
            size="lg"
            accept="image/png, image/jpg, image/jpeg"
            onChange={handleImageSelect}
            isInvalid={!!formik.errors.avatar}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.avatar}
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
              {action === 'create' ? 'Signing Up' : 'Updating info'}
            </>
          ) : action === 'create' ? (
            'Sign Up'
          ) : (
            'Update account'
          )}
        </Button>
      </Form>
    </Container>
  );
}
export default Register;
