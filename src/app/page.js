import Banner from "@/components/Banner";
import FeaturedClasses from "@/components/FeaturedClasses";
import LatestPosts from "@/components/LatestPosts";

export default function HomePage() {
    return (
        <main >
            {/* Banner Section */}
          <Banner/>

            {/* Dynamic Section 1: Top Booked Classes */}
            <FeaturedClasses />

            {/* Dynamic Section 2: Latest Forum Posts  */}
            <LatestPosts />

            {/* Custom Static Sections */}

        </main>
    );
}
