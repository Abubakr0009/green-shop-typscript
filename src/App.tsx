import "./App.css";
import { Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import Home from "./pages/home";
import Navbar from "../src/components/NavBar/index";
import Shop from "./pages/Shop/index";
import Footer from "./components/Footer";
import Profile from "./pages/Profile/Profile";
import Account from "./pages/Profile/ProfileComponents/Account";
import MyProducts from "./pages/Profile/ProfileComponents/MyProducts";
import Wishlist from "./pages/Profile/ProfileComponents/Wishlist";
import Track from "./pages/Profile/ProfileComponents/Track";
import { ConfigProvider, App as AntdApp } from "antd";
import { Toaster } from "sonner";
import Address from "./pages/Profile/ProfileComponents/Address";

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <AntdApp>
        <Toaster position="top-right" richColors />
        <Navbar />
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Shop />} path="/shop" />
          <Route element={<Profile />} path="/profile">
            <Route element={<Account />} path="account" />
            <Route element={<MyProducts />} path="myproducts" />
            <Route element={<Address />} path="address" />
            <Route element={<Wishlist />} path="wishlist" />
            <Route element={<Track />} path="track" />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;






// const [users, setUsers] = useState([])

    // async function getData() {
    //     const res = await axios.get('https://dummyjson.com/users');
    //     setUsers(res.data.users)
    // }

    // useEffect(() => {
    //     getData();
    // }, [])

    // console.log(users);






{/* <div>
                <ul className='grid grid-cols-5'>
                    {users.map((person: Person) => (
                        <li className='w-[300px] border-4 mx-auto text-center bg-green-500 text-[#ffffff]' key={person.id}>
                            <h3>Name: {person.firstName}</h3>
                            <h3>Surname: {person.lastName}</h3>
                            <span>Age: {person.age}</span>
                            <p>Address: {person.address.address} -- {person.address.city}</p>
                            <p>Role: {person.role}</p>
                            <br />
                        </li>
                    ))}
                </ul>
            </div> */}