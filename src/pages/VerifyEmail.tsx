import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyEmail: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/quiz');
    }, [navigate]);
    return null;
};

export default VerifyEmail; 