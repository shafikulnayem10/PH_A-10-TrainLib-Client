import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
    {
        name: "David Miller",
        role: "Powerlifter",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120",
        quote: "The specific class booking metrics allowed me to discover the Strength Training Powerlifting track. It completely transformed how I structure my mechanical fatigue limits."
    },
    {
        name: "Emily Watson",
        role: "Yoga Practitioner",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120",
        quote: "The interactive ecosystem here is beautiful. Being able to read certified guides in the forum while executing live routines keeps my accountability metrics flawless."
    },
    {
        name: "Marcus Sterling",
        role: "Calisthenics Coach",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120",
        quote: "As a community fitness contributor, managing my personal knowledge articles via the forum framework while seeing users track progress is incredibly rewarding."
    }
];

const TestimonialsSection = () => {
    return (
        <section className="py-20 bg-slate-50/40 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center mb-16">
                    <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full">
                        Success Stories
                    </span>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-4">
                        What Our Members Say
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <div 
                            key={index}
                            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 text-xs italic leading-relaxed">
                                    "{item.quote}"
                                </p>
                            </div>

                            <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/40">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                                />
                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                        {item.name}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        {item.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default TestimonialsSection;