import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSlider = ({ slides = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Default slides if none provided
    const defaultSlides = [
        {
            id: 1,
            title: 'DỤNG CỤ CƠ KHÍ CHÍNH XÁC',
            subtitle: 'Chất lượng cao - Giá cạnh tranh',
            image: '/banners/banner1.jpg',
            cta: 'Xem ngay',
            link: '/products'
        },
        {
            id: 2,
            title: 'THƯƠNG HIỆU HÀNG ĐẦU',
            subtitle: 'Kyocera, Guhring, Winstar',
            image: '/banners/banner2.jpg',
            cta: 'Khám phá',
            link: '/products'
        },
        {
            id: 3,
            title: 'HỖ TRỢ KỸ THUẬT 24/7',
            subtitle: 'Tư vấn chuyên nghiệp - Giao hàng nhanh',
            image: '/banners/banner3.jpg',
            cta: 'Liên hệ',
            link: '/contact'
        }
    ];

    const activeSlides = slides.length > 0 ? slides : defaultSlides;

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, activeSlides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    return (
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-br from-[#1B2631] to-[#2c3e50] group">
            {/* Slides */}
            {activeSlides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                        }`}
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1B2631]/90 to-[#1B2631]/50 z-10"></div>

                    {/* Content */}
                    <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 uppercase tracking-tight leading-tight">
                                {slide.title}
                            </h2>
                            <p className="text-xl md:text-2xl text-[#EDB917] font-bold mb-8 italic">
                                {slide.subtitle}
                            </p>
                            <a
                                href={slide.link}
                                className="inline-block bg-[#EDB917] hover:bg-[#d4a615] text-[#1B2631] px-8 py-4 rounded-lg font-black uppercase tracking-wider text-sm transition-all transform hover:scale-105 shadow-xl"
                            >
                                {slide.cta}
                            </a>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {activeSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all ${index === currentSlide
                                ? 'w-8 bg-[#EDB917]'
                                : 'w-2 bg-white/50 hover:bg-white/75'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
