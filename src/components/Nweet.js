import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");

        if (ok) {
            await deleteDoc(doc(dbService, "nweets", `${nweetObj.id}`));

            if (nweetObj.attachmentUrl !== "") {
                await deleteObject(ref(storageService, `${nweetObj.attachmentUrl}`));
            }
        };
    };

    const toggleEditing = () => {
        setEditing((prev) => !prev);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        
        await updateDoc(doc(dbService, "nweets", `${nweetObj.id}`), {
            text: newNweet
        })
        setEditing(false);
    }

    const onChange = (event) => {
        const { target: { value } } = event;
        setNewNweet(value);
    }
    
    return (
        <div>
            {editing ? (
                <>
                    {isOwner && (
                        <>
                            <form onSubmit={ onSubmit }>
                                <input
                                    type="text"
                                    placeholder="Edit your nweet"
                                    value={ newNweet }
                                    onChange={ onChange }
                                    required
                                />

                                <input type="submit" value="Update Nweete" />
                            </form> 
                    
                            <button onClick={toggleEditing}>Cancel</button>
                        </>
                    )}
                </>
            ) : (
                <>
                    <h4>{nweetObj.text}</h4>
                    {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} width="50px" height="50px" /> }                        
                    {isOwner && (
                        <>
                            <button onClick={ onDeleteClick }>Delete Nweet</button>
                            <button onClick={ toggleEditing }>Edit Nweet</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Nweet;