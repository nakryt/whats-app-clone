import React, { ChangeEvent, FC, useEffect, useState } from "react";
import "./Chat.scss";
import { useParams } from "react-router-dom";
import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile as AttachFileIcon,
  InsertEmoticon as InsertEmoticonIcon,
  MoreVert as MoreVertIcon,
  SearchOutlined as SearchOutlinedIcon,
  Mic as MicIcon,
} from "@material-ui/icons";
import firebase from "firebase";
import db from "../../firebase";
import { useStateValue } from "../../context/StateProvider";

export const Chat: FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<firebase.firestore.DocumentData[]>(
    []
  );

  const { roomId } = useParams<{ roomId: string }>();
  const [roomName, setRoomName] = useState("");
  const {
    state: { user },
  } = useStateValue();

  useEffect(() => {
    if (roomId) {
      const doc = db.collection("rooms").doc(roomId);
      doc.onSnapshot((snapshot) => setRoomName(snapshot.data()?.name));
      doc
        .collection("messages")
        .orderBy("timestamp", "asc")
        // .("seconds", "asc")
        .onSnapshot((snapshot) => {
          const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(messages);
        });
    }

    return () => {};
  }, [roomId]);

  const submitHandler = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    await db
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .add({
        from: {
          name: user?.displayName,
          email: user?.email,
        },
        body: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setMessage("");
  };
  const lastMessage = messages[messages.length - 1];

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar
          src={`https://avatars.dicebear.com/api/human/${roomName}.svg`}
        />

        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            Last seen{" "}
            {lastMessage &&
              lastMessage.timestamp &&
              new Date(lastMessage.timestamp.seconds * 1000).toLocaleString(
                "ru"
              )}
          </p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.length > 0 &&
          messages.map(({ id, from: { name, email }, body, timestamp }) => (
            <p
              key={id}
              className={`message ${email !== user?.email ? "received" : ""}`}
            >
              <span className="message__name">{name}</span>
              {body}
              <span className="message__timestamp">
                {timestamp
                  ? new Date(timestamp.seconds * 1000).toLocaleString("ru")
                  : ""}
              </span>
            </p>
          ))}
      </div>

      <div className="chat__footer">
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Type a message"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setMessage(e.target.value)
            }
            value={message}
          />
          <button type="submit">Send a message</button>
        </form>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
};
