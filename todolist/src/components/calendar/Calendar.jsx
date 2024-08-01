// import React, { useState } from 'react';
// import CalendarHead from './CalendarHead';
// import CalendarBody from './CalendarBody';
// import TodoModal from './TodoModal';

// const Calendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [todos, setTodos] = useState([]);

//   const handleDateClick = (date) => {
//     setSelectedDate(date);
//     setModalOpen(true);
//     const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; // toISOString()은 UTC 기준으로 날짜를 반환하므로, 로컬 시간에 맞도록 해주어야 한다.
//     const savedTodos = JSON.parse(localStorage.getItem(dateKey)) || [];
//     setTodos(savedTodos);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//   }

//   return (
//     <div className="calendar-container flex flex-col items-center w-full max-w-4xl mx-auto h-full min-h-[800px]">
//       <CalendarHead currentDate={currentDate} setCurrentDate={setCurrentDate} />
//       <CalendarBody currentDate={currentDate} onDateClick={handleDateClick}/>
//       <TodoModal
//         isOpen={modalOpen}
//         onClose={handleCloseModal}
//         date={selectedDate}
//         todos={todos}
//       />
//     </div>
//   );
// };

// export default Calendar;


import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { dbService } from '../../firebase/fbInstance';
import CalendarHead from './CalendarHead';
import CalendarBody from './CalendarBody';
import TodoModal from './TodoModal';

const Calendar = ({ userObj }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (!userObj) {
      console.log("No user object, skipping Firestore query");
      return;
    }
  
    console.log("Querying Firestore for user:", userObj.uid);
  
    const q = query(
      collection(dbService, "todos"),
      where("userId", "==", userObj.uid)
    );
  
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const fetchedTodos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Fetched todos:", fetchedTodos);
        setTodos(fetchedTodos);
      },
      (error) => {
        console.error("Firestore query error:", error);
      }
    );
  
    return () => unsubscribe();
  }, [userObj]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  }

  const getSelectedDateTodos = () => {
    if (!selectedDate) return [];
    const dateString = selectedDate.toLocaleDateString('en-CA'); // 로컬 시간대로 변환
    return todos.filter(todo => todo.date === dateString);
  };

  // const filteredTodos = todos.filter(todo => {
  //   const todoDate = new Date(todo.date);
  //   return todoDate >= startOfMonth && todoDate <= endOfMonth;
  // });

  return (
    <div className="calendar-container flex flex-col items-center w-full max-w-4xl mx-auto h-full min-h-[800px]">
      <CalendarHead currentDate={currentDate} setCurrentDate={setCurrentDate} />
      <CalendarBody 
        currentDate={currentDate} 
        onDateClick={handleDateClick}
        todos={todos}
      />
      <TodoModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        date={selectedDate}
        todos={getSelectedDateTodos()}
      />
    </div>
  );
};

export default Calendar;