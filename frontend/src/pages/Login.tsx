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
            <div>
                <Input typeField={"text"} placeholder={"Enter Email"} refInput={emailRef}></Input>
                <Input typeField={"password"} placeholder={"Enter Password"} refInput={passwordRef}></Input>
                <Button onClick={login}>LogIn</Button>
                <Button onClick={() => setShowModal(true)} className="bg-blue-600 text-white">
                    Change Password
                </Button>
                <PasswordUpdateModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                />
            </div>
        </>
    )
}