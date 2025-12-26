import React from 'react';

const Skeleton = ({ className = '', width, height, borderRadius = '0.5rem', circle = false }) => {
    return (
        <div
            className={`animate-pulse bg-gray-200 ${className}`}
            style={{
                width: width || '100%',
                height: height || '1rem',
                borderRadius: circle ? '50%' : borderRadius
            }}
        />
    );
};

export const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
        <Skeleton height="200px" />
        <div className="space-y-2">
            <Skeleton width="40%" height="0.75rem" />
            <Skeleton width="90%" height="1.25rem" />
            <div className="flex justify-between items-center pt-2">
                <Skeleton width="30%" height="1.5rem" />
                <Skeleton width="2rem" height="2rem" circle />
            </div>
        </div>
    </div>
);

export default Skeleton;
