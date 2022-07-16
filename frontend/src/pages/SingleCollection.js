import { useEffect, useState } from 'react';
import collectionService from '../services/collectionService';
import { useParams } from 'react-router-dom';
import Items from '../components/Items';
import Tags from '../components/Tags';
import AuthorInfo from '../components/AuthorInfo';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function SingleCollection() {
  const [collection, setCollection] = useState();
  const { id } = useParams();

  useEffect(() => {
    collectionService.getSingleCollection(id).then(setCollection);
  }, [id]);

  if (!collection) return null;

  return (
    <main>
      <section className="border-bottom py-lg-4 px-2">
        <Container fluid="md">
          <AuthorInfo
            size="lg"
            user={collection.user}
            createdAt={collection.createdAt}
          />
          <h1 className="lh-base">{collection.name}</h1>
          {collection.description && (
            <p className="text-secondary fs-4">{collection.description}</p>
          )}
        </Container>
      </section>
      <section className="py-lg-5 px-2">
        <Container fluid="md">
          <Row className="justify-content-between align-items-start">
            <Tags callback={collectionService.getCollectionTags(id)} />
            <Items
              inCollection={true}
              callback={collectionService.getCollectionItems(id)}
            />
          </Row>
        </Container>
      </section>
    </main>
  );
}
export default SingleCollection;
