import axios from "axios"
import { useEffect, useState } from "react"
import { Button } from "../component/Buttons";
import { useNavigate } from "react-router";

interface StoreDetails {
    id: number;
    store_name: string;
    address: string;
    overall_rating: number | null;
    user_rating: number | null;
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
            setStore(response.data.storesList);
        }
        getDetails()
    }, [])

    const handleAddRating = (store_id: number) => {

        const rating = prompt('Enter New Rating (1-5)')
        const parseRating = parseFloat(rating || "")
        if (!rating || isNaN(parseRating) || parseRating < 1 || parseRating > 5) {
            alert('Enter a Valid Rating between 1 and 5');
            return;
        }

        axios.post("http://localhost:3000/app/user/rating", {
            store_id: store_id,
            rating: parseFloat(rating)
        }, {
            headers: {
                Authorization: localStorage.getItem("token") || ""
            }
        }).then(() => window.location.reload());


    }

    const handleUpdateRating = (store_id: number) => {

        const rating = prompt('Enter New Rating (1-5)')
        const parseRating = parseFloat(rating || "")
        if (!rating || isNaN(parseRating) || parseRating < 1 || parseRating > 5) {
            alert('Enter a Valid Rating between 1 and 5');
            return;
        }

        axios.post("http://localhost:3000/app/user/rating", {
            store_id: store_id,
            rating: parseFloat(rating)
        }, {
            headers: {
                Authorization: localStorage.getItem("token") || ""
            }
        }).then(() => window.location.reload());

    }
    const navigate = useNavigate()

    return (
        <div>
            <div className="flex md:grid-cols-2 gap-4 p-6">
                {store.map((s) => (
                    <div key={s.id} className="border rounded-xl shadow p-4 bg-white w-max">
                        <h2 className="text-xl font-semibold">{s.store_name}</h2>
                        <p className="text-gray-600">Address: {s.address}</p>
                        <p className="text-gray-800">Your Rating: {s.user_rating ?? 'Not Rated'}</p>
                        <p className="text-gray-800">Avg. Rating: {s.overall_rating ?? 'No ratings yet'}</p>
                        <div className="mt-4 space-x-2">
                            {!s.user_rating && <Button
                                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                                onClick={() => handleAddRating(s.id)}
                            >
                                Add Rating
                            </Button>}
                            {s.user_rating && <Button
                                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                                onClick={() => handleUpdateRating(s.id)}
                            >
                                Update Rating
                            </Button>}
                        </div>
                    </div>
                ))}
            </div>
            <Button onClick={() => {
                localStorage.removeItem("token")
                navigate("/")
            }}>Logout</Button>
        </div >
    );
}