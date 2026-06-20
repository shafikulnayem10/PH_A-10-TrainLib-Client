import { getUserFavorites } from "@/lib/api/dashboard/user/user";
import { getUserSession } from "@/lib/core/session";
import { removeFavoriteAction } from "@/lib/actions/favorites";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import RemoveFavoriteBtn from "@/components/dashboard/RemoveFavoriteBtn";
import { Heart, BookOpen, Calendar } from "lucide-react";

export default async function FavoriteClassesPage() {
    const sessionUser = await getUserSession();
    const favoritesResponse = await getUserFavorites();
    const favoriteClasses = favoritesResponse?.data || [];

    const handleRemove = async (formData) => {
        'use server';
        const classId = formData.get("classId");
        const email = formData.get("userEmail");
        
        await removeFavoriteAction(classId, email);
        revalidatePath("/dashboard/user/favorites");
    };

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="border-b border-blue-100 pb-5">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                        <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-blue-950">
                            Favorite <span className="text-blue-600">Classes</span>
                        </h1>
                        <p className="text-sm text-blue-500 mt-1 font-medium">
                            Manage and explore the classes you saved for later.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100/30 border border-blue-100 rounded-xl px-5 py-3">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-blue-700">Total Favorites</span>
                </div>
                <div className="inline-flex items-center px-4 py-1.5 bg-white border border-blue-200 rounded-full text-sm font-black text-blue-600 shadow-sm">
                    {favoriteClasses.length} {favoriteClasses.length === 1 ? 'Class' : 'Classes'}
                </div>
            </div>

            {/* Empty State */}
            {favoriteClasses.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-blue-100 p-8 max-w-lg mx-auto shadow-sm shadow-blue-50">
                    <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-rose-50 rounded-full border border-rose-100">
                        <Heart className="w-10 h-10 text-rose-400" />
                    </div>
                    <h3 className="text-xl font-extrabold text-blue-950 tracking-tight">No Favorites Yet</h3>
                    <p className="text-blue-500 text-sm mt-2.5 max-w-xs mx-auto leading-relaxed font-medium">
                        You haven't added any classes to your favorites yet. Start exploring and save the ones you love!
                    </p>
                    <Link 
                        href="/classes" 
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm mt-8 px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition-all duration-200 hover:scale-[1.02]"
                    >
                        <BookOpen className="w-4 h-4" />
                        Browse Classes
                        <span className="text-lg">→</span>
                    </Link>
                </div>
            ) : (
                /* Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteClasses.map((item) => (
                        <div 
                            key={item._id} 
                            className="flex flex-col bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg hover:shadow-blue-100/50 hover:border-blue-200 transition-all duration-300 overflow-hidden group"
                        >
                            {/* Image */}
                            {item.image && (
                                <div className="relative overflow-hidden aspect-[16/10] bg-blue-50">
                                    <img 
                                        src={item.image} 
                                        alt={item.className || "Class"} 
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 via-transparent to-transparent" />
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex flex-col flex-1 p-5">
                                <h3 className="text-lg font-bold text-blue-950 group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {item.className || item.name}
                                </h3>
                                <p className="text-sm text-blue-600/80 line-clamp-2 mt-1.5 leading-relaxed flex-1 font-medium">
                                    {item.description || "No description available."}
                                </p>
                                
                                {/* Action Buttons */}
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-blue-50">
                                    <Link 
                                        href={`/classes/${item.classId}`} 
                                        className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 py-2 px-4 rounded-xl transition-all duration-200 border border-blue-100 hover:border-blue-600"
                                    >
                                        <Calendar className="w-3.5 h-3.5" />
                                        View Details
                                    </Link>
                                    
                                    <RemoveFavoriteBtn 
                                        classId={item.classId}
                                        userEmail={sessionUser?.email}
                                        onRemoveAction={handleRemove}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Note */}
            {favoriteClasses.length > 0 && (
                <div className="flex items-center justify-center gap-2 text-xs text-blue-400 font-medium pt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                    Showing {favoriteClasses.length} favorite class{favoriteClasses.length > 1 ? 'es' : ''}
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                </div>
            )}
        </div>
    );
}