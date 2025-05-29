import { useRef } from 'react';
import axios from 'axios';

interface AddStorePopupProps {
    onClose: () => void;
    onStoreAdded: () => void;
}

export function AddStorePopup({ onClose, onStoreAdded }: AddStorePopupProps) {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);
    const ownerIdRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        const name = nameRef.current?.value;
        const email = emailRef.current?.value;
        const address = addressRef.current?.value;
        const owner_id = ownerIdRef.current?.value;

        if (!name || !email || !address || !owner_id) {
            alert('Please fill in all fields');
            return;
        }

        try {
            await axios.post('http://localhost:3000/app/admin/add-store', {
                name,
                email,
                address,
                owner_id: parseInt(owner_id),
            }, {
                headers: {
                    Authorization: localStorage.getItem('token') || '',
                }
            }).then(() => window.location.reload());
            onStoreAdded();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to add store');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-center">Add New Store</h2>

                <input ref={nameRef} type="text" placeholder="Store Name" className="w-full p-2 mb-3 border rounded" />
                <input ref={emailRef} type="email" placeholder="Email" className="w-full p-2 mb-3 border rounded" />
                <input ref={addressRef} type="text" placeholder="Address" className="w-full p-2 mb-3 border rounded" />
                <input ref={ownerIdRef} type="number" placeholder="Owner ID" className="w-full p-2 mb-4 border rounded" />

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Add Store
                    </button>
                </div>
            </div>
        </div>
    );
}
