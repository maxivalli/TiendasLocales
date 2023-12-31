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
  DELETE_USER_NOTIFICATIONS,
  GET_USER_STORE,
  DELETE_STORE,
  SELECTED_ALPHABET,
  SELECTED_CATEGORY,
  SELECTED_PRICE,
  GET_STORES_BY_CATEGORY,
  GET_STORES_BY_CATEGORY2,
  SELECTED_STORE,
  GET_STORE_BY_NAME,
  GET_POST_BY_NAME,
  RESET_FILTERS,
  SAVE_FILTERED_STORES,
  SAVE_FILTERED_POSTS,
  IS_STORE_OPEN,
  COMPRAS_RECIBIDAS,
  ENVIAR_PRODUCTO,
  GET_COMPRAS,
  GET_DISABLED_STORES,
} from "./actionTypes";

const initialState = {
  // USERS
  userData: {},
  userNotif: [],
  allUsers: [],
  allExistingUsers: [],
  allExistingUsersCopy: [],
  allDisabledUsers: [],
  selectedUser: "",
  // STORES
  allStores: [],
  allStoresCopy: [],
  disabledStores: [],
  openStores: null,
  userStore: {},
  selectedStore: {},
  comprasRecibidas: [],
  allCompras: [],
  // POSTS
  storePosts: [],
  allPosts: [],
  allPostsCopy: [],
  favorites: [],
  allDisabledPosts: [],
  allExistingPosts: [],
  allExistingPostsCopy: [],
  postDetail: [],
  // FILTERS
  selectedPost: "",
  selectedPrice: "",
  selectedAlphabetOrder: "",
  selectedCategory: "",
  // SEARCHBAR
  filteredStoresByName: [],
  filteredStoresByNameCopy: [],
  filteredPostsByName: [],
  filteredPostsByNameCopy: [],
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    // _________________________________________________USERS________________________________________________________
    case USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };

    case GET_ALL_USERS:
      return {
        ...state,
        allUsers: action.payload,
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

    case CREATE_USER:
      return {
        ...state,
        allUsers: [...state.allUsers, action.payload],
      };

    case UPDATE_USER:
      return {
        ...state,
        userData: action.payload,
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

    case RESET_USERS_FILTER:
      return {
        ...state,
        allExistingUsers: state.allExistingUsersCopy,
      };

    case DELETE_USER_NOTIFICATIONS:
      return {
        ...state,
        userNotif: [],
      };

    // _______________________________________________________STORES__________________________________________________________
    case GET_STORES:
      return {
        ...state,
        allStores: action.payload,
        allStoresCopy: action.payload,
      };

    case GET_DISABLED_STORES:
      return {
        ...state,
        disabledStores: action.payload,
      };

    case GET_COMPRAS:
      return {
        ...state,
        allCompras: action.payload,
      };

    case COMPRAS_RECIBIDAS:
      return {
        ...state,
        comprasRecibidas: action.payload,
      };

    case GET_USER_STORE:
      return {
        ...state,
        userStore: action.payload,
      };

    case SELECTED_STORE:
      return {
        ...state,
        selectedStore: action.payload,
      };

    case ENVIAR_PRODUCTO:
      const productoEnviado = state.comprasRecibidas.map((compra) => {
        if (compra.id == action.payload) {
          return {
            ...compra,
            enviado: true,
          };
        }
        return compra;
      });

      return {
        ...state,
        comprasRecibidas: productoEnviado,
      };
    // ________________________________________________________FAVORITES___________________________________________________________
    case GET_FAVORITES:
      return {
        ...state,
        favorites: action.payload,
      };
    // __________________________________________________________POSTS______________________________________________________________
    case GET_STORE_POSTS:
      return {
        ...state,
        storePosts: action.payload,
      };

    case GET_ALL_POSTS:
      return {
        ...state,
        allPosts: action.payload,
        allPostsCopy: action.payload,
      };

    case GET_ALL_DISABLED_POSTS:
      return {
        ...state,
        allDisabledPosts: action.payload,
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
      const updatedSelectedPost = {
        ...state.selectedPost,
        stock: state.selectedPost.stock - quantity,
      };
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
        allPosts: state.allPosts.filter((post) => post.id !== action.payload),
        allPostsCopy: state.allPostsCopy.filter(
          (post) => post.id !== action.payload
        ),
      };

    case DELETE_STORE:
      return {
        ...state,
        allStores: state.allStores.filter(
          (store) => store.id !== action.payload
        ),
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

    // ____________________________________________FILTERS________________________________________________________

    case SELECTED_PRICE:
      let sortedPostsByPrice = state.allPostsCopy.slice();
      let sortedPostByPriceAndName = state.filteredPostsByName?.slice();

      if (action.payload === "asc") {
        sortedPostsByPrice.sort((a, b) => a.price - b.price);
        sortedPostByPriceAndName &&
          sortedPostByPriceAndName.sort((a, b) => a.price - b.price);
      } else if (action.payload === "desc") {
        sortedPostsByPrice.sort((a, b) => b.price - a.price);
        sortedPostByPriceAndName &&
          sortedPostByPriceAndName.sort((a, b) => b.price - a.price);
      }

      // Aplica el filtro de categoría si no se seleccionó "Mostrar Todo"
      if (
        state.selectedCategory &&
        state.selectedCategory !== "🔍 Mostrar todas"
      ) {
        const filteredStores = state.allStoresCopy.filter(
          (store) => store.categoria === state.selectedCategory
        );

        sortedPostsByPrice = sortedPostsByPrice.filter((post) =>
          filteredStores.some((store) => store.id === post.storeId)
        );

        sortedPostByPriceAndName =
          sortedPostByPriceAndName &&
          sortedPostByPriceAndName.filter((post) =>
            filteredStores.some((store) => store.id === post.storeId)
          );
      }

      // Filtra por tiendas abiertas si openStores es true
      if (state.openStores) {
        const openStoresIds = state.allStoresCopy
          .filter((store) => store.isOpen)
          .map((store) => store.id);

        sortedPostsByPrice = sortedPostsByPrice.filter((post) =>
          openStoresIds.includes(post.storeId)
        );

        sortedPostByPriceAndName =
          sortedPostByPriceAndName &&
          sortedPostByPriceAndName.filter((post) =>
            openStoresIds.includes(post.storeId)
          );
      }

      return {
        ...state,
        selectedPrice: action.payload,
        allPosts: sortedPostsByPrice,
        // Actualiza storePosts solo si no se seleccionó una categoría
        storePosts: sortedPostsByPrice.filter(
          (post) => post.storeId === state.selectedStore.id
        ),
        filteredPostsByName: sortedPostByPriceAndName,
      };

    case SELECTED_ALPHABET:
      let sortedPostsByAlphabet = state.allPostsCopy.slice();
      let sortedStoresByAlphabet = state.allStoresCopy.slice();
      let sortedPostsByAlphabetAndName = state.filteredPostsByName.slice();
      let sortedStoresByAlphabetAndName = state.filteredStoresByName.slice();

      if (action.payload === "asc") {
        sortedPostsByAlphabet.sort((a, b) => a.title.localeCompare(b.title));
        sortedStoresByAlphabet.sort((a, b) => a.nombre.localeCompare(b.nombre));
        sortedPostsByAlphabetAndName &&
          sortedPostsByAlphabetAndName.sort((a, b) =>
            a.title.localeCompare(b.title)
          );
        sortedStoresByAlphabetAndName &&
          sortedStoresByAlphabetAndName.sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          );
      } else if (action.payload === "desc") {
        sortedPostsByAlphabet.sort((a, b) => b.title.localeCompare(a.title));
        sortedStoresByAlphabet.sort((a, b) => b.nombre.localeCompare(a.nombre));
        sortedPostsByAlphabetAndName &&
          sortedPostsByAlphabetAndName.sort((a, b) =>
            b.title.localeCompare(a.title)
          );
        sortedStoresByAlphabetAndName &&
          sortedStoresByAlphabetAndName.sort((a, b) =>
            b.nombre.localeCompare(a.nombre)
          );
      }

      let filteredPostss = sortedPostsByAlphabet;
      let filteredStoress = sortedStoresByAlphabet;
      let filteredPostssByName = sortedPostsByAlphabetAndName;
      let filteredStoressByName = sortedStoresByAlphabetAndName;

      if (state.openStores) {
        // Filtrar solo tiendas abiertas y ordenar por nombre
        filteredStoress = sortedStoresByAlphabet
          .filter((store) => store.isOpen)
          .sort((a, b) => a.nombre.localeCompare(b.nombre));

        // Filtrar también por categoría, si está seleccionada
        if (
          state.selectedCategory &&
          state.selectedCategory !== "🔍 Mostrar todas"
        ) {
          filteredStoress = filteredStoress.filter(
            (store) => store.categoria === state.selectedCategory
          );
        }

        // Actualizar los posts y tiendas filtradas por nombre
        filteredPostss = sortedPostsByAlphabet.filter((post) =>
          filteredStoress.some((store) => store.id === post.storeId)
        );

        filteredStoressByName =
          sortedStoresByAlphabetAndName &&
          sortedStoresByAlphabetAndName
            .filter((store) => store.isOpen)
            .sort((a, b) => a.nombre.localeCompare(b.nombre));

        filteredPostssByName =
          sortedPostsByAlphabetAndName &&
          sortedPostsByAlphabetAndName.filter((post) =>
            filteredStoress.some((store) => store.id === post.storeId)
          );

        if (
          state.selectedCategory &&
          state.selectedCategory !== "🔍 Mostrar todas"
        ) {
          filteredStoressByName = filteredStoressByName.filter(
            (store) => store.categoria === state.selectedCategory
          );
        }
      } else {
        // Si openStores no está activado, aplicar la lógica de filtrado por categoría
        if (
          state.selectedCategory &&
          state.selectedCategory !== "🔍 Mostrar todas"
        ) {
          filteredStoress = sortedStoresByAlphabet.filter(
            (store) => store.categoria === state.selectedCategory
          );
          filteredPostss = sortedPostsByAlphabet.filter((post) =>
            filteredStoress.some((store) => store.id === post.storeId)
          );

          filteredStoressByName =
            sortedStoresByAlphabetAndName &&
            sortedStoresByAlphabetAndName.filter(
              (store) => store.categoria === state.selectedCategory
            );

          filteredPostssByName =
            sortedPostsByAlphabetAndName &&
            sortedPostsByAlphabetAndName.filter((post) =>
              filteredStoress.some((store) => store.id === post.storeId)
            );
        }
      }

      return {
        ...state,
        selectedAlphabetOrder: action.payload,
        allPosts: filteredPostss,
        allStores: filteredStoress,
        storePosts: sortedPostsByAlphabet.filter(
          (post) => post.storeId === state.selectedStore.id
        ),
        filteredPostsByName: filteredPostssByName,
        filteredStoresByName: filteredStoressByName,
      };

    case SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload,
      };

    case GET_STORES_BY_CATEGORY:
      let filteredStores = action.payload;
      let filterStoresByName;

      if (state.selectedCategory !== "🔍 Mostrar todas") {
        filterStoresByName = state.filteredStoresByNameCopy.filter(
          (store) => store.categoria === state.selectedCategory
        );
      } else {
        filterStoresByName = state.filteredStoresByNameCopy;
      }

      if (state.openStores) {
        filteredStores = filteredStores.filter(
          (store) => store.isOpen === true
        );

        if (filterStoresByName) {
          filterStoresByName = filterStoresByName.filter(
            (store) => store.isOpen === true
          );
        }
      }

      const filteredPosts = state.allPostsCopy.filter((post) =>
        filteredStores.some((store) => store.id === post.storeId)
      );

      const filterPostsByName =
        state.filteredPostsByNameCopy &&
        state.filteredPostsByNameCopy.filter((post) =>
          filterStoresByName.some((store) => store.id === post.storeId)
        );

      return {
        ...state,
        allStores: filteredStores,
        allPosts: filteredPosts,
        filteredStoresByName: filterStoresByName,
        filteredPostsByName: filterPostsByName,
      };

    case GET_STORES_BY_CATEGORY2:
      let filteredStores2 = action.payload;

      if (state.selectedCategory !== "🔍 Mostrar todas") {
        filteredStores2 = state.allStoresCopy.filter(
          (store) => store.categoria === state.selectedCategory
        );
      } else {
        filteredStores2 = state.allStoresCopy;
      }

      if (state.openStores) {
        filteredStores2 = filteredStores2.filter(
          (store) => store.isOpen === true
        );
      }

      const filteredPosts2 = state.allPostsCopy.filter((post) =>
        filteredStores2.some((store) => store.id === post.storeId)
      );
      return {
        ...state,
        filteredStoresByName: filteredStores2,
        filteredPostsByName: filteredPosts2,
      };

    case RESET_FILTERS:
      return {
        ...state,
        selectedCategory: "",
        selectedAlphabetOrder: "",
        selectedPrice: "",
        allPosts: state.allPostsCopy,
        storePosts: state.allPostsCopy.filter(
          (post) => post.storeId === state.selectedStore.id
        ),
        filteredPostsByName: state.filteredPostsByNameCopy,
        filteredStoresByName: state.filteredStoresByNameCopy,
      };

    case SAVE_FILTERED_STORES:
      return {
        ...state,
        filteredStoresByName: action.payload,
      };

    case SAVE_FILTERED_POSTS:
      return {
        ...state,
        filteredPostsByName: action.payload,
      };

    case IS_STORE_OPEN:
      if (action.payload === true) {
        const {
          selectedCategory,
          selectedPost,
          selectedPrice,
          selectedAlphabetOrder,
          ...rest
        } = state;
        const previousState = { ...rest };

        let openStores = state.allStores.filter(
          (stores) => stores.isOpen === true
        );
        let openStoresByName = state.filteredStoresByName.filter(
          (stores) => stores.isOpen === true
        );
        let openStoresFilteredPostsByName = state.allPostsCopy.filter((post) =>
          openStoresByName.some((store) => store.id === post.storeId)
        );
        const openStoresFilteredPosts = state.allPostsCopy.filter((post) =>
          openStores.some((store) => store.id === post.storeId)
        );

        return {
          ...state,
          openStores: action.payload,
          allStores: openStores,
          filteredStoresByName: openStoresByName,
          allPosts: openStoresFilteredPosts,
          filteredPostsByName: openStoresFilteredPostsByName,
          previousState,
        };
      } else {
        return state.previousState || state;
      }

    // ______________________________________________________________SEARCHBAR____________________________________________________________
    case GET_STORE_BY_NAME:
      return {
        ...state,
        allStores: action.payload,
        filteredStoresByName: action.payload,
        filteredStoresByNameCopy: action.payload,
      };

    case GET_POST_BY_NAME:
      return {
        ...state,
        allPosts: action.payload,
        filteredPostsByName: action.payload,
        filteredPostsByNameCopy: action.payload,
      };

    default:
      return state;
  }
}

export default rootReducer;
