import { useUserInfo } from '../contexts/userInfoContext';
import itemService from '../services/itemService';
import Showcase from '../components/Showcase';
import Collections from '../components/Collections';
import Items from '../components/Items';
import Tags from '../components/Tags';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function Dashboard() {
  const { user } = useUserInfo();

  return (
    <>
      {!user && <Showcase />}
      <Collections />
      <main className="py-lg-5 py-2 px-2">
        <Container fluid="md">
          <Row className="justify-content-between align-items-start">
            <Tags callback={itemService.getTags} />
            <Items callback={itemService.getItems} />
          </Row>
        </Container>
      </main>
    </>
  );
}
export default Dashboard;
