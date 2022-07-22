import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getFullName, timeDiff } from '../helpers';
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
import { FaBan, FaCheck } from 'react-icons/fa';

function UserProfile() {
  const [user, setUser] = useState();
  const { id } = useParams();

  const [itemQuery, setItemQuery] = useState({ createdAt: 'desc', limit: 6 });
  const [colQuery, setColQuery] = useState({ createdAt: 'desc', limit: 6 });
  const itemCallback = useCallback(
    async (params, controller) => {
      return userService.getUserItems(id)(params, controller);
    },
    [id]
  );
  const colCallback = useCallback(
    async (params, controller) => {
      return userService.getUserCollections(id)(params, controller);
    },
    [id]
  );

  useEffect(() => {
    userService.getSingleUser(id).then(setUser);
  }, [id]);

  if (!user) return null;

  return (
    <main className="px-2">
      <Container fluid="md">
        <Row>
          <Col
            as="aside"
            lg={{ span: 4, order: 'last' }}
            className="user-sidebar border-start py-lg-5 ps-lg-4 pt-4">
            <div className="position-relative">
              <div
                style={{ top: 'calc(var(--nav-height) + 3rem)' }}
                className="position-lg-sticky sticky-lg-top">
                <AuthorInfo
                  fontSize="lg"
                  picSize="lg"
                  weight="bolder"
                  direction="vertical"
                  user={user}
                  linkDisabled={true}
                  description={timeDiff(user.lastSeen, 'user', 'long')}
                />
                {user.bio && <p className="mt-3 fs-5 text-muted">{user.bio}</p>}
              </div>
              <div className="d-lg-none position-absolute top-0 end-0 mt-4">
                {user.active ? (
                  <Button variant="outline-danger" title="Block the user">
                    <FaBan className="fs-5" />
                  </Button>
                ) : (
                  <Button variant="outline-success" title="Unblock the user">
                    <FaCheck className="fs-5" />
                  </Button>
                )}
              </div>
            </div>
          </Col>
          <Col as="section" lg={8} className="py-lg-5 pb-4 mt-lg-3 pe-lg-5">
            <Stack
              direction="horizontal"
              className="align-items-center justify-content-between d-lg-flex d-none">
              <h1>{getFullName(user.name)}</h1>
              {user.active ? (
                <Button variant="outline-danger">
                  <FaBan className="fs-5" />
                </Button>
              ) : (
                <Button variant="outline-success">
                  <FaCheck className="fs-5" />
                </Button>
              )}
            </Stack>
            <Tabs
              mountOnEnter={true}
              className="fs-5 pt-5"
              defaultActiveKey="collections">
              <Tab eventKey="collections" title="Collections">
                <div className="mt-4" as="section">
                  <Collections
                    indexes={false}
                    fill={true}
                    showUser={false}
                    query={colQuery}
                    callback={colCallback}
                    root="../.."
                  />
                </div>
              </Tab>
              <Tab eventKey="items" title="Latest Items">
                <div className="mt-4 py-lg-0 py-3" as="section">
                  <Items
                    inCollection={true}
                    showCollection={true}
                    showUser={false}
                    query={itemQuery}
                    callback={itemCallback}
                    root="../.."
                  />
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
export default UserProfile;
