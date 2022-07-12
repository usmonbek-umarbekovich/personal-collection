import { useUserInfo } from '../contexts/userInfoContext';
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
      <main className="py-5">
        <Container>
          <Row>
            <Items />
            <Tags />
          </Row>
        </Container>
      </main>
    </>
  );
}
export default Dashboard;
