import React, { useEffect, useState } from "react";
import "./Sidebar.scss";

import { Avatar, IconButton } from "@material-ui/core";
import {
  DonutLarge as DonutLargeIcon,
  Chat as ChatIcon,
  MoreVert as MoreVertIcon,
  SearchOutlined as SearchOutlinedIcon,
} from "@material-ui/icons";
import {useHistory} from 'react-router-dom'
import firebase from "firebase";
import db from "../../firebase";

import { SidebarChat } from "../SidebarChat/SidebarChat";
import { useStateValue } from "../../context/StateProvider";

interface Room {
  id: string;
  data: firebase.firestore.DocumentData;
}

export const Sidebar = () => {
  const history = useHistory()
  const [rooms, setRooms] = useState<Room[]>([]);
  const {
    state: { user },
  } = useStateValue();

  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (rooms.length > 0)
      history.push(`/rooms/${rooms[0].id}`)
  }, [rooms])


  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL ? user?.photoURL : undefined} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search or start new chat" />
        </div>
      </div>
      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {rooms.map(({ id, data }) => (
          <SidebarChat key={id} roomName={data.name} id={id} />
        ))}
      </div>
    </div>
  );
};
