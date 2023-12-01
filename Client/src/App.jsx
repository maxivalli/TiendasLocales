import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Landing from "./views/Landing/Landing";
import Home from "./views/Home/Home";
import Favorites from './views/Favorites/Favorites'
import Messages from './views/Messages/Messages'
import Account from './views/Account/Account'
import More from './views/More/More'

import CreateStore from './views/CreateStore/CreateStore'
import MyStore from "./views/MyStore/MyStore";
import Queries from './views/Queries/Queries'
import Faq from "./views/FAQ/Faq";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="favorites" element={<Favorites/>} />
        <Route path="/messages" element={<Messages/>} />
        <Route path="/account" element={<Account/>} />
        <Route path="/more" element={<More/>} />

        <Route path="/createstore" element={<CreateStore/>} />
        <Route path="/mystore" element={<MyStore/>} />
        <Route path="/queries" element={<Queries/>} />
        <Route path="/faq" element={<Faq/>} />
      </Routes>
    </>
  );
}

export default App;
