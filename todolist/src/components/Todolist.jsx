// import React, { useState, useEffect } from 'react';
// import Todohead from './Todohead';
// import Todocreate from './Todocreate';
// import Todoitem from './Todoitem';
// // import { getDate } from 'date-fns';

// const Todolist = () => {
//   const getDateKey = (date) => {
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
//   };

//   const [todos, setTodos] = useState(() => {
//     // 초기 상태를 함수로 제공하여 컴포넌트 마운트 시 한 번만 실행되도록 함
//     const savedDate = localStorage.getItem('currentDate');
//     const currentDate = savedDate ? new Date(savedDate) : new Date();
//     const dateKey = getDateKey(currentDate);
//     return JSON.parse(localStorage.getItem(dateKey)) || [];
//   });
  
//   const [currentDate, setCurrentDate] = useState(() => {
//     const savedDate = localStorage.getItem('currentDate');
//     return savedDate ? new Date(savedDate) : new Date();
//   });

//   useEffect(() => {
//     const checkDateChange = () => {
//       const newDate = new Date();
//       if (getDateKey(newDate) !== getDateKey(currentDate)) {
//         setCurrentDate(newDate);
//         localStorage.setItem('currentDate', newDate.toISOString()); // 로컬 스토리지에 새로운 현재 날짜 저장.
//         const dateKey = getDateKey(newDate); // 새로운 날짜 키 생성
//         const savedTodos = JSON.parse(localStorage.getItem(dateKey)) || []; // 로컬 스토리지에서 새로운 날짜의 할 일 목록 가져옴.
//         setTodos(savedTodos);
//       }
//     }; // 날짜가 변경되면 그 때 할일 목록을 로컬에 저장해줌.

//     // 1분마다 날짜 변경 체크
//     const intervalId = setInterval(checkDateChange, 2000);

//     return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
//   }, [currentDate]);

//   useEffect(() => {
//     const dateKey = getDateKey(currentDate);
//     localStorage.setItem(dateKey, JSON.stringify(todos));
//     localStorage.setItem('currentDate', currentDate.toISOString());
//   }, [todos, currentDate]); // 투두가 변경되거나 currentdate가 변경될 때마다 로컬에 저장.

//   const addTodo = (text) => {
//     const newTodos = [...todos, { text, completed: false }];
//     setTodos(newTodos);
//   };

//   const toggleTodo = (index) => {
//     const newTodos = [...todos];
//     newTodos[index].completed = !newTodos[index].completed;
//     setTodos(newTodos);
//   };

//   const removeTodo = (index) => {
//     const newTodos = [...todos];
//     newTodos.splice(index, 1);
//     setTodos(newTodos);
//   };

//   const updateTodo = (index, newText) => {
//     const newTodos = [...todos];
//     newTodos[index].text = newText;
//     setTodos(newTodos);
//   };

//   return (
//     <>
//       <Todohead currentDate={currentDate} />
//       <div className="flex flex-col items-center">
//         <div className="w-full max-w-md p-4 bg-gray-100 rounded-lg shadow-md mt-4">
//           <Todocreate addTodo={addTodo} />
//           <ul>
//             {todos.map((todo, index) => (
//               <Todoitem
//                 key={index}
//                 todo={todo}
//                 toggleTodo={() => toggleTodo(index)}
//                 removeTodo={() => removeTodo(index)}
//                 updateTodo={(newText) => updateTodo(index, newText)}
//               />
//             ))}
//           </ul>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Todolist;

import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { dbService } from '../firebase/fbInstance';
import Todohead from './Todohead';
import Todocreate from './Todocreate';
import Todoitem from './Todoitem';

const Todolist = ({ userObj }) => {
  const [todos, setTodos] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (!userObj) return;

    const q = query(
      collection(dbService, "todos"),
      where("userId", "==", userObj.uid),
      where("date", "==", currentDate.toISOString().split('T')[0])
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedTodos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(fetchedTodos);
    });

    return () => unsubscribe();
  }, [userObj, currentDate]);

  const addTodo = async (text) => {
    if (!userObj) return;

    const newTodo = {
      text,
      completed: false,
      userId: userObj.uid,
      date: currentDate.toISOString().split('T')[0],
      createdAt: serverTimestamp()
    };
    await addDoc(collection(dbService, "todos"), newTodo);
  };

  const toggleTodo = async (id) => {
    const todoRef = doc(dbService, "todos", id);
    const todo = todos.find(todo => todo.id === id);
    await updateDoc(todoRef, { completed: !todo.completed });
  };

  const removeTodo = async (id) => {
    await deleteDoc(doc(dbService, "todos", id));
  };

  const updateTodo = async (id, newText) => {
    const todoRef = doc(dbService, "todos", id);
    await updateDoc(todoRef, { text: newText });
  };

  const changeDate = (amount) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + amount);
    setCurrentDate(newDate);
  };

  useEffect(() => {
    const checkDateChange = () => {
      const now = new Date();
      if (now.toDateString() !== currentDate.toDateString()) {
        setCurrentDate(now);
      }
    };

    const intervalId = setInterval(checkDateChange, 60000); // 1분마다 체크

    return () => clearInterval(intervalId);
  }, [currentDate]);

  if (!userObj) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <>
      <Todohead 
        currentDate={currentDate} 
        onPrevDay={() => changeDate(-1)}
        onNextDay={() => changeDate(1)}
      />
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md p-4 bg-gray-100 rounded-lg shadow-md mt-4">
          <Todocreate addTodo={addTodo} />
          <ul>
            {todos.map((todo) => (
              <Todoitem
                key={todo.id}
                todo={todo}
                toggleTodo={() => toggleTodo(todo.id)}
                removeTodo={() => removeTodo(todo.id)}
                updateTodo={(newText) => updateTodo(todo.id, newText)}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Todolist;