import { dbService, storageService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage"; 
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

const NweetFactory = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        if (nweet === "") {
            return;
        }

        let attachmentUrl = "";
        event.preventDefault();

        if (attachment !== "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");

            attachmentUrl = await getDownloadURL(response.ref);
        }

        const nweetObj = {
            text: nweet,
            createAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }

        await addDoc(collection(dbService, "nweets"), nweetObj);

        setNweet("");
        setAttachment("");
    };

    const onChange = (event) => {
        const { target: { value } } = event;
        setNweet(value);
    };

    const onFilechange = (event) => {
        const { target: { files } } = event;
        const theFile = files[0];
        const reader = new FileReader();
      
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result } } = finishedEvent;
            setAttachment(result);
        };

        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => {
        setAttachment(null);
    }

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                className="factoryInput__input"
                value={nweet}
                onChange={onChange}
                type="text"
                placeholder="무슨일이 일어나고 있나요?"
                maxLength={120}
                />

                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>

            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>

            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFilechange}
                style={{
                    opacity: 0,
                }}
            />
            
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
};

export default NweetFactory;