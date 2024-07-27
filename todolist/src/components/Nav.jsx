import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-400 to-green-400 p-4 fixed w-full top-0 z-10 m-0">
      <div className="flex justify-between items-center w-full px-4">
        <div className="flex items-center space-x-12">
          <Link to="/" className="text-white text-3xl font-bold font-permanent-marker">
            RAK
          </Link>
          <Link to="/todolist" className="text-white text-xl font-bold">
            투두리스트
          </Link>
          <Link to="/calendar" className="text-white text-xl font-bold">
            캘린더
          </Link>
          <Link to="/board" className="text-white text-xl font-bold">
            게시판
          </Link>
        </div>
        <div className="flex items-center space-x-8">
          <Link to="/signup" className="text-white text-xl font-bold">
            회원가입
          </Link>
          <Link to="/login" className="text-white text-xl font-bold">
            로그인
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
