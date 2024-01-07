import React, { FC, ReactElement } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
type Props = {
  title: string;
  subtitle: string;
};
const NoContent: FC<Props> = ({ title, subtitle }) => {
  return (
    <div className=" flex flex-col items-center text-center">
      <Image
        src={"/images/no-pictures.png"}
        alt="no content"
        width={250}
        height={250}
        objectFit="contain"
        className={`invert-0 dark:invert`}
      />
      <div className="flex flex-col items-center  gap-2 sm:gap-6">
        <div className="flex flex-col items-center">
          <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
          <h3 className="text-base sm:text-lg ">{subtitle}</h3>
        </div>
        <Link href={"/"}>
          <Button className="h-8">Gallery page</Button>
        </Link>
      </div>
    </div>
  );
};

export default NoContent;
