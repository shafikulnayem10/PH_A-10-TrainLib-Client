import Banner from "@/components/Banner";
import FeaturedClasses from "@/components/FeaturedClasses";
import FeaturesSection from "@/components/FeaturesSection";
import LatestPosts from "@/components/LatestPosts";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function HomePage() {
    return (
        <main >
         
          <Banner/>

          <FeaturedClasses />

           
            <FeaturesSection />

           
            <LatestPosts />

          
            <TestimonialsSection />

        </main>
    );
}
