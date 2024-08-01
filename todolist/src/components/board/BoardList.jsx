import React from 'react';

const BoardList = ({ diaries, onWriteClick, onEditClick, onDeleteClick }) => {
    return (
      <div className="flex flex-col items-center"> {/* 이 div를 추가하여 내용을 세로로 정렬합니다 */}
        <img src={`${process.env.PUBLIC_URL}/fmbc.png`} alt="Logo" className="mt-3 w-20 h-20 " />
        <div className="w-full mt-5 mb-8 bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">DIARY</h2>
            <button
              onClick={onWriteClick}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              글쓰기
            </button>
          </div>
          {diaries.map((diary) => (
            <div key={diary.id} className="bg-white p-3 rounded-lg mb-2 shadow">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{diary.title} ({new Date(diary.createdAt).toLocaleDateString()})</h3>
                <div className="text-sm text-gray-500">
                  <span className="cursor-pointer mr-2" onClick={() => onEditClick(diary)}>edit</span>
                  <span className="cursor-pointer" onClick={() => onDeleteClick(diary.id)}>remove</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default BoardList;