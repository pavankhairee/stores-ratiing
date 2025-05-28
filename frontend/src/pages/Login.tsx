import axios from "axios"
import { useRef } from "react"
import { Input } from "../component/Input"
import { Button } from "../component/Buttons"
import { useNavigate } from "react-router"


export function Login() {   
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    async function login() {
        const email = emailRef.current?.value
        const password = passwordRef.current?.value

        const response = await axios.post("http://localhost:3000/app/user/login", {
            email, password
        })
        const jwt = response.data.token;
        localStorage.setItem("token", jwt)
        navigate("/home")
    }


    return (
        <>
            <div>
                <Input typeField={"text"} placeholder={"Enter Email"} refInput={emailRef}></Input>
                <Input typeField={"password"} placeholder={"Enter Password"} refInput={passwordRef}></Input>
                <Button onClick={login}>LogIn</Button>
            </div>
        </>
    )
}