import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import LoginPage from './Pages/LoginPage/LoginPage';
import './index.css';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import { HeaderMegaMenu } from './Components/Navbar/HeaderMegaMenu';
import MyPage from './Pages/MyPage.jsx';
import DonatePage from './Pages/DonatePage.jsx';
import RequestPage from './Pages/RequestPage.jsx';


function App() {
  return (
    <Router>
        <HeaderMegaMenu/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<LoginPage/>} />
            <Route path = '/my' element = { <MyPage/> } />
            <Route path = '/donate' element = { <DonatePage/> } />
            <Route path = 'request' element = { <RequestPage/> } />
            <Route element={<PrivateRoute/>}>

            </Route>
        </Routes>
    </Router>
  )
}

export default App
