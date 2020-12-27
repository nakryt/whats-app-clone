import React, { FC, useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";

import "./SidebarChat.scss";
import firebase from "firebase";
import db from "../../firebase";

interface Props {
  addNewChat?: boolean;
  id?: string;
  roomName?: string;
}

export const SidebarChat: FC<Props> = ({ addNewChat, roomName, id }) => {
  const [messages, setMessages] = useState<firebase.firestore.DocumentData[]>(
    []
  );

  const createChat = async () => {
    const roomName = prompt("Please enter name for chat");

    if (roomName) {
      await db.collection("rooms").add({
        name: roomName,
      });
    }
  };

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [id]);
  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar
          src={`https://avatars.dicebear.com/api/human/${roomName}.svg`}
        />
        <div className="sidebarChat__info">
          <h3>{roomName}</h3>
          <p>{messages[0]?.body}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div className="sidebarChat" onClick={createChat}>
      <h3>Add New Chat</h3>
    </div>
  );
};
