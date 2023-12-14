import {
  GET_ALL_USERS,
  GET_ALL_DISABLED_USERS,
  GET_ALL_EXISTING_USERS,
  GET_USER_BY_ID,
  SORT_USER_BY_PLAN,
  SORT_USER_BY_STATUS,
  SORT_USER_BY_ID,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  RESTORE_USER,
  RESET_USERS_FILTER,
  GET_FAVORITES,
  GET_STORE_POSTS,
  GET_ALL_DISABLED_POSTS,
  GET_ALL_EXISTING_POSTS,
  SORT_POSTS_BY_ID,
  SORT_POSTS_BY_STATUS,
  GET_POST_BY_ID,
  CREATE_POST,
  UPDATE_POST,
  DELETE_POST,
  RESTORE_POST,
  OTHER_USER_DATA,
  CLEAR_DETAIL,
  USER_DATA,
  UPDATE_USER_DATA,
  GET_STORES,
  GET_ALL_POSTS,
  UPDATE_STOCK,
  GET_USER_NOTIFICATIONS,
  DELETE_USER_NOTIFICATIONS
} from "./actionTypes";

const initialState = {
  allUsers: [],
  allStores: [],
  allExistingUsers: [],
  allExistingUsersCopy: [],
  allDisabledUsers: [],
  otherUserName: "",
  otherUserImage: "",
  selectedUser: "",
  favorites: [],
  storePosts: [],
  allPosts: [],
  allPostsCopy: [],
  allDisabledPosts: [],
  allExistingPosts: [],
  allExistingPostsCopy: [],
  selectedPost: "",
  selectedProvince: "",
  selectedLocality: "",
  selectedCategory: "",
  selectedPostToInteract: "",
  selectedPostImage: "",
  matches: [],
  allLikes: [],
  likedPosts: [],
  messageHistory: [],
  chats: [],
  interacciones: {},
  matchedPairs: [],
  postDetail: [],
  userData: {},
  userNotif: [],
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_USERS:
      return {
        ...state,
        allUsers: action.payload,
        allUsersCopy: action.payload,
      };

    case USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };

    case UPDATE_USER_DATA:
      return {
        ...state,
        userData: {
          ...state.userData,
          ...action.payload,
        },
      };

    case GET_ALL_DISABLED_USERS:
      return {
        ...state,
        allDisabledUsers: action.payload,
      };

    case GET_ALL_EXISTING_USERS:
      return {
        ...state,
        allExistingUsers: action.payload,
        allExistingUsersCopy: action.payload,
      };

    case GET_USER_BY_ID:
      return {
        ...state,
        selectedUser: action.payload,
      };

    case SORT_USER_BY_ID: {
      let ordered;

      if (action.payload === "Ascendente") {
        ordered = state.allExistingUsers.sort((a, b) => (a.id > b.id ? 1 : -1));
      } else {
        ordered = state.allExistingUsers.sort((a, b) => (b.id > a.id ? 1 : -1));
      }

      return {
        ...state,
        allExistingUsers: [...ordered],
      };
    }

    case SORT_USER_BY_PLAN: {
      let users = state.allExistingUsersCopy;

      if (action.payload === "Todos") {
        users = state.allExistingUsersCopy;
      } else {
        users = state.allExistingUsersCopy.filter(
          (user) => user.plan === action.payload
        );
      }

      return {
        ...state,
        allExistingUsers: [...users],
      };
    }

    case SORT_USER_BY_STATUS: {
      let users = state.allExistingUsersCopy;

      if (action.payload === "Activos") {
        users = state.allExistingUsersCopy.filter(
          (user) => !user.Deshabilitado
        );
      } else if (action.payload === "Deshabilitados") {
        users = state.allExistingUsersCopy.filter((user) => user.Deshabilitado);
      } else {
        users = state.allExistingUsersCopy;
      }

      return {
        ...state,
        allExistingUsers: [...users],
      };
    }

    case CREATE_USER:
      return {
        ...state,
        allUsers: [...state.allUsers, action.payload],
      };

    case UPDATE_USER:
      return {
        ...state,
        allUsers: state.allUsers.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
      };

    case DELETE_USER:
      return {
        ...state,
        allUsers: state.allUsers.filter(
          (user) => user.id !== action.payload.id
        ),
      };

    case RESTORE_USER: {
      const { id } = action.payload;
      const allUsers = [...state.allUsers];

      const insertIndex = allUsers.findIndex((user) => user.id > id);

      if (insertIndex === -1) {
        allUsers.push(action.payload);
      } else {
        if (insertIndex === 0) {
          allUsers.unshift(action.payload);
        } else {
          allUsers.splice(insertIndex, 0, action.payload);
        }
      }

      return {
        ...state,
        allUsers,
      };
    }

    case RESET_USERS_FILTER:
      return {
        ...state,
        allExistingUsers: state.allExistingUsersCopy,
      };

    case GET_STORES:
      return {
        ...state,
        allStores: action.payload,
      };

    case GET_FAVORITES:
      return {
        ...state,
        favorites: action.payload,
      };

    case GET_STORE_POSTS:
      return {
        ...state,
        storePosts: action.payload,
      };

    case GET_ALL_POSTS:
      return {
        ...state,
        allPosts: action.payload,
      };

    case GET_ALL_DISABLED_POSTS:
      return {
        ...state,
        allDisabledPosts: action.payload,
      };

    case OTHER_USER_DATA:
      return {
        ...state,
        otherUserName: action.payload.otherUserName,
        otherUserImage: action.payload.otherUserImage,
      };

    case GET_ALL_EXISTING_POSTS:
      return {
        ...state,
        allExistingPosts: action.payload,
        allExistingPostsCopy: action.payload,
      };

    case GET_POST_BY_ID:
      return {
        ...state,
        selectedPost: action.payload,
      };

    case UPDATE_STOCK:
      const { quantity, postId } = action.payload;

      // Actualiza la propiedad stock de selectedPost
      const updatedSelectedPost = {
        ...state.selectedPost,
        stock: state.selectedPost.stock - quantity,
      };

      // Actualiza la propiedad stock del post correspondiente en allPosts
      const updatedAllPosts = state.allPosts.map((post) =>
        post.id === postId ? { ...post, stock: post.stock - quantity } : post
      );

      return {
        ...state,
        selectedPost: updatedSelectedPost,
        allPosts: updatedAllPosts,
      };

    case GET_USER_NOTIFICATIONS:
      return {
        ...state,
        userNotif: action.payload,
      };

    case SORT_POSTS_BY_ID: {
      let ordered;

      if (action.payload === "Ascendente") {
        ordered = state.allExistingPosts.sort((a, b) => (a.id > b.id ? 1 : -1));
      } else {
        ordered = state.allExistingPosts.sort((a, b) => (b.id > a.id ? 1 : -1));
      }

      return {
        ...state,
        allExistingPost: [...ordered],
      };
    }

    case SORT_POSTS_BY_STATUS: {
      let posts = state.allExistingPostsCopy;

      if (action.payload === "Activas") {
        posts = state.allExistingPostsCopy.filter(
          (post) => !post.Deshabilitado
        );
      } else if (action.payload === "Deshabilitadas") {
        posts = state.allExistingPostsCopy.filter((post) => post.Deshabilitado);
      } else {
        posts = state.allExistingPostsCopy;
      }

      return {
        ...state,
        allExistingPosts: [...posts],
      };
    }

    case CREATE_POST:
      return {
        ...state,
        allPosts: [...state.allPosts, action.payload],
      };

    case UPDATE_POST:
      return {
        ...state,
        allPosts: state.allPosts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
      };

    case DELETE_POST:
      return {
        ...state,
        allPosts: state.allPosts.filter(
          (post) => post.id !== action.payload.id
        ),
      };

      case DELETE_USER_NOTIFICATIONS:
        return {
          ...state,
          userNotif: [],
        };

    case RESTORE_POST: {
      const { id } = action.payload;
      const allPosts = [...state.allPosts];

      const insertIndex = allPosts.findIndex((user) => user.id > id);

      if (insertIndex === -1) {
        allPosts.push(action.payload);
      } else {
        if (insertIndex === 0) {
          allPosts.unshift(action.payload);
        } else {
          allPosts.splice(insertIndex, 0, action.payload);
        }
      }

      return {
        ...state,
        allPosts,
      };
    }

    case CLEAR_DETAIL:
      return {
        ...state,
        postDetail: [],
      };

    default:
      return state;
  }
}

export default rootReducer;
