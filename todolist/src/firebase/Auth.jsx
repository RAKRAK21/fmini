import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { authService } from '../firebase/fbInstance';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setIsLoggedIn, newAccount = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const onChange = (e) => {
        const { target: { name, value } } = e;
        if (name === "email") setEmail(value);
        else if (name === "password") setPassword(value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            // let data;
            if(newAccount) {
                // data = 
                await createUserWithEmailAndPassword(authService, email, password);
                setMessage("회원가입에 성공했습니다!");
            } else {
                // data = 
                await signInWithEmailAndPassword(authService, email, password);
                setMessage("로그인에 성공했습니다!");
            }
            setIsLoggedIn(true);
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {newAccount ? "회원가입" : "로그인"}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">이메일 주소</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="이메일 주소"
                                value={email}
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">비밀번호</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="비밀번호"
                                value={password}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {newAccount ? "회원가입" : "로그인"}
                        </button>
                    </div>
                </form>

                {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
                {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}

                <div className="text-sm text-center mt-4">
                    <span 
                        className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                        onClick={() => navigate(newAccount ? '/login' : '/signup')}
                    >
                        {newAccount ? "이미 계정이 있으신가요? 로그인하기" : "계정이 없으신가요? 회원가입하기"}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Auth;