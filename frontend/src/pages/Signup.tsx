import axios from "axios"
import { useRef } from "react"
import { Input } from "../component/Input"
import { Button } from "../component/Buttons"
import { useNavigate } from "react-router"



export function Signup() {


    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const addressRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate();

    async function signup() {
        const name = nameRef.current?.value
        const email = emailRef.current?.value
        const address = addressRef.current?.value
        const password = passwordRef.current?.value

        const response = await axios.post("http://localhost:3000/app/user/signup", {
            name, email, address, password
        })
        navigate("/login")
    }


    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-center text-green-700">Sign Up</h2>

                    <div className="space-y-4">
                        <Input
                            typeField="text"
                            placeholder="Enter Name"
                            refInput={nameRef}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <Input
                            typeField="text"
                            placeholder="Enter Email"
                            refInput={emailRef}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <Input
                            typeField="text"
                            placeholder="Enter Address"
                            refInput={addressRef}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <Input
                            typeField="password"
                            placeholder="Enter Password"
                            refInput={passwordRef}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            onClick={signup}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Sign Up
                        </Button>
                    </div>
                </div>
            </div>
        </>

    )
}