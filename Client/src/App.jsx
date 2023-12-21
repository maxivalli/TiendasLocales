import axios from "axios";
import Swal from "sweetalert2";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react";
import { messaging } from "./components/Firebase/config";
import { onMessage } from "firebase/messaging";
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

import Navbar from "./components/Navbar/Navbar";

import Home from "./views/Home/Home";
import Detail from "./views/Detail/Detail";
import Favorites from "./views/Favorites/Favorites";
import Messages from "./views/Messages/Messages";
import Account from "./views/Account/Account";
import More from "./views/More/More";
import CreateStore from "./views/CreateStore/CreateStore";
import MyStore from "./views/MyStore/MyStore";
import MySales from "./views/MySales/MySales";
import Store from "./views/Store/Store";
import Queries from "./views/Queries/Queries";
import Faq from "./views/FAQ/Faq";
import Dashboard from "./views/Dashboard/Dashboard";
import "./App.css";
import UbiForm from "./components/UbiForm/UbiForm";
import {
  getAllPosts,
  getAllStores,
  getUserStore,
  saveUserData,
} from "./redux/actions";
import { useDispatch } from "react-redux";
import AddProduct from "./views/AddProduct/AddProduct";

let socket;

function App() {
  
  if ("serviceWorker" in navigator) {
    // Registra el Service Worker de Firebase
    navigator.serviceWorker
      .register("./firebase-messaging-sw.js", { scope: "./" })
      .then((registration) => {
        console.log(
          "Service Worker de Firebase registrado con éxito:",
          registration
        );
      })
      .catch((error) => {
        console.error(
          "Error al registrar el Service Worker de Firebase:",
          error
        );
      });
  }

  const dispatch = useDispatch();
  //axios.defaults.baseURL = "http://localhost:3001/";
  axios.defaults.baseURL = "https://tiendaslocales-production.up.railway.app/";
  const {
    user,
    isAuthenticated: isAuthenticatedAuth0,
    loginWithRedirect,
    isLoading,
  } = useAuth0();

  const handleUserGoogle = async () => {
    if (isAuthenticatedAuth0) {
      const userByGoogle = {
        username: user.name,
        password: "123123",
        email: user.email,
        image: user.picture,
        origin: "google",
      };
      try {
        const userLog = {
          email: userByGoogle.email,
        };
        const existe = await axios.get("/users/logueado", {
          params: userLog,
        });

        if (!existe.data) {
          const response = await axios.post("/users/register", userByGoogle);
          if (response) {
            await localStorage.setItem("token", response.data.token);
            setAuth(true);

            Swal.fire({
              icon: "success",
              title: "Registro exitoso",
              text: `¡Bienvenido ${userByGoogle.username}!`,
            });
          } else {
            console.log("Hubo un error al crear el usuario.");
          }
        } else {
          const response = await axios.post("/users/login", userByGoogle);
          if (response) {
            await localStorage.setItem("token", response.data.token);
            setAuth(true, response.data.usuario);

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: "success",
              title: "Login exitoso",
            });
          } else {
            console.log("Hubo un error al crear el usuario.");
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      handleUserGoogle();
    }
  }, [isAuthenticatedAuth0, isLoading]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  const setAuth = (status, user) => {
    setIsAuthenticated(status);
    setUserData(user);
    dispatch(saveUserData(user));
    dispatch(getUserStore(user?.id));
    dispatch(getAllPosts());
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("/users/verify", {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data === true) {
            setIsAuthenticated(true);
            axios
              .get("/users/userId", {
                headers: {
                  token: token,
                },
              })
              .then((userDataResponse) => {
                setUserData({
                  email: userDataResponse.data.email,
                  id: userDataResponse.data.id,
                  username: userDataResponse.data.username,
                  image: userDataResponse.data.image,
                  direccion: userDataResponse.data.direccion,
                  rol: userDataResponse.data.rol,
                  averageRating: userDataResponse.data.averageRating,
                  tiendas: userDataResponse.data.tiendas,
                  vendedor: userDataResponse.data.vendedor,
                  accT: userDataResponse.data.accT,
                  FCMtoken: userDataResponse.data.FCMtoken,
                });
                dispatch(
                  saveUserData({
                    email: userDataResponse.data.email,
                    id: userDataResponse.data.id,
                    username: userDataResponse.data.username,
                    image: userDataResponse.data.image,
                    direccion: userDataResponse.data.direccion,
                    rol: userDataResponse.data.rol,
                    averageRating: userDataResponse.data.averageRating,
                    tiendas: userDataResponse.data.tiendas,
                    vendedor: userDataResponse.data.vendedor,
                    accT: userDataResponse.data.accT,
                    FCMtoken: userDataResponse.data.FCMtoken,
                  })
                );
                dispatch(getUserStore(userDataResponse?.data.id));
                dispatch(getAllPosts());
              })
              .catch((userDataError) => {
                console.error(
                  "Error al obtener los datos del usuario:",
                  userDataError
                );
              });
          } else {
            setIsAuthenticated(false);
          }
        })
        .catch((error) => {
          console.error("Error al verificar el token:", error);
          setIsAuthenticated(false);
        });
    } else {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    dispatch(getAllStores());
  }, [dispatch]);

  const userId = userData?.id;

  const [shouldConnectSocket, setShouldConnectSocket] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      socket = io("https://tiendaslocales-production.up.railway.app/");
      //socket = io("http://localhost:3001/");
      setShouldConnectSocket(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (shouldConnectSocket && userId) {
      socket.emit("assignSocketId", userId);
    }
  }, [shouldConnectSocket, userId]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Service Worker registrado con éxito: ", registration);
          })
          .catch((err) => {
            console.error("Error al registrar el Service Worker: ", err);
          });
      });

      window.addEventListener("offline", () => {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 200000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "warning",
          title: "Estás fuera de línea, revisa tu conexión.",
        });
      });

      window.addEventListener("online", () => {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: "¡Estás en línea nuevamente!",
        });
      });
    }
  }, []);

  useEffect(() => {
    onMessage(messaging, (message) => {
      toast(message.data.text);
    });
  }, []);

  return (
    <>
      <ToastContainer />
      {isAuthenticated || isAuthenticatedAuth0 ? (
        <Navbar
          isAuthenticated={isAuthenticated}
          setAuth={setAuth}
          userData={userData}
        />
      ) : null}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              userData ? (
                <Home userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <Home userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? (
              userData && <Home userData={userData} setAuth={setAuth} />
            ) : (
              <Register setAuth={setAuth} />
            )
          }
        />
        <Route
          path="/inicio"
          element={
            isAuthenticated ? (
              userData ? (
                <Home userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <Home userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />
        <Route
          path="/post/:id"
          element={
            isAuthenticated ? (
              userData ? (
                <Detail userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <Detail userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />
        <Route
          path="favoritos"
          element={
            isAuthenticated ? (
              userData ? (
                <Favorites userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <Favorites userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />
        <Route
          path="/ubiForm"
          element={
            isAuthenticated ? (
              userData ? (
                <UbiForm userData={userData} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <UbiForm userData={userData} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />
        <Route
          path="/mensajes/*"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              user || userData ? (
                <Messages userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />
        <Route
          path="/micuenta"
          element={
            isAuthenticated ? (
              userData ? (
                <Account
                  userData={userData}
                  setUserData={setUserData}
                  setAuth={setAuth}
                />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <Account
                  userData={userData}
                  setUserData={setUserData}
                  setAuth={setAuth}
                />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />
        <Route
          path="/mas"
          element={
            isAuthenticated ? (
              userData ? (
                <More userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <More userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />
        <Route
          path="/createstore"
          element={
            isAuthenticated ? (
              userData ? (
                <CreateStore userData={userData} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <CreateStore userData={userData} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />
        <Route
          path="/mitienda/:storeId"
          element={
            isAuthenticated ? (
              userData ? (
                <MyStore userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <MyStore userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />
        <Route
          path="/misventas"
          element={
            isAuthenticated ? (
              userData ? (
                <MySales userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <MySales userData={user.name} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />
        <Route
          path="/tienda/:linkName"
          element={
            isAuthenticated ? (
              userData ? (
                <Store userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <Store userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />
        <Route
          path="/consultas"
          element={
            isAuthenticated ? (
              userData ? (
                <Queries userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <Queries userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />
        <Route
          path="/faq"
          element={
            isAuthenticated ? (
              userData ? (
                <Faq userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <Faq userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              userData ? (
                <Dashboard userData={userData} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <Dashboard userData={userData} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />
        <Route
          path="/agregarproducto"
          element={
            isAuthenticated ? (
              userData ? (
                <AddProduct userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <AddProduct userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />
      </Routes>
    </>
  );
}

export { App, socket };

//
