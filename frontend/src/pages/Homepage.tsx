import axios from "axios"
import { useEffect, useState } from "react"

interface StoreDetails {
    name: string,
    address: string,
    rating: string
}

export function Home() {
    const [store, setStore] = useState<StoreDetails[]>([])

    useEffect(() => {
        async function getDetails() {
            const response = await axios.get("http://localhost:3000/app/user/allstores", {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            setStore(response.data)
        }
        getDetails();
    }, [])


    return (
        <>
            <h1>can see all listed stores, user can submit rating</h1>
            <p>{JSON.stringify(store)}</p>
        </>
    )
}