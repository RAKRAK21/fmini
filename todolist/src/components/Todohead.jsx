import React, { useState, useEffect } from 'react';

const Todohead = () => {
  const [quote, setQuote] = useState(''); // 명언을 저장할 상태
  const [date, setDate] = useState(new Date()); // 현재 날짜를 저장할 상태

  // 명언을 가져오는 비동기 함수
  const fetchQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      setQuote(data.content); // 가져온 명언을 상태에 저장
    } catch (error) {
      console.error('Error fetching quote:', error); // 에러 처리
    }
  };

  // 컴포넌트가 마운트될 때 명언을 가져오고, 날짜를 업데이트하는 타이머를 설정
  useEffect(() => {
    fetchQuote(); // 명언을 가져오는 함수 호출

    // 1분마다 현재 날짜를 업데이트하는 타이머 설정
    const timer = setInterval(() => setDate(new Date()), 60000);

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4 text-black w-screen flex flex-col items-center">
      <img src={`${process.env.PUBLIC_URL}/fmbc.png`} alt="Logo" className="w-16 h-16 mb-4" />
      <h1 className="text-2xl">Today's ToDo List</h1>
      <p>{date.toLocaleDateString()}</p>
      <blockquote className="mt-2 italic text-center">"{quote}"</blockquote>
    </div>
  );
};

export default Todohead;
