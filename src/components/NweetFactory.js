import { dbService, storageService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage"; 
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from "react";

const NweetFactory = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
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

    const onCleanPhotoClick = () => {
        setAttachment(null);
    }

    return (
        <form onSubmit={ onSubmit }>
            <input
                type="text"
                value={nweet}
                onChange={onChange}
                placeholder="무슨 일이 벌어지고 있나요?"
                maxLength={120} />
            
            <input type="file" accept="image/*" onChange={ onFilechange } />
            <input type="submit" value="Nweet" />
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" />
                    <button onClick={ onCleanPhotoClick }>Clear</button>
                </div>
            )}
        </form>
    );
};

export default NweetFactory;