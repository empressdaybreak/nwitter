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
        <>
            <form onSubmit={ onSubmit }>
                <input type="text" onChange={onChange} value={ newDisplayName } placeholder="Display name" />
                <input type="submit" value="Update Profile" />
            </form> 

            {/* {nweets.map(nweet => {
                <Nweet
                    key={nweet.id}
                    nweetObj={ nweet.text }
                    isOwner={ nweet.creatorId === userObj.uid }
                />
            })} */}

            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};

export default Profile;