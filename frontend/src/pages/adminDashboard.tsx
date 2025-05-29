import axios from "axios"
import { useEffect, useState } from "react"

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

    const [store, setStore] = useState<Store[]>([])

    useEffect(() => {
        async function StoreDetails() {
            const response = await axios.get("http://localhost:3000/app/admin/dashboard/stores", {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            setStore(response.data.storesDetails)
        }
        StoreDetails();
    }, [])

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        async function UsersDetails() {
            const response = await axios.get("http://localhost:3000/app/admin/dashboard/users", {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            setUsers(response.data.usersDetails)
        }
        UsersDetails();
    }, [])

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">

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


            <div>
                <h2 className="text-2xl font-semibold mb-4">Stores Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

            <div>
                <h2 className="text-2xl font-semibold mb-4">Users Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    );
}