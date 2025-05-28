import axios from "axios"
import { useRef } from "react"
import { Input } from "../component/Input"
import { Button } from "../component/Buttons"



export function Signup() {

    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const addressRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    async function signup() {
        const name = nameRef.current?.value
        const email = emailRef.current?.value
        const address = addressRef.current?.value
        const password = passwordRef.current?.value

        const response = await axios.post("http://localhost:3000/app/user/signup", {
            name, email, address, password
        })

    }


    return (
        <>
            <div>
                <Input typeField={"text"} placeholder={"Enter Name"} refInput={nameRef}></Input>
                <Input typeField={"text"} placeholder={"Enter Email"} refInput={emailRef}></Input>
                <Input typeField={"text"} placeholder={"Enter Address"} refInput={addressRef}></Input>
                <Input typeField={"password"} placeholder={"Enter Password"} refInput={passwordRef}></Input>

                <Button onClick={signup}>Signup</Button>
            </div>
        </>
    )
}