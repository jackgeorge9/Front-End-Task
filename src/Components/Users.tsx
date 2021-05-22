import axios from 'axios';
import React, { useEffect, useState, FC } from 'react';
import { Accordion, Card, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { User, Interest } from './Interfaces';
import NoUsersImage from "../assets/undraw_empty_street_sfxm.svg";

export const Users: FC<User> = (props) => {

  const [users, setUsers] = useState<User[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [followersCount, setFollowersCount] = useState<Object>({})
  const [viewList, setViewList] = useState(12);
  const getUsers = async () => {
    const apiUrl = 'http://localhost:3001/users';
    const response = await axios.get(apiUrl);
    let users = await response.data;
    let followerCount = {};
    users.forEach((user: { following: Array<number>, id: number }) => {
      followerCount[user.id] = followerCount[user.id] ?? 0
      user.following.forEach(key => {
        if (followerCount[key]) {
          followerCount[key]++;
        }
        else followerCount[key] = 1;

      })
    });
    setFollowersCount(followerCount)
    //for sorting from the lowest
    users.sort(function (a: { id: string | number; }, b: { id: string | number; }) { return followerCount[a.id] - followerCount[b.id] })
    setUsers(users)
  }
  const getInterests = async () => {
    const apiUrl = 'http://localhost:3002/interests';
    const response = await axios.get(apiUrl);
    let interests = await response.data;
    setInterests(interests)
  }

  useEffect(() => {
    getInterests()
    getUsers();
  }, []);



  // for deleting user
  const onDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  //for deleting intesrests per user and set the state
  const onDeleteInterest = (interestId: number, userId: number) => {
    var newUsers = users.slice();
    setUsers(newUsers.map(user => (user.id === userId ? {
      ...user, interests: user.interests.filter(interest => {
        return interest !== interestId
      })
    } : user)))
  };

  return (
    <main role="main" className="container">
      <div className="my-3 p-3 bg-white rounded shadow-sm">
        <div className='d-flex justify-content-between align-items-center mb-4 border-bottom pb-2'>
          <h3 className="mb-0">List of users</h3>
          <ButtonGroup aria-label="Basic example" size="sm">
            <Button variant="primary" onClick={() => setViewList(12)} > <i className="fa fa-square"></i> </Button>
            <Button variant="primary" onClick={() => setViewList(6)} ><i className="fa fa-th-large"></i></Button>
            <Button variant="primary" onClick={() => setViewList(4)} > <i className="fa fa-th"></i> </Button>
          </ButtonGroup>
        </div>
        <div>
          {!users.length ?
            <>
              <div className='text-center'>
                <img src={NoUsersImage} alt="no users" width="400px" />
                <br />
                <h6 className="mt-4">There is no users </h6>
              </div>
            </> : null
          }
        </div>
        <Row>
          {users.map(user =>
            <Col md={viewList}>
              <Card key={user.id} className="mb-4 shadow rounded">
                <Card.Header>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div>
                      <h5 className='mb-0'> <i className="fa fa-user"></i> {user.name} </h5>
                      <span className="badge bg-secondary"> <i className="fa fa-users"></i> {followersCount[user.id]}</span>
                    </div>
                    <Button variant="danger" size="sm" className='rounded' onClick={() => onDeleteUser(user.id)}> <i className="fa fa-times-circle"></i> </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div>
                    <Accordion defaultActiveKey="0">
                      <Card>
                        <Accordion.Toggle as={Card.Header} eventKey={`${user.id}`} elementType="<a>" style={{ cursor: 'pointer' }}>
                          <i className="fa fa-eye"></i> view interests
                    </Accordion.Toggle>
                        <Accordion.Collapse eventKey={`${user.id}`}>
                          <Card.Body>
                            {user.interests ? (user.interests.length > 0 ? user.interests.map(i => {
                              // eslint-disable-next-line
                              return interests?.map(interest => {
                                if (interest.id === i) {
                                  return <span key={interest.id}
                                    className="badge bg-primary me-1">
                                    {interest.name} <button onClick={() => onDeleteInterest(interest.id, user.id)} type="button" className="btn-close btn-close-white" aria-label="Close"></button> </span>
                                }
                              })
                            }) : <span className="badge bg-secondary mx-20">No interest</span>) : <span className="badge bg-secondary mx-20">No interest</span>}
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </main>
  );
}

