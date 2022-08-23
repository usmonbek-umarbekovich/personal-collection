import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getFullName, timeDiff } from '../helpers';
import userService from '../services/userService';
import { useUserInfo } from '../contexts/userInfoContext';
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
  const { user: authenticedUser } = useUserInfo();

  const [itemQuery, setItemQuery] = useState({ createdAt: -1, limit: 6 });
  const [colQuery, setColQuery] = useState({ createdAt: -1, limit: 6 });
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

  useEffect(() => {
    if (!user) return;
    document.title = getFullName(user.name);
  }, [user]);

  const blockOrUnblockUser = id => {
    userService
      .blockOrUnblockUser(id)
      .then(data =>
        setUser(prevUser => ({ ...prevUser, active: data.active }))
      );
  };

  if (!user) return null;

  return (
    <main className="px-2">
      <Container fluid="md">
        <Row>
          <Col
            as="aside"
            lg={{ span: 4, order: 'last' }}
            className="user-sidebar border-start py-lg-5 ps-lg-4 pt-4">
            <div className="position-relative h-100">
              <div
                style={{ top: 'calc(var(--nav-height) + 3rem)' }}
                className="sticky-lg-top">
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
                {authenticedUser && (
                  <div>
                    {user.active ? (
                      <Button
                        variant="outline-danger"
                        title="Block the user"
                        onClick={() => blockOrUnblockUser(user._id)}>
                        <FaBan className="fs-5" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline-success"
                        title="Unblock the user"
                        onClick={() => blockOrUnblockUser(user._id)}>
                        <FaCheck className="fs-5" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Col>
          <Col as="section" lg={8} className="py-lg-5 pb-4 mt-lg-3 pe-lg-5">
            <Stack
              direction="horizontal"
              className="align-items-center justify-content-between d-lg-flex d-none">
              <h1>{getFullName(user.name)}</h1>
              {authenticedUser && (
                <div>
                  {user.active ? (
                    <Button
                      variant="outline-danger"
                      title="Block the user"
                      onClick={() => blockOrUnblockUser(user._id)}>
                      <FaBan className="fs-5" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline-success"
                      title="Unblock the user"
                      onClick={() => blockOrUnblockUser(user._id)}>
                      <FaCheck className="fs-5" />
                    </Button>
                  )}
                </div>
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
                    isUserAuthorized={authenticedUser?._id === user._id}
                    callback={colCallback}
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
                    isUserAuthorized={authenticedUser?._id === user._id}
                    callback={itemCallback}
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
