import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className=" flex flex-col py-20 items-center text-center">
      <Image
        src={"/images/not-found.png"}
        alt="not-found"
        width={350}
        height={350}
        className={`invert-0 dark:invert`}
      />
      <div className="flex flex-col items-center  gap-2 sm:gap-6">
        <div className="flex flex-col items-center">
          <h1 className="text-xl sm:text-2xl font-bold">Page Not Found</h1>
          <h3 className="text-base sm:text-lg ">
            Could not find requested resource
          </h3>
        </div>
        <Link href={"/"}>
          <Button className="h-8">Gallery page</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
