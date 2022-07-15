import { useEffect, useState } from 'react';
import collectionService from '../services/collectionService';
import { useParams } from 'react-router-dom';
import Items from '../components/Items';
import Tags from '../components/Tags';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function SingleCollection() {
  const [collection, setCollection] = useState();
  const { id } = useParams();

  useEffect(() => {
    collectionService.getSingleCollection(id).then(data => setCollection(data));
  }, [id]);

  if (!collection) return null;

  return (
    <main className="py-lg-5 py-2 px-2">
      <Container fluid="md">
        <Row className="justify-content-between align-items-start">
          <Tags callback={collectionService.getCollectionTags(id)} />
          <Items callback={collectionService.getCollectionItems(id)} />
        </Row>
      </Container>
    </main>
  );
}
export default SingleCollection;
