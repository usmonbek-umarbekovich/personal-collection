import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import imgSrc from '../images/showcase.png';

function Showcase() {
  return (
    <section className="bg-warning py-5 border-bottom border-dark text-md-start text-center">
      <Container>
        <Stack
          direction="horizontal"
          className="align-items-center justify-content-center justify-content-md-between">
          <div>
            <h1 className="fw-semibold" style={{ fontSize: '3rem' }}>
              Stay Curious
            </h1>
            <p className="fs-4 my-4">Store your item the right way</p>
            <Link to="/register">
              <Button variant="dark" size="lg" className="rounded-pill">
                Start Your Collection
              </Button>
            </Link>
          </div>
          <Image
            src={imgSrc}
            alt="Showcase"
            fluid
            className="w-50 d-none d-md-block"
          />
        </Stack>
      </Container>
    </section>
  );
}
export default Showcase;
