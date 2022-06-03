import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);


    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }

    const getMyNweets = async () => {
        const q = query(collection(dbService, "nweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("createAt"));
        
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        if (userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, {
                displayName: newDisplayName
            })

            refreshUser();
        }
    };

    const onChange = (event) => {
        const { target: { value } } = event;
        setNewDisplayName(value);
    }

    useEffect(() => {
        getMyNweets();
    }, []);

    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    onChange={onChange}
                    type="text"
                    autoFocus
                    placeholder="Display name"
                    value={newDisplayName}
                    className="formInput"
                />

                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form> 

            {/* {nweets.map(nweet => {
                <Nweet
                    key={nweet.id}
                    nweetObj={ nweet.text }
                    isOwner={ nweet.creatorId === userObj.uid }
                />
            })} */}

            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
};

export default Profile;