import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import House from './component/hr/house/House';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<div>Admin page</div>} />
          <Route path='/house' element={<House />} />
          <Route exact path="/" element={<div>Client Page</div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
