import { useRef, useState } from "react";
import axios from "axios";
import { Button } from "./Buttons";
import { Input } from "./Input";

interface PasswordUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PasswordUpdateModal({ isOpen, onClose }: PasswordUpdateModalProps) {
    const oldPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleUpdate = async () => {
        const oldPassword = oldPasswordRef.current?.value.trim() || "";
        const newPassword = newPasswordRef.current?.value.trim() || "";

        try {
            const res = await axios.post(
                "http://localhost:3000/app/user/password-update",
                { oldPassword, newPassword },
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );

            if (res.data.error) {
                setError(res.data.error);
                setMessage("");
            } else {
                setMessage(res.data.message);
                setError("");

                if (oldPasswordRef.current) oldPasswordRef.current.value = "";
                if (newPasswordRef.current) newPasswordRef.current.value = "";

                setTimeout(() => onClose(), 1500);
            }
        } catch (err) {
            setError("Something went wrong.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold text-center text-blue-700 mb-4">Update Password</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
                        <Input
                            typeField="password"
                            placeholder="Enter old password"
                            refInput={oldPasswordRef}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <Input
                            typeField="password"
                            placeholder="Enter new password"
                            refInput={newPasswordRef}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={handleUpdate} className="bg-blue-600 text-white hover:bg-blue-700">
                            Update
                        </Button>
                    </div>

                    {message && <p className="text-green-600 text-center text-sm">{message}</p>}
                    {error && <p className="text-red-600 text-center text-sm">{error}</p>}
                </div>
            </div>
        </div>
    );
}
