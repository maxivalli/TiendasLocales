import { io } from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";
import { messaging } from "./components/Firebase/config";
import { onMessage } from "firebase/messaging";

import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import UbiForm from "./components/UbiForm/UbiForm";
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
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Dashboard from "./views/Dashboard/Dashboard";
import AddProduct from "./views/AddProduct/AddProduct";

import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar/Navbar";

import {
  getAllPosts,
  getAllStores,
  getAllUsers,
  getUserNotif,
  getUserStore,
  saveUserData,
} from "./redux/actions";
import { useDispatch } from "react-redux";

import "./App.css";
import SearchResult from "./views/SearchResult/SearchResult";

let socket;
let SWregistration;

function App() {
  const dispatch = useDispatch();
  axios.defaults.baseURL = "http://localhost:3001/";
  //axios.defaults.baseURL = "https://tiendaslocales-production.up.railway.app/";
  const { user, isAuthenticated: isAuthenticatedAuth0, isLoading } = useAuth0();

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
            console.log();
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
            console.log();
          }
        }
      } catch (error) {
        console.log();
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
    dispatch(getUserNotif(user?.id));
    dispatch(getAllStores());
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
                dispatch(getAllUsers());
                dispatch(getUserNotif(userDataResponse?.data.id));
                dispatch(getAllStores());
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
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            SWregistration = registration;
          })
          .catch((err) => {
            console.error("Error al registrar el Service Worker: ", err);
          });
      });
    }
  }, []);

  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
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
    };

    const handleOnline = () => {
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
    };

    const checkConnectionSpeed = () => {
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      if (connection) {
        const { downlink } = connection;
        const slowConnectionThreshold = 0.5;

        if (downlink && downlink < slowConnectionThreshold) {
          setIsSlowConnection(true);
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
            icon: "warning",
            title:
              "Tu conexión a internet es lenta. La experiencia puede verse afectada.",
          });
        } else {
          setIsSlowConnection(false);
        }
      }
    };

    const connectionSpeedChecker = setInterval(checkConnectionSpeed, 15000);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      clearInterval(connectionSpeedChecker);
    };
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
        <Navbar isAuthenticated={isAuthenticated} />
      ) : null}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <Home />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/resultados"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <SearchResult />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <Home />
            ) : (
              <Register setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/inicio"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <Home />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/post/:id"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <Detail />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="favoritos"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <Favorites />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/ubiForm"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <UbiForm userData={userData} />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/mensajes/*"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <Messages registration={SWregistration} />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/micuenta"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <Account setUserData={setUserData} setAuth={setAuth} />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/mas"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <More />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/createstore"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <CreateStore />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/mitienda/:storeId"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <MyStore />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/misventas"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <MySales />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/tienda/:linkName"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <Store userData={userData} />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/consultas"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <Queries />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/faq"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <Faq />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <Dashboard />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/agregarproducto"
          element={
            isAuthenticated || isAuthenticatedAuth0 ? (
              <AddProduct  />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route path="/forgotpassword" element={<ForgotPassword />} />

        <Route path="/resetpassword/:id" element={<ResetPassword />} />
        
      </Routes>
    </>
  );
}

export { App, socket };
