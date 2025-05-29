import React from "react";

export default function StoreRatingsCards({ ratings }: { ratings: any[] }) {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Store Rating Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ratings.map((store) => (
                    <div
                        key={store.store_id}
                        className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
                    >
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">{store.store_name}</h3>
                        <p className="text-gray-700">
                            <span className="font-medium">Store ID:</span> {store.store_id}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Average Rating:</span> {store.average_rating}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium">Total Ratings:</span> {store.total_ratings}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
