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
                        <div className={`max-w-3xl transform transition-all duration-1000 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="h-1 w-12 bg-primary"></span>
                                <span className="text-primary text-xs font-black uppercase tracking-[0.5em]">{slide.cta}</span>
                            </div>
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-[0.9] italic" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                {slide.title}
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-200 font-medium mb-10 max-w-xl leading-relaxed">
                                {slide.subtitle}
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href={slide.link}
                                    className="group inline-flex items-center gap-3 bg-primary hover:bg-white text-navy px-10 py-5 rounded-full font-black uppercase tracking-wider text-xs transition-all shadow-glow hover:shadow-premium"
                                >
                                    Khám Phá Ngay
                                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a
                                    href="/contact"
                                    className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-10 py-5 rounded-full font-black uppercase tracking-wider text-xs transition-all border border-white/10"
                                >
                                    Liên Hệ Tư Vấn
                                </a>
                            </div>
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
