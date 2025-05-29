import { useRef } from 'react';
import { Button } from './Buttons';

function StoreSearch({ onSearch }: { onSearch: (query: string) => void }) {
    const searchRef = useRef<HTMLInputElement>(null);

    const handleSearch = () => {
        const query = searchRef.current?.value.trim() || '';
        onSearch(query);
    };
    return (
        <div className="flex items-center gap-2 p-4">
            <input
                ref={searchRef}
                type="text"
                placeholder="Search by name or address"
                className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
            />
            <Button onClick={handleSearch}>Search</Button>
        </div>
    );
}

export default StoreSearch;
