import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useUserInfo } from '../contexts/userInfoContext';
import { getFullName, lastSeen } from '../helpers';
import userService from '../services/userService';
import Items from '../components/Items';
import Collections from '../components/Collections';
import AuthorInfo from '../components/AuthorInfo';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { FaBan } from 'react-icons/fa';

function UserProfile() {
  const [user, setUser] = useState();
  const itemQuery = useMemo(() => ({ createdAt: 'desc', limit: 6 }), []);
  const colQuery = useMemo(() => ({ createdAt: 'desc', limit: 6 }), []);

  const { id } = useParams();
  const { user: me } = useUserInfo();

  useEffect(() => {
    let userId;
    if (me && id === 'me') {
      userId = me._id;
    } else {
      userId = id;
    }
    userService.getSingleUser(userId).then(setUser);
  }, [id, me]);

  if (!user) return null;

  return (
    <main className="px-2">
      <Container fluid="md">
        <Row>
          <Col as="section" lg={8} className="py-lg-5 mt-lg-5 py-4 pe-lg-5">
            <Stack
              direction="horizontal"
              className="align-items-center justify-content-between">
              <h1>{getFullName(user.name)}</h1>
              <Button variant="outline-danger">
                <FaBan className="fs-5" />
              </Button>
            </Stack>
            <Tabs defaultActiveKey="collections" className="fs-5 pt-5">
              <Tab eventKey="collections" title="Collections">
                <div className="mt-4">
                  <Collections
                    indexes={false}
                    fill={true}
                    showUser={false}
                    query={colQuery}
                    callback={userService.getUserCollections(user._id)}
                    root="../.."
                  />
                </div>
              </Tab>
              <Tab eventKey="items" title="Latest Items">
                <Row className="mt-4" as="section">
                  <Items
                    inCollection={true}
                    showCollection={true}
                    showUser={false}
                    span={12}
                    query={itemQuery}
                    callback={userService.getUserItems(user._id)}
                    root="../.."
                  />
                </Row>
              </Tab>
            </Tabs>
          </Col>
          <Col as="aside" lg={4} className="border-start py-lg-5 py-2 ps-4">
            <div
              style={{ top: 'calc(79px + 3rem)' }}
              className="position-lg-sticky sticky-lg-top">
              <AuthorInfo
                user={user}
                description={lastSeen(user.lastSeen)}
                fontSize="lg"
                picSize="lg"
                weight="bolder"
                direction="vertical"
              />
              {user.bio && <p className="mt-3 fs-5 text-muted">{user.bio}</p>}
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
export default UserProfile;
