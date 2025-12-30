import React, { useState } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';
import SITE_CONFIG from '../config/site';

const FloatingContact = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Expanded Menu */}
            <div className={`flex flex-col gap-3 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>

                {/* Zalo Button */}
                <a
                    href={`https://zalo.me/${SITE_CONFIG.contact.phoneRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors group"
                >
                    <span className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">Chat Zalo</span>
                    <div className="w-8 h-8 flex items-center justify-center font-black text-xl italic">Z</div>
                </a>

                {/* Messenger Button (Example - Replace link if needed) */}
                {/* <a 
                    href="https://m.me/yourpageid" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-blue-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors group"
                >
                    <span className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">Messenger</span>
                    <MessageCircle size={24} />
                </a> */}

                {/* Call Button */}
                <a
                    href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                    className="flex items-center gap-3 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-700 transition-colors group"
                >
                    <span className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">Gọi ngay</span>
                    <Phone size={24} />
                </a>
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-gray-600 rotate-90' : 'bg-[#EDB917] hover:scale-110 animate-bounce-slow'}`}
            >
                {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={28} className="text-[#1B2631]" />}
            </button>
        </div>
    );
};

export default FloatingContact;
