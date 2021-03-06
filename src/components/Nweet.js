import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
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
        <div className="nweet">
            {editing ? (
                <>
                    {isOwner && (
                        <>
                            <form onSubmit={ onSubmit } className="container nweetEdit">
                                <input
                                    type="text"
                                    placeholder="Edit your nweet"
                                    value={ newNweet }
                                    onChange={onChange}
                                    className="formInput"
                                    autoFocus
                                    required
                                />

                                <input type="submit" value="Update Nweete" className="formBtn" />
                            </form> 
                    
                            <span onClick={toggleEditing} className="formBtn cancelBtn">
                                Cancel
                            </span>
                        </>
                    )}
                </>
            ) : (
                <>
                    <h4>{nweetObj.text}</h4>
                    {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
                        
                    <div className="nweet__actions">
                        <span onClick={onDeleteClick}>
                            <FontAwesomeIcon icon={faTrash} />
                        </span>
                        <span onClick={toggleEditing}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};

export default Nweet;