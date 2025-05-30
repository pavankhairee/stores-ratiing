import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Button } from "../component/Buttons";
import { useNavigate } from "react-router";
import StoreSearch from "../component/SearchBar";
import { Input } from "../component/Input";
import PasswordUpdateModal from "../component/UpdatePassword";

interface StoreDetails {
    id: number;
    store_name: string;
    address: string;
    overall_rating: number | null;
    user_rating: number | null;
}

export function Home() {
    const [store, setStore] = useState<StoreDetails[]>([])
    const [showModal, setShowModal] = useState(false);

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

    const searchRef = useRef<HTMLInputElement>(null)
    const [search, setSearch] = useState();

    const handleSearch = async () => {
        const query = searchRef.current?.value.trim();

        const response = await axios.get("http://localhost:3000/app/search", {
            params: { query }, headers: {
                Authorization: localStorage.getItem("token")
            }
        });
        setSearch(response.data.stores);
    }

    useEffect(() => {
        handleSearch()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-4 flex flex-wrap gap-2 items-center">
                <Button
                    className="bg-red-500 text-white hover:bg-red-600"
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                    }}
                >
                    Logout
                </Button>

                <Input
                    typeField="text"
                    refInput={searchRef}
                    placeholder="Enter a search query"
                    className="w-full max-w-sm"
                />

                <Button
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    onClick={handleSearch}
                >
                    Search
                </Button>

                {search && (
                    <Button
                        className="bg-gray-500 text-white hover:bg-gray-600"
                        onClick={() => setSearch(null)}
                    >
                        Back to All Stores
                    </Button>
                )}

                <Button onClick={() => setShowModal(true)} className="bg-blue-600 text-white">
                    Change Password
                </Button>
                <PasswordUpdateModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                />

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {(search ?? store)?.map((s) => (
                    <div
                        key={s.id}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
                    >
                        <h2 className="text-2xl font-bold text-blue-800 mb-2">{s.store_name}</h2>
                        <p className="text-gray-600 mb-1">
                            <span className="font-semibold">Address:</span> {s.address}
                        </p>
                        <p className="text-gray-700 mb-1">
                            <span className="font-semibold">Your Rating:</span> {s.user_rating ?? "Not Rated"}
                        </p>
                        <p className="text-gray-700 mb-3">
                            <span className="font-semibold">Avg. Rating:</span>{" "}
                            {s.overall_rating ?? "No ratings yet"}
                        </p>

                        <div className="flex gap-2 mt-4">
                            {!s.user_rating ? (
                                <Button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    onClick={() => handleAddRating(s.id)}
                                >
                                    Add Rating
                                </Button>
                            ) : (
                                <Button
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                    onClick={() => handleUpdateRating(s.id)}
                                >
                                    Update Rating
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );


}
