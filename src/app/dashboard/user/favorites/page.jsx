import { getUserFavorites } from "@/lib/api/dashboard/user/user";
import { getUserSession } from "@/lib/core/session";
import { removeFavoriteAction } from "@/lib/actions/favorites";
import { revalidatePath } from "next/cache";
import Link from "next/link";

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
        <div className="p-6 bg-base-100 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-primary">My Favorite Classes</h2>

            {favoriteClasses.length === 0 ? (
                <div className="text-center py-12 bg-base-200 rounded-lg">
                    <p className="text-base-content/70 text-lg">You haven't added any classes to your favorites yet.</p>
                    <Link href="/all-classes" className="btn btn-primary btn-sm mt-4">
                        Browse Classes
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteClasses.map((item) => (
                        <div key={item._id} className="card bg-base-200 shadow-sm border border-base-300">
                            {item.image && (
                                <figure className="px-4 pt-4">
                                    <img 
                                        src={item.image} 
                                        alt={item.className || "Class"} 
                                        className="rounded-xl h-48 w-full object-cover"
                                    />
                                </figure>
                            )}
                            <div className="card-body">
                                <h3 className="card-title text-xl">{item.className || item.name}</h3>
                                <p className="text-sm text-base-content/70 line-clamp-2">
                                    {item.description || "No description available."}
                                </p>
                                
                                <div className="card-actions justify-between items-center mt-4">
                                    <Link 
                                        href={`/classes/${item.classId}`} 
                                        className="btn btn-sm btn-outline btn-primary"
                                    >
                                        View Details
                                    </Link>
                                    
                                  
                                    <form action={handleRemove}>
                                        <input type="hidden" name="classId" value={item.classId} />
                                        <input type="hidden" name="userEmail" value={sessionUser?.email} />
                                        <button type="submit" className="btn btn-sm btn-error btn-ghost text-red-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                            Remove
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}