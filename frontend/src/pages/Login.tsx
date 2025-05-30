import axios from "axios"
import { useRef, useState } from "react"
import { Input } from "../component/Input"
import { Button } from "../component/Buttons"
import { useNavigate } from "react-router"
import PasswordUpdateModal from "../component/UpdatePassword"


export function Login() {
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate()

    async function login() {
        const email = emailRef.current?.value
        const password = passwordRef.current?.value

        const response = await axios.post("http://localhost:3000/app/user/login", {
            email, password
        })
        const jwt = response.data.token;
        const role = response.data.role;
        console.log(role);

        localStorage.setItem("token", jwt)

        if (role === 'admin') {
            navigate('/dashboard');
        } else if (role === 'store_owner') {
            navigate('/ownerdash');
        } else {
            navigate('/home');
        }
    }


    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-center text-blue-700">Login</h2>

                    <div className="space-y-4">
                        <Input
                            typeField="text"
                            placeholder="Enter Email"
                            refInput={emailRef}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <Input
                            typeField="password"
                            placeholder="Enter Password"
                            refInput={passwordRef}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={login}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Log In
                        </Button>
                        <Button
                            onClick={() => setShowModal(true)}
                            className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
                        >
                            Change Password
                        </Button>
                    </div>
                </div>
            </div>

            <PasswordUpdateModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </>

    )
}