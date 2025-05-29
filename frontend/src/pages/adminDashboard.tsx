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

    const [store, setStore] = useState<Store | null>(null)

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

    const [users, setUsers] = useState<User | null>(null);

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
        <>
            <h1>can see all stats about the store and </h1>
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
            <p>{JSON.stringify(stats)}</p>
            <p>{JSON.stringify(store)}</p>
            <p>{JSON.stringify(users)}</p>
        </>
    )
}