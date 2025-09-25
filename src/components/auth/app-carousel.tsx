"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Users, MessageSquare, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselSlide {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    gradient: string;
}

const slides: CarouselSlide[] = [
    {
        id: 1,
        title: "Organize Your Tasks",
        description: "Create, manage, and track your tasks with our intuitive todo system. Stay on top of your productivity goals.",
        icon: <CheckCircle className="w-16 h-16" />,
        gradient: "bg-primary"
    },
    {
        id: 2,
        title: "Collaborate with Teams",
        description: "Work together seamlessly with your team members. Share tasks, assign responsibilities, and stay connected.",
        icon: <Users className="w-16 h-16" />,
        gradient: "bg-primary"
    },
    {
        id: 3,
        title: "Real-time Chat",
        description: "Communicate instantly with built-in chat functionality. Discuss tasks, share updates, and collaborate in real-time.",
        icon: <MessageSquare className="w-16 h-16" />,
        gradient: "bg-primary"
    },
    {
        id: 4,
        title: "Smart Notifications",
        description: "Never miss important updates with our intelligent notification system. Stay informed about task changes and deadlines.",
        icon: <Bell className="w-16 h-16" />,
        gradient: "bg-primary"
    }
];

export function AppCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* Slide Container */}
            <div
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide) => (
                    <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
                        {/* Background */}
                        <div className={`absolute inset-0 ${slide.gradient} dark:bg-black opacity-90`} />

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center">
                            <div className="bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full p-6 mb-8 shadow-2xl">
                                <div className="text-white">
                                    {slide.icon}
                                </div>
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                                {slide.title}
                            </h3>

                            <p className="text-lg text-white/90 max-w-md leading-relaxed">
                                {slide.description}
                            </p>
                        </div>

                        {/* Overlay Pattern */}
                        <div className="absolute inset-0 opacity-20">
                            <div
                                className="w-full h-full"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={prevSlide}
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white shadow-lg"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={nextSlide}
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white shadow-lg"
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        title="#"
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                            ? "bg-white shadow-lg scale-125"
                            : "bg-white/50 hover:bg-white/70"
                            }`}
                    />
                ))}
            </div>



        </div>
    );
}
