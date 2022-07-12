import Stack from 'react-bootstrap/Stack';
import Spinner from 'react-bootstrap/Spinner';

function LoadingBalls() {
  return (
    <Stack
      gap="2"
      direction="horizontal"
      className="align-items-center mx-auto">
      {[1, 2, 3].map(index => (
        <Spinner key={index} animation="grow" role="status" variant="primary" />
      ))}
      <div className="fs-4 fw-bolder">Loading</div>
      {[1, 2, 3].map(index => (
        <Spinner key={index} animation="grow" role="status" variant="primary" />
      ))}
    </Stack>
  );
}
export default LoadingBalls;
