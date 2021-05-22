import React, { useEffect, useState, FC } from 'react';
import { Button } from "react-bootstrap";


interface User {
  id: number,
  name?: string,
  following: Array<number>,
  interests: Array<number>
}

interface Interest {
  id: number,
  name: string,
}


export const Users: FC<User> = (props) => {

  const [users, setUsers] = useState<User[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [followersCount, setFollowersCount] = useState<Object>({})


  const getUsers = async () => {
    const apiUrl = 'http://localhost:3001/users';
    let response = await fetch(apiUrl);
    let users = await response.json();
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
    let response = await fetch(apiUrl);
    let interests = await response.json();
    setInterests(interests)
  }

  useEffect(() => {
    getInterests()
    getUsers();
  }, []);




  const onDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

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
        <h6 className="border-bottom border-gray pb-2 mb-0">Users</h6>
        {users.map(user =>
          <div key={user.id} className="media text-muted pt-3">
            <span className="badge bg-secondary mx-20">{followersCount[user.id]}</span>
            <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
              <div className="d-flex justify-content-between align-items-center w-100">
                <strong className="text-gray-dark">{user.name}</strong>
                <Button variant="danger" onClick={() => onDeleteUser(user.id)}>Delete</Button>
              </div>
              {user.interests ? (user.interests.length > 0 ? user.interests.map(i => {
                // eslint-disable-next-line
                return interests?.map(interest => {
                  if (interest.id === i) {
                    return <span key={interest.id}
                      onClick={() => onDeleteInterest(interest.id, user.id)} className="badge bg-info me-1">{interest.name}</span>
                  }
                })

              }) : <span className="badge bg-secondary mx-20">No interest</span>) : <span className="badge bg-secondary mx-20">No interest</span>}
            </div>
          </div>
        )}
      </div>

    </main>
  );
}

