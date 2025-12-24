import React from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

const Lightbox = ({ isOpen, imageUrl, alt, onClose }) => {
    const [zoom, setZoom] = React.useState(1);

    if (!isOpen) return null;

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-[10000] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-md"
            >
                <X className="h-6 w-6" />
            </button>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[10000] flex gap-2 bg-white/10 backdrop-blur-md rounded-full p-2">
                <button
                    onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all"
                >
                    <ZoomOut className="h-5 w-5" />
                </button>
                <span className="text-white font-black px-4 flex items-center text-sm">
                    {Math.round(zoom * 100)}%
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all"
                >
                    <ZoomIn className="h-5 w-5" />
                </button>
            </div>

            {/* Image */}
            <div
                className="relative max-w-7xl max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={imageUrl}
                    alt={alt}
                    className="w-auto h-auto max-w-full max-h-[90vh] object-contain transition-transform duration-300"
                    style={{ transform: `scale(${zoom})` }}
                />
            </div>
        </div>
    );
};

export default Lightbox;
