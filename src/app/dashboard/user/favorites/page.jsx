import { getUserFavorites } from "@/lib/api/dashboard/user/user";
import { getUserSession } from "@/lib/core/session";
import { removeFavoriteAction } from "@/lib/actions/favorites";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import RemoveFavoriteBtn from "@/components/dashboard/RemoveFavoriteBtn"; 

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
        <div className="p-8 bg-white rounded-2xl border border-blue-50/60 shadow-sm min-h-[600px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-blue-100/50">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-blue-950">
                        My Favorite Classes
                    </h2>
                    <p className="text-sm text-blue-700/70 mt-1 font-medium">
                        Manage and explore the classes you saved for later.
                    </p>
                </div>
                <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100/70 rounded-full text-xs font-semibold">
                    Total: {favoriteClasses.length} {favoriteClasses.length === 1 ? 'Class' : 'Classes'}
                </div>
            </div>

            {favoriteClasses.length === 0 ? (
                <div className="text-center py-20 bg-blue-50/20 rounded-xl border border-dashed border-blue-200/60">
                    <div className="inline-flex p-4 bg-blue-50 text-blue-500 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </div>
                    <p className="text-blue-950 text-lg font-bold">You haven't added any favorites yet.</p>
                    <p className="text-sm text-blue-800/50 mt-1 max-w-xs mx-auto font-medium">Discover top courses and start saving your preferred classes today.</p>
                    <Link href="/all-classes" className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-5 rounded-xl mt-6 transition-colors shadow-sm shadow-blue-600/10">
                        Browse Classes
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteClasses.map((item) => (
                        <div key={item._id} className="flex flex-col bg-white rounded-xl border border-blue-100/70 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden group">
                            {item.image && (
                                <div className="relative overflow-hidden aspect-[16/10]">
                                    <img 
                                        src={item.image} 
                                        alt={item.className || "Class"} 
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                    />
                                </div>
                            )}
                            <div className="flex flex-col flex-1 p-5">
                                <h3 className="text-lg font-bold text-blue-950 group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {item.className || item.name}
                                </h3>
                                <p className="text-sm text-blue-900/80 line-clamp-2 mt-1.5 leading-relaxed flex-1 font-medium">
                                    {item.description || "No description available."}
                                </p>
                                
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-blue-50/60">
                                    <Link 
                                        href={`/classes/${item.classId}`} 
                                        className="inline-flex items-center justify-center text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100 py-2 px-4 rounded-lg transition-colors"
                                    >
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
        </div>
    );
}