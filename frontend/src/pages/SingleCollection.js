import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import collectionService from '../services/collectionService';
import { timeDiff } from '../helpers';
import Items from '../components/Items';
import Tags from '../components/Tags';
import AuthorInfo from '../components/AuthorInfo';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function SingleCollection() {
  const [collection, setCollection] = useState();
  const itemQuery = useMemo(() => ({ createdAt: 'desc', limit: 6 }), []);
  const { id } = useParams();

  useEffect(() => {
    collectionService.getSingleCollection(id).then(setCollection);
  }, [id]);

  if (!collection) return null;

  return (
    <main>
      <section className="border-bottom py-lg-5 px-2 pt-4">
        <Container fluid="md">
          <AuthorInfo
            fontSize="lg"
            picSize="md"
            user={collection.user}
            description={timeDiff(collection.createdAt, 'item', 'long')}
            root="../.."
          />
          <h1 className="lh-base">{collection.name}</h1>
          {collection.description && (
            <p className="text-secondary fs-4">{collection.description}</p>
          )}
        </Container>
      </section>
      <section className="py-lg-5 px-2 pb-4">
        <Container fluid="md">
          <Row className="justify-content-between align-items-start">
            <Tags callback={collectionService.getCollectionTags(id)} />
            <Items
              span={8}
              showUser={false}
              showCollection={false}
              query={itemQuery}
              callback={collectionService.getCollectionItems(id)}
              root="../.."
            />
          </Row>
        </Container>
      </section>
    </main>
  );
}
export default SingleCollection;
