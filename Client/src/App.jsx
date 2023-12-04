import axios from "axios";
import Swal from "sweetalert2";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

import Navbar from "./components/Navbar/Navbar";

import Home from "./views/Home/Home";
import Favorites from "./views/Favorites/Favorites";
import Messages from "./views/Messages/Messages";
import Account from "./views/Account/Account";
import More from "./views/More/More";
import CreateStore from "./views/CreateStore/CreateStore";
import MyStore from "./views/MyStore/MyStore";
import Store from './views/Store/Store'
import Queries from "./views/Queries/Queries";
import Faq from "./views/FAQ/Faq";
import "./App.css";

function App() {
  axios.defaults.baseURL = "http://localhost:3001/";
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

            Swal.fire({
              icon: "success",
              title: `Bienvenido devuelta ${userByGoogle.username}`,
              text: "¡Te has logueado exitosamente!",
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
  const [userToken, setUserToken] = useState("");
  const [userData, setUserData] = useState(null);

  const setAuth = (status, user) => {
    setIsAuthenticated(status);
    setUserData(user);
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
                  rol: userDataResponse.data.rol,
                  averageRating: userDataResponse.data.averageRating,
                  plan: userDataResponse.data.plan,
                });
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

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        setAuth={setAuth}
        userData={userData}
      ></Navbar>
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
                <Home userData={user.name} setAuth={setAuth} />
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
        <Route path="/home" element={isAuthenticated ? (
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
                <Home userData={user.name} setAuth={setAuth} />
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
        <Route path="favorites" element={isAuthenticated ? (
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
                <Favorites userData={user.name} setAuth={setAuth} />
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
        <Route path="/messages" element={isAuthenticated ? (
              userData ? (
                <Messages userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <Messages userData={user.name} setAuth={setAuth} />
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
        <Route path="/account" element={isAuthenticated ? (
              userData ? (
                <Account userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <Account userData={user.name} setAuth={setAuth} />
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
        <Route path="/more" element={isAuthenticated ? (
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
                <More userData={user.name} setAuth={setAuth} />
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
        <Route path="/createstore" element={isAuthenticated ? (
              userData ? (
                <CreateStore userData={userData} setAuth={setAuth} />
              ) : (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              )
            ) : isAuthenticatedAuth0 ? (
              user ? (
                <CreateStore userData={user.name} setAuth={setAuth} />
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
        <Route path="/mystore" element={isAuthenticated ? (
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
                <MyStore userData={user.name} setAuth={setAuth} />
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
        <Route path="/store" element={isAuthenticated ? (
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
                <Store userData={user.name} setAuth={setAuth} />
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
        <Route path="/queries" element={isAuthenticated ? (
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
                <Queries userData={user.name} setAuth={setAuth} />
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
        <Route path="/faq" element={isAuthenticated ? (
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
                <Faq userData={user.name} setAuth={setAuth} />
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

export default App;
