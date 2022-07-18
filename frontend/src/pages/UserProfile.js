import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserInfo } from '../contexts/userInfoContext';
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
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: me } = useUserInfo();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const itemQuery = useMemo(() => ({ createdAt: 'desc', limit: 6 }), [id]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const colQuery = useMemo(() => ({ createdAt: 'desc', limit: 6 }), [id]);

  useEffect(() => {
    if (!me) navigate('/login');
  }, [me, navigate]);

  useEffect(() => {
    let userId;
    if (me && id === 'me') userId = me._id;
    else userId = id;

    userService.getSingleUser(userId).then(setUser);
  }, [id, me]);

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
                style={{ top: 'calc(79px + 3rem)' }}
                className="position-lg-sticky sticky-lg-top">
                <AuthorInfo
                  fontSize="lg"
                  picSize="lg"
                  weight="bolder"
                  direction="vertical"
                  user={user}
                  description={timeDiff(user.lastSeen, 'user', 'long')}
                />
                {user.bio && <p className="mt-3 fs-5 text-muted">{user.bio}</p>}
              </div>
              <div className="d-lg-none position-absolute top-0 end-0 mt-4">
                {user.active ? (
                  <Button variant="outline-danger">
                    <FaBan className="fs-5" />
                  </Button>
                ) : (
                  <Button variant="outline-success">
                    <FaCheck className="fs-5" />
                  </Button>
                )}
              </div>
            </div>
          </Col>
          <Col as="section" lg={8} className="py-lg-5 mt-lg-5 pe-lg-5">
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
        </Row>
      </Container>
    </main>
  );
}
export default UserProfile;
