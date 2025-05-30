import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Button } from "../component/Buttons";
import { AddStorePopup } from "../component/AddStorePop";
import { AddUserPopup } from "../component/AddUserPopup";
import { useNavigate } from "react-router";
import { Input } from "../component/Input";
import PasswordUpdateModal from "../component/UpdatePassword";

interface DashboardCounts {
    totalUsers: number;
    totalStores: number;
    totalRatings: number;
}

interface Store {
    name: string;
    email: string;
    address: string;
    rating: string;
}

interface User {
    name: string;
    email: string;
    address: string;
    role: string;
}

export function AdminDashboard() {
    const [showPopup, setShowPopup] = useState(false)
    const [showUserPopup, setShowUserPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);


    const [stats, setStats] = useState<DashboardCounts | null>(null);

    useEffect(() => {
        async function getStats() {
            const response = await axios.get("http://localhost:3000/app/admin/dashboard/stats", {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            setStats(response.data)
        }
        getStats()
    }, [])

    const [users, setUsers] = useState<User[]>([]);
    const [store, setStore] = useState<Store[]>([]);

    const fetchStores = async () => {
        try {
            const response = await axios.get("http://localhost:3000/app/admin/dashboard/stores", {
                headers: { Authorization: localStorage.getItem("token") || "" },
            });
            setStore(response.data.storesDetails);
        } catch (error) {
            console.error("Failed to fetch stores", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/app/admin/dashboard/users", {
                headers: { Authorization: localStorage.getItem("token") || "" },
            });
            setUsers(response.data.usersDetails);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };


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
        setSearch(response.data.users);
    }

    useEffect(() => {
        fetchStores();
        fetchUsers();
        handleSearch();
    }, []);

    const navigate = useNavigate();

    return (
        <div className="p-2 bg-gray-50 min-h-screen space-y-6">

            <div className="p-4 flex flex-wrap gap-2 items-center">
                <Button onClick={() => setShowUserPopup(true)}>Add User</Button>

                {showUserPopup && (
                    <AddUserPopup
                        onClose={() => setShowUserPopup(false)}
                        onUserAdded={fetchUsers}
                    />
                )}

                <Button onClick={() => setShowPopup(true)}>Add Store</Button>

                {showPopup && (
                    <AddStorePopup
                        onClose={() => setShowPopup(false)}
                        onStoreAdded={fetchStores}
                    />
                )}

                <Input typeField="text" refInput={searchRef} placeholder="Enter a search query" />

                <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleSearch}>Search</Button>

                {search && (
                    <Button className="bg-gray-500 text-white hover:bg-gray-600" onClick={() => setSearch(null)}>
                        All Stores</Button>
                )}

                <Button onClick={() => setShowModal(true)} className="bg-blue-600 text-white">
                    Change Password
                </Button>
                <PasswordUpdateModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                />
                <Button onClick={() => {
                    localStorage.removeItem("token")
                    navigate("/")
                }}>Logout</Button>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold">Total Users</h2>
                    <p className="text-3xl mt-2">{stats?.totalUsers ?? '-'}</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold">Total Stores</h2>
                    <p className="text-3xl mt-2">{stats?.totalStores ?? '-'}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold">Total Ratings</h2>
                    <p className="text-3xl mt-2">{stats?.totalRatings ?? '-'}</p>
                </div>
            </div>


            <div className="flex flex-col lg:flex-row gap-6 px-4 py-6">

                <div className="w-full lg:w-1/2">
                    <h2 className="text-2xl font-semibold mb-4">Stores Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {store.map((store, idx) => (
                            <div key={idx} className="bg-white border border-green-200 rounded-xl p-4 shadow">
                                <h3 className="text-xl font-semibold text-green-700">{store.name}</h3>
                                <p className="text-sm text-gray-600">Email: {store.email}</p>
                                <p className="text-sm text-gray-600">Address: {store.address}</p>
                                <p className="text-sm text-gray-800 font-medium">Rating: {store.rating ?? 'Not Rated'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Users Overview - Right Side */}
                <div className="w-full lg:w-1/2">
                    <h2 className="text-2xl font-semibold mb-4">Users Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {users.map((user, idx) => (
                            <div key={idx} className="bg-white border border-blue-200 rounded-xl p-4 shadow">
                                <h3 className="text-lg font-semibold text-blue-700">{user.name}</h3>
                                <p className="text-sm text-gray-600">Email: {user.email}</p>
                                <p className="text-sm text-gray-600">Address: {user.address}</p>
                                <p className="text-sm text-gray-800 font-medium">Role: {user.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}


