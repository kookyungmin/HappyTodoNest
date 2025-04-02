import { useState } from "react";
import { loginByEmailAndPasswordAction } from "../service/SecurityService.js";
const serverHost = import.meta.env.VITE_SERVER_HOST;

export default function LoginForm({ onSuccess, onFailure }) {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ rememberMe, setRememberMe ] = useState(false);

    const login = async (event) => {
        event.preventDefault();
        if (!email?.trim()) {
            //이메일을 입력해주세요.
            alert('Input your Email!');
            return;
        }
        if (!password?.trim()) {
            //패스워드를 입력해주세요.
            alert('Input your Password!');
            return;
        }

        const { isError, data } = await loginByEmailAndPasswordAction({ email, password, rememberMe });
        if (isError) {
            onFailure(data);
            return;
        }
        onSuccess(data);
    };

    const snsLogin = (registrationId) => {
        window.location.href = `${serverHost}/api/oauth2/authorization/${registrationId}`;
    };

    return (
        <form className={'w-full p-5'} onSubmit={login}>
            <div className="mb-5">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                    email</label>
                <input id="email"
                       value={email}
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       placeholder="input your ID"
                       onChange={(event) => setEmail(event.target.value)}
                />
            </div>
            <div className="mb-5">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                    password</label>
                <input type="password" id="password"
                       value={password}
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       placeholder="input your password"
                       onChange={(event) => setPassword(event.target.value)}
                />
            </div>
            <div className="flex items-start mb-5">
                <div className="flex items-center h-5">
                    <input id="remember" type="checkbox" value={rememberMe}
                           onChange={(event) => setRememberMe(event.target.checked)}
                           className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />
                </div>
                <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Remember me
                </label>
            </div>
            <button type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit
            </button>
            <button type="button"
                    onClick={() => snsLogin('google')}
                    className="ml-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Google
            </button>
            <button type="button"
                    onClick={() => snsLogin('kakao')}
                    className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Kakao
            </button>
        </form>
    )
};