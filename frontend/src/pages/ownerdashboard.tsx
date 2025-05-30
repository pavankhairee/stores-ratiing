import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "../component/Buttons";
import PasswordUpdateModal from "../component/UpdatePassword";
import { useNavigate } from "react-router";

type StoreRating = {
    store_id: number;
    store_name: string;
    average_rating: string;
    total_ratings: string;
};


export function OwnerDashboard() {
    const [store, setStore] = useState([]);
    const [avgRating, setAvgRating] = useState<StoreRating[]>([]);

    useEffect(() => {
        async function getUsers() {
            try {
                const response = await axios.get("http://localhost:3000/app/owner/ratings", {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                setStore(response.data.ratings);
                setAvgRating(response.data.AvgQueryResult)

                console.log(response.data.AvgQueryResult);
            } catch (error) {
                console.error("Error fetching ratings:", error);
            }
        }

        getUsers();
    }, []);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex gap-2">
                <Button onClick={() => {
                    localStorage.removeItem("token")
                    navigate("/")
                }}>Logout</Button>
                <Button onClick={() => setShowModal(true)} className="bg-blue-600 text-white">
                    Change Password
                </Button>
                <PasswordUpdateModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                />
            </div>


            {avgRating.map((store) => (
                <div key={store.store_id} className="text-center my-6">
                    <h1 className="text-2xl font-bold text-blue-800">
                        {store.store_name}
                    </h1>
                    <div className=" text-gray-700">
                        <p><span className="font-medium">Store ID:</span> {store.store_id}</p>
                        <p><span className="font-medium">Average Rating:</span> {store.average_rating}</p>
                        <p><span className="font-medium">Total Ratings:</span> {store.total_ratings}</p>
                    </div>
                </div>
            ))}



            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.map((s: any, index: number) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{s.name}</h2>
                        <p className="text-gray-600">
                            <span className="font-semibold">Email:</span> {s.email}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Address:</span> {s.address}
                        </p>
                        <p className="text-yellow-600 font-medium mt-2">
                            <span className="font-semibold">Rating:</span> {s.rating}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
