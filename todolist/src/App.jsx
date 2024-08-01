// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import './index.css';
// import Todolist from './components/Todolist';
// import Calendar from './components/calendar/Calendar';
// import Board from './components/Board';
// import Nav from './components/Nav';
// import Auth from './firebase/Auth';
// import { authService } from './firebase/fbInstance';
// import { onAuthStateChanged } from 'firebase/auth';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [init, setInit] = useState(false);

//   useEffect(() => {
//     onAuthStateChanged(authService, (user) => {
//       if (user) {
//         setIsLoggedIn(true);
//       } else {
//         setIsLoggedIn(false);
//       }
//       setInit(true);
//     });
//   }, []);

//   const ProtectedRoute = ({ children }) => {
//     if (!isLoggedIn) {
//       return <Navigate to="/login" />;
//     }
//     return children;
//   };

//   if (!init) {
//     return <div>ing</div>;
//   }

//   return (
//     <Router>
//       <div className="App">
//         <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
//         <div className="content mt-[60px]">
//           <Routes>
//             <Route path="/login" element={
//               !isLoggedIn ? <Auth setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />
//             } />
//             <Route path="/signup" element={
//               !isLoggedIn ? <Auth setIsLoggedIn={setIsLoggedIn} newAccount={true} /> : <Navigate to="/" />
//             } />
//             <Route path="/" element={
//               <ProtectedRoute>
//                 <Todolist currentDate={new Date()} />
//               </ProtectedRoute>
//             } />
//             <Route path="/todolist" element={
//               <ProtectedRoute>
//                 <Todolist currentDate={new Date()} />
//               </ProtectedRoute>
//             } />
//             <Route path="/calendar" element={
//               <ProtectedRoute>
//                 <Calendar />
//               </ProtectedRoute>
//             } />
//             <Route path="/board" element={
//               <ProtectedRoute>
//                 <Board />
//               </ProtectedRoute>
//             } />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { authService } from './firebase/fbInstance';
import './index.css';
import Todolist from './components/Todolist';
import Calendar from './components/calendar/Calendar';
import Board from './components/board/Board';
import Nav from './components/Nav';
import Auth from './firebase/Auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [init, setInit] = useState(false);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  if (!init) {
    return <div>초기화 중...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <div className="content mt-[60px]">
          <Routes>
            <Route path="/login" element={
              !isLoggedIn ? <Auth setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />
            } />
            <Route path="/signup" element={
              !isLoggedIn ? <Auth setIsLoggedIn={setIsLoggedIn} newAccount={true} /> : <Navigate to="/" />
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Todolist userObj={userObj} />
              </ProtectedRoute>
            } />
            <Route path="/todolist" element={
              <ProtectedRoute>
                <Todolist userObj={userObj} />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <Calendar userObj={userObj} />
              </ProtectedRoute>
            } />
            <Route path="/board" element={
              <ProtectedRoute>
                <Board userObj={userObj} />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;