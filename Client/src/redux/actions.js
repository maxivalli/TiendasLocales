import axios from "axios";
import {
  GET_ALL_USERS,
  GET_ALL_DISABLED_USERS,
  GET_ALL_EXISTING_USERS,
  SORT_USER_BY_ID,
  SORT_USER_BY_PLAN,
  SORT_USER_BY_STATUS,
  GET_USER_BY_ID,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  RESTORE_USER,
  RESET_USERS_FILTER,
  GET_FAVORITES,
  REMOVE_FAVORITE,
  ADD_FAVORITE,
  OTHER_USER_DATA,
  GET_ALL_POSTS,
  GET_ALL_DISABLED_POSTS,
  GET_ALL_EXISTING_POSTS,
  SORT_POSTS_BY_ID,
  SORT_POSTS_BY_STATUS,
  RESET_POSTS_FILTER,
  GET_POST_BY_ID,
  CREATE_POST,
  UPDATE_POST,
  DELETE_POST,
  RESTORE_POST,
  RESET_FILTERS,
  CLEAR_DETAIL,
  USER_DATA,
  UPDATE_USER_DATA,
  GET_STORES,
  GET_STORE_POSTS,
  UPDATE_STOCK,
  GET_USER_NOTIFICATIONS,
} from "./actionTypes";

export function getAllUsers() {
  return async function (dispatch) {
    const response = await axios("/users/allUsers");
    return dispatch({
      type: GET_ALL_USERS,
      payload: response.data,
    });
  };
}

export function getAllDisabledUsers() {
  return async function (dispatch) {
    const response = await axios.get("/users/allDisabledUsers");
    return dispatch({
      type: GET_ALL_DISABLED_USERS,
      payload: response.data,
    });
  };
}

export function getAllExistingUsers() {
  return async function (dispatch) {
    const response = await axios.get("/users/allExistingUsers");
    return dispatch({
      type: GET_ALL_EXISTING_USERS,
      payload: response.data,
    });
  };
}

export function getUserById(id) {
  return async function (dispatch) {
    const response = await axios(`/users/${id}`);
    return dispatch({
      type: GET_USER_BY_ID,
      payload: response.data,
    });
  };
}

export const sortUsersByID = (order) => {
  return {
    type: SORT_USER_BY_ID,
    payload: order,
  };
};

export const sortUsersByPlan = (plan) => {
  return {
    type: SORT_USER_BY_PLAN,
    payload: plan,
  };
};

export const sortUsersByStatus = (status) => {
  return {
    type: SORT_USER_BY_STATUS,
    payload: status,
  };
};

export function createGoogleUser(user) {

  console.log("actions entrega",user);
  return async (dispatch) => {
    const result = await axios.post(
      "/users/registerGoogle",
      user
    );
    dispatch({
      type: CREATE_USER,
      payload: result.data,
    });
  };
}

export function createUser(user) {
  return async (dispatch) => {
    const result = await axios.post("/users/register", user);
    dispatch({
      type: CREATE_USER,
      payload: result.data,
    });
  };
}

export function updateUser(id, user) {
  return async (dispatch) => {
    const result = await axios.put(`/users/${id}`, user);
    dispatch({
      type: UPDATE_USER,
      payload: result.data,
    });
  };
}

export function deleteUser(id) {
  return async (dispatch) => {
    const result = await axios.delete(`/users/${id}`);
    dispatch({
      type: DELETE_USER,
      payload: result.data,
    });
  };
}

export function resetUsersFilter() {
  return {
    type: RESET_USERS_FILTER,
  };
}

export function restoreUser(id) {
  return async (dispatch) => {
    const result = await axios.put(`/users/restoreUser/${id}`);
    dispatch({
      type: RESTORE_USER,
      payload: result.data,
    });
  };
}

export function saveUserData(userData){
  return {
    type: USER_DATA,
    payload: userData
  }
}

export function updateUserData(userData){
  return {
    type: UPDATE_USER_DATA,
    payload:userData
  }
}

export function getAllStores() {
  return async function (dispatch) {
    try {
      const response = await axios('/tiendas/getAllStores');
      return dispatch({
        type: GET_STORES,
        payload: response.data
      })
    }catch (error) {
      throw error
    }
  }
}

export function addFavorite(userId, storeId) {
  return async function (dispatch) {
    try {
      await axios.post(`/favorites/addFavorite/${userId}/${storeId}`);
      dispatch({ type: ADD_FAVORITE });
    } catch (error) {
      throw error
    }
  };
}

export function removeFavorite(userId, storeId) {
  return async function (dispatch) {
    try {
      await axios.delete(`/favorites/removeFavorite/${userId}/${storeId}`);
      dispatch({ type: REMOVE_FAVORITE});
    } catch (error) {
      throw error
    }
  };
}

export function getFavorites(userId) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`/favorites/getFavorites/${userId}`);
      dispatch({ type: GET_FAVORITES, payload: response.data });
    } catch (error) {
      throw error
    }
  };
}

export function getUserNotif(userId) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`/notif/getUserNotif/${userId}`);
      dispatch({ type: GET_USER_NOTIFICATIONS, payload: response.data });
    } catch (error) {
      throw error
    }
  };
}

export function getStorePosts(storeId) {
  return async function (dispatch) {
    const response = await axios(`/posts/getStorePosts/${storeId}`);
    return dispatch({
      type: GET_STORE_POSTS,
      payload: response.data,
    });
  };
}

export function getAllPosts() {
  return async function (dispatch) {
    const response = await axios.get("/posts/getAllPosts");
    return dispatch({
      type: GET_ALL_POSTS,
      payload: response.data,
    });
  };
}

export function getAllDisabledPosts() {
  return async function (dispatch) {
    const response = await axios.get("/posts/allDisabledPosts");
    return dispatch({
      type: GET_ALL_DISABLED_POSTS,
      payload: response.data,
    });
  };
}

export function getAllExistingPosts() {
  return async function (dispatch) {
    const response = await axios.get("/posts/allExistingPosts");
    return dispatch({
      type: GET_ALL_EXISTING_POSTS,
      payload: response.data,
    });
  };
}

export function getPostById(id) {
  return async function (dispatch) {
    const response = await axios(`/posts/getPost/${id}`);
    return dispatch({
      type: GET_POST_BY_ID,
      payload: response.data,
    });
  };
}

export function updateStock(quantity, postId) {
  return async (dispatch) => {
    const result = await axios.put(`/posts/updateStock/${postId}`, {quantity});
    dispatch({
      type: UPDATE_STOCK,
      payload: {quantity, postId},
    });
  };
}

export function saveOtherUserData(otherUserName, otherUserImage) {
  return {
    type: OTHER_USER_DATA,
    payload: {
      otherUserImage,
      otherUserName
    }
  }
}

export const clearDetail = () => {
  return async function (dispatch) {
    return dispatch({
      type: CLEAR_DETAIL,
    });
  };
};

export const selectedPost = (postId, postImage) => {
  return {
    type: SELECTED_POST,
    payload: {
      id: postId,
      image: postImage,
    },
  };
};


export function updatePost(id, post) {
  return async (dispatch) => {
    const result = await axios.put(`/posts/${id}`, post);
    dispatch({
      type: UPDATE_POST,
      payload: result.data,
    });
  };
}

export function deletePost(id) {
  return async (dispatch) => {
    const result = await axios.delete(`/posts/${id}`);
    dispatch({
      type: DELETE_POST,
      payload: result.data,
    });
  };
}

export function restorePost(id) {
  return async (dispatch) => {
    const result = await axios.put(`/posts/restorePost/${id}`);
    dispatch({
      type: RESTORE_POST,
      payload: result.data,
    });
  };
}

export const sortPostsByID = (order) => {
  return {
    type: SORT_POSTS_BY_ID,
    payload: order,
  };
};

export const sortPostsByStatus = (status) => {
  return {
    type: SORT_POSTS_BY_STATUS,
    payload: status,
  };
};

export function resetPostsFilter() {
  return {
    type: RESET_POSTS_FILTER,
  };
}

export function resetFilters() {
  return {
    type: RESET_FILTERS,
  };
}

export function messagesHistory(chatId) {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/messages/${chatId}`);
      dispatch({
        type: CARGAR_HISTORIAL_MENSAJES,
        payload: response.data
      });
    } catch (error) {
      console.error("Error al cargar el historial de mensajes:", error);
    }
  };
}

export function createMessage(chatId, userId, content) {
  return async () => {
    try {
      await axios.post(`/messages/${chatId}`, {
        chatId,
        userId,
        content, 
      });
    } catch (error) {
      console.error("Error al crear el mensaje:", error);
    }
  };
}

//CREAR CHAT
export function createChat(userId, anotherUserId) {
  return async (dispatch) => {
    try {
    const chatId = await axios.post("/chats/create", {
      userId,
      anotherUserId,
    })
    dispatch({
      type: CHAT_CREATED,
      payload: { chatId: chatId.data, user1Id: userId, user2Id: anotherUserId },
    });

    return chatId.data

  }catch (error) {
      console.error("Error al crear el chat:", error);
      throw error
    }
  };
}

export function getAllChats() {
  return async function (dispatch) {
    const response = await axios("/chats/allChats");
    return dispatch({
      type: GET_ALL_CHATS,
      payload: response.data,
    });
  };
}

export function getAllMessages() {
  return async function (dispatch) {
    const response = await axios("/messages/allMessages");
    return dispatch({
      type: GET_ALL_MESSAGES,
      payload: response.data,
    });
  };
}

export function createPost(post) {
  return async (dispatch) => {
    const result = await axios.post("/posts", post);
    dispatch({
      type: CREATE_POST,
      payload: result.data,
    });
  };
}
