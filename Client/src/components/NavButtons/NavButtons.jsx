import React from "react";
import style from './NavButtons.module.css';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NavButtons = () => {
  const navigate = useNavigate();
const userData = useSelector((state) => state.userData)

  const handleChatButtonClick = async () => {
    const projectID = "1fb49778-0ca9-4761-a91b-512f3a51ee7f";
    const userName = userData.username;
    const userSecret = userData.email;

    const apiUrl = 'https://api.chatengine.io/chats/';

    // Replace with the actual usernames you want to include in the chat
    const usernames = ["Ejemplo"];
    const title = "Another Surprise Party!";
    const isDirectChat = true;

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Project-ID': projectID,
          'User-Name': userName,
          'User-Secret': userSecret,
        },
        body: JSON.stringify({
          usernames,
          title,
          is_direct_chat: isDirectChat,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create chat');
      }

      // Handle successful chat creation here
      console.log('Chat created successfully');
      navigate('/messages');
    } catch (error) {
      console.error('Error creating chat:', error.message);
      throw error
    }
  };

  return (
    <>
      <button className={style.chat} onClick={handleChatButtonClick}>
        <img
          width="30"
          height="30"
          src="https://img.icons8.com/parakeet-line/48/chat.png"
          alt="chat"
        />
      </button>
      <button className={style.nav}>
        <img
          width="30"
          height="30"
          src="https://img.icons8.com/material-outlined/48/near-me.png"
          alt="near-me"
        />
      </button>
    </>
  );
};

export default NavButtons;
