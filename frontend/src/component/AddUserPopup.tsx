import { useRef } from 'react';
import { Button } from './Buttons';

interface AddUserPopupProps {
    onClose: () => void;
    onUserAdded: () => void;
}

export function AddUserPopup({ onClose, onUserAdded }: AddUserPopupProps) {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);
    const roleRef = useRef<HTMLSelectElement>(null);

    const handleSubmit = async () => {
        const name = nameRef.current?.value;
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        const address = addressRef.current?.value;
        const role = roleRef.current?.value;

        if (!name || !email || !password || !address || !role) {
            alert('Please fill all fields');
            return;
        }

        try {
            await fetch('http://localhost:3000/app/admin/add-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token') || '',
                },
                body: JSON.stringify({ name, email, password, address, role }),
            }).then(() => window.location.reload());

            onUserAdded();
            onClose();
        } catch (err) {
            console.error('Error adding user:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl space-y-4">
                <h2 className="text-xl font-semibold mb-2">Add New User</h2>

                <input ref={nameRef} type="text" placeholder="Name" className="w-full border rounded px-3 py-2" />
                <input ref={emailRef} type="email" placeholder="Email" className="w-full border rounded px-3 py-2" />
                <input ref={passwordRef} type="password" placeholder="Password" className="w-full border rounded px-3 py-2" />
                <input ref={addressRef} type="text" placeholder="Address" className="w-full border rounded px-3 py-2" />

                <select ref={roleRef} className="w-full border rounded px-3 py-2">
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="store_owner">Store Owner</option>
                    <option value="admin">Admin</option>
                </select>

                <div className="flex justify-end space-x-3 pt-2">
                    <Button className="bg-gray-400 hover:bg-gray-500" onClick={onClose}>Cancel</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>Add User</Button>
                </div>
            </div>
        </div>
    );
}
