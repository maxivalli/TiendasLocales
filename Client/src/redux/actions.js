import axios from "axios";
import {
  GET_ALL_USERS,
  GET_ALL_DISABLED_USERS,
  GET_ALL_EXISTING_USERS,
  SORT_USER_BY_ID,
  GET_USER_BY_ID,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  RESTORE_USER,
  GET_FAVORITES,
  REMOVE_FAVORITE,
  ADD_FAVORITE,
  REMOVE_FAVORITE_POST,
  ADD_FAVORITE_POST,
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
  SELECTED_POST,
  RESTORE_POST,
  CLEAR_DETAIL,
  USER_DATA,
  UPDATE_USER_DATA,
  GET_STORES,
  GET_STORE_POSTS,
  UPDATE_STOCK,
  GET_USER_NOTIFICATIONS,
  DELETE_USER_NOTIFICATIONS,
  MARK_NOTI_AS_READ,
  GET_USER_STORE,
  DELETE_STORE,
  // FILTERS
  SELECTED_CATEGORY,
  SELECTED_ALPHABET,
  SELECTED_PRICE,
  GET_STORES_BY_CATEGORY,
  GET_STORES_BY_CATEGORY2,
  RESET_FILTERS,
  SELECTED_STORE,
  SAVE_FILTERED_POSTS,
  SAVE_FILTERED_STORES,
  IS_STORE_OPEN,
  SET_STORE_OPEN,
  // SEARCHBAR
  GET_STORE_BY_NAME,
  FILTER_BY_NAME,
  GET_POST_BY_NAME,
  ENVIAR_PRODUCTO,
  COMPRAS_RECIBIDAS,
  // CODES
} from "./actionTypes";

// _____________________________________________________________USERS_________________________________________________________________

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

export function createGoogleUser(user) {

  return async (dispatch) => {
    const result = await axios.post("/users/registerGoogle", user);
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

export function updateUser(id, userData) {
  return async (dispatch) => {
    const result = await axios.put(`/users/${id}`, userData);
  
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

export function restoreUser(id) {
  return async (dispatch) => {
    const result = await axios.put(`/users/restoreUser/${id}`);
    dispatch({
      type: RESTORE_USER,
      payload: result.data,
    });
  };
}

export function saveUserData(userData) {
  return {
    type: USER_DATA,
    payload: userData,
  };
}

export function updateUserData(userData) {
  return {
    type: UPDATE_USER_DATA,
    payload: userData,
  };
}
// _____________________________________________________________STORES__________________________________________________________________
export function getAllStores() {
  return async function (dispatch) {
    try {
      const response = await axios("/tiendas/getAllStores");
      return dispatch({
        type: GET_STORES,
        payload: response.data,
      });
    } catch (error) {
      throw error;
    }
  };
}

export function getUserStore(userId) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`/tiendas/getUserStore/${userId}`);
      dispatch({ type: GET_USER_STORE, payload: response.data });
    } catch (error) {
      throw error;
    }
  };
}

export function getComprasRecibidas(storeId) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`/tiendas/comprasRecibidas/${storeId}`)
      dispatch({ type: COMPRAS_RECIBIDAS, payload: response.data });
    } catch (error) {
      throw error;
    }
  };
}

export function enviarProducto(itemId) {
  return async function (dispatch) {
    const response =  await axios.put(`/tiendas/enviado/${itemId}`);
    return dispatch({
      type: ENVIAR_PRODUCTO,
      payload: itemId,
    });
  };
}

export const setSelectedStore = (store) => {
  return {
    type: SELECTED_STORE,
    payload: store,
  };
};
// _________________________________________________________________FAVORITES_______________________________________________________________
export function addFavorite(userId, storeId) {
  return async function (dispatch) {
    try {
      await axios.post(`/favorites/addFavorite/${userId}/${storeId}`);
      dispatch({ type: ADD_FAVORITE });
    } catch (error) {
      throw error;
    }
  };
}

export function removeFavorite(userId, storeId) {
  return async function (dispatch) {
    try {
      await axios.delete(`/favorites/removeFavorite/${userId}/${storeId}`);
      dispatch({ type: REMOVE_FAVORITE });
    } catch (error) {
      throw error;
    }
  };
}

export function getFavorites(userId) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`/favorites/getFavorites/${userId}`);
      dispatch({ type: GET_FAVORITES, payload: response.data });
    } catch (error) {
      throw error;
    }
  };
}

export function addFavoritePost(userId, storeId, postId) {
  return async function (dispatch) {
    try {
      await axios.post(
        `/favorites/addFavoritePost/${userId}/${storeId}/${postId}`
      );
      dispatch({ type: ADD_FAVORITE_POST });
    } catch (error) {
      throw error;
    }
  };
}

export function removeFavoritePost(userId, storeId, postId) {
  return async function (dispatch) {
    try {
      await axios.delete(
        `/favorites/removeFavoritePost/${userId}/${storeId}/${postId}`
      );
      dispatch({ type: REMOVE_FAVORITE_POST });
    } catch (error) {
      throw error;
    }
  };
}
// __________________________________________________________NOTIFICATIONS_______________________________________________________________
export function getUserNotif(userId) {
  return async function (dispatch) {
    try {
      const response = await axios.get(`/notif/getUserNotif/${userId}`);
      dispatch({ type: GET_USER_NOTIFICATIONS, payload: response.data });
    } catch (error) {
      throw error;
    }
  };
}

export function deleteUserNotif(userId) {
  return async function (dispatch) {
    try {
      const response = await axios.delete(`/notif/deleteUserNotif/${userId}`);
      dispatch({ type: DELETE_USER_NOTIFICATIONS, payload: response.data });
    } catch (error) {
      throw error;
    }
  };
}

export function markNotiAsRead(notiId) {
  return async function (dispatch) {
    try {
      const response = await axios.put(`/notif/markNotiAsRead/${notiId}`);
      dispatch({ type: MARK_NOTI_AS_READ, payload: response.data });
    } catch (error) {
      throw error;
    }
  };
}
// ________________________________________________________________POSTS_____________________________________________________________________
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
    const result = await axios.put(`/posts/updateStock/${postId}`, {
      quantity,
    });
    dispatch({
      type: UPDATE_STOCK,
      payload: { quantity, postId },
    });
  };
}

export function saveOtherUserData(otherUserName, otherUserImage) {
  return {
    type: OTHER_USER_DATA,
    payload: {
      otherUserImage,
      otherUserName,
    },
  };
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
    const result = await axios.delete(`/posts/deletePost/${id}`);
    dispatch({
      type: DELETE_POST,
      payload: id,
    });
  };
}

export function deleteStore(id) {
  return async (dispatch) => {
    const result = await axios.delete(`/tiendas/deleteStore/${id}`);
    dispatch({
      type: DELETE_STORE,
      payload: id,
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

export function messagesHistory(chatId) {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/messages/${chatId}`);
      dispatch({
        type: CARGAR_HISTORIAL_MENSAJES,
        payload: response.data,
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
      });
      dispatch({
        type: CHAT_CREATED,
        payload: {
          chatId: chatId.data,
          user1Id: userId,
          user2Id: anotherUserId,
        },
      });

      return chatId.data;
    } catch (error) {
      console.error("Error al crear el chat:", error);
      throw error;
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

// ___________________________________________________________________FILTERS______________________________________________________________________

export function selectCategory(category) {
  return {
    type: SELECTED_CATEGORY,
    payload: category,
  };
}

export function selectAlphabetOrder(order) {
  return {
    type: SELECTED_ALPHABET,
    payload: order,
  };
}

export function selectPrice(price) {
  return {
    type: SELECTED_PRICE,
    payload: price,
  };
}

export function getStoresByCategory(category) {
  return async function (dispatch) {
    const response = await axios(`/tiendas/categories/${category}`);
    return dispatch({
      type: GET_STORES_BY_CATEGORY,
      payload: response.data,
    });
  };
}

export function getStores2ByCategory(category) {
  return async function (dispatch) {
    const response = await axios(`/tiendas/categories/${category}`);
    return dispatch({
      type: GET_STORES_BY_CATEGORY2,
      payload: response.data,
    });
  };
}

export function resetFilters() {
  return {
    type: RESET_FILTERS,
  };
}

export function setFilteredStoresByName(storedStores) {
  return {
    type: SAVE_FILTERED_STORES,
    payload: storedStores,
  };
}

export function setFilteredPostsByName(storedPosts) {
  return {
    type: SAVE_FILTERED_POSTS,
    payload: storedPosts,
  };
}

export function isStoreOpenSwitch(valor, storeId) {
  return async function (dispatch) {
    const response = await axios.put(
      `/tiendas/isStoreOpen/${valor}/${storeId}`
    );
    return dispatch({
      type: SET_STORE_OPEN,
      payload: response.data,
    });
  };
}

export function isOpenStoresFilter(valor) {
  return {
    type: IS_STORE_OPEN,
    payload: valor,
  };
}

// ______________________________________________________________SEARCHBAR________________________________________________________________

export function getStoreByName(name) {
  return async function (dispatch) {
    const response = await axios(`/tiendas/getStoreByName/name?name=${name}`);
    return dispatch({
      type: GET_STORE_BY_NAME,
      payload: response.data,
    });
  };
}

export function getPostByName(name) {
  return async function (dispatch) {
    const response = await axios(`/posts/getPostByName/name?name=${name}`);
    return dispatch({
      type: GET_POST_BY_NAME,
      payload: response.data,
    });
  };
}

export function filterByName(string) {
  return {
    type: FILTER_BY_NAME,
    payload: string,
  };
}


//_____________________________________________________________OTHERS________________________________________________________________________

