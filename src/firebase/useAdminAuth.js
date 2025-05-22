import { useState, useEffect } from 'react';
export const useAdminAuth = (schoolId) => {
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        // Check if the provided school ID matches the admin ID
        if (schoolId === '40226906') {
            setIsAdmin(true);
        }
        else {
            setIsAdmin(false);
        }
    }, [schoolId]);
    return isAdmin;
};
