import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Todolist from './components/Todolist';
import Calendar from './components/calendar/Calendar';
import Board from './components/Board';
import Login from './components/Login';
import Nav from './components/Nav';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <div className="content mt-[60px]"> {/* 네비게이션 바의 높이만큼 패딩을 추가 */}
          <Routes>
            <Route path="/" element={<Todolist currentDate={new Date()}/>} />
            <Route path="/todolist" element={<Todolist currentDate={new Date()}/>} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/board" element={<Board />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
