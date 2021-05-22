import React, { useEffect, useState, FC } from 'react';
import { DeleteBtn } from './DeleteBtn';
import Interests from './Interests';


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
        <h6 className="border-bottom border-gray pb-2 mb-0">Users</h6>
        {users.map(user =>
          <div key={user.id} className="media text-muted pt-3 shadow-sm p-3 mb-5 bg-body rounded">

            {/*  */}
            <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
              {/* use the follower object key to display data with less code lines */}
              <span className="badge bg-secondary mx-20">{followersCount[user.id]}</span>
              <div className="d-flex justify-content-between align-items-center w-100">
                <strong className="text-gray-dark">{user.name}</strong>
                {/* Delete Button Component */}
                <DeleteBtn onDelete={() => onDeleteUser(user.id)} />
              </div>


              {/* checking what interest that user have and display it */}
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

            </div>
          </div>
        )}
      </div>

    </main>
  );
}

