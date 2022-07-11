import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUserInfo } from '../contexts/userInfoContext';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function Login() {
  const { loginUser } = useUserInfo();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email().required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      loginUser(values).then(() => setSubmitting(false));
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <Container className="col-md-6 m-auto">
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label className="fs-4">Email Address</Form.Label>
          <Form.Control
            autoFocus
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
        <Form.Group controlId="password" className="mb-4">
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
        <Button
          type="submit"
          className="w-100"
          size="lg"
          variant="dark"
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
              Logging In
            </>
          ) : (
            'Login'
          )}
        </Button>
      </Form>
    </Container>
  );
}
export default Login;
