import Image from "next/image";
import { Button } from "@heroui/react";
import Banner from "@/components/Banner"; 
import FeaturedClasses from "@/components/FeaturedClasses";

export default function Homepage() {
  return (
    <>
      <Banner />
    
      <FeaturedClasses /> 
    </>
  );
}
