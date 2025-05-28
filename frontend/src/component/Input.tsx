import { useState, type ReactElement, } from "react";
import { Eye, EyeOff } from "lucide-react";
export function Input({
    typeField,
    refInput,
    placeholder,
    EndIcon,
}: {
    EndIcon: ReactElement;
    typeField: string;
    placeholder: string;
    refInput: any;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = typeField === "password";

    return (
        <div className="relative flex items-center">
            <input
                type={isPassword && !showPassword ? "password" : "text"}
                ref={refInput}
                placeholder={placeholder}
                className="px-4 pr-10 border p-2 shadow focus: outline m-2 rounded-md focus:outline-none"
            />
            <span className="absolute right-4 text-gray-500 cursor-pointer">
                {isPassword ? (
                    <span onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                ) : (
                    EndIcon
                )}
            </span>
        </div>
    );
}
