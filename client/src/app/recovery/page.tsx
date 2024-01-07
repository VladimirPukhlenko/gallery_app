"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { ErrorRes } from "@/types/error.interface";
import { recoveryData, recoverySchema } from "@/schemas/recoverySchema";

const Recovery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<recoveryData>({
    resolver: yupResolver(recoverySchema),
    mode: "onTouched",
  });
  const onSubmit = async (data: recoveryData) => {
    console.log(data);
    try {
      setIsLoading(true);
      await AxiosInstanceClient.post("auth/recovery", data);
      router.push(`recovery/confirmation?email=${data.email}`);
    } catch (e) {
      const error = e as AxiosError<ErrorRes>;
      toast({
        title: "Error",
        description: error.response?.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col relative justify-start md:justify-center flex-1  p-2 sm:p-8 md:p-8 lg:p-20">
      <form
        className="border dark:border-neutral-600 p-8  shadow-xl rounded-md flex flex-col gap-24"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="">
          <h1 className="text-xl text-center mb-5">Your e-mail address</h1>
          <p className="mb-3">
            To change your password, you need to enter email address of your
            account.
          </p>
          <Input
            type="text"
            placeholder="Email..."
            className={`mb-2 ${
              errors.email
                ? "focus-visible:outline-red-500 focus-visible:ring-1 "
                : ""
            }`}
            {...register("email")}
          />
          <p className=" text-xs font-normal text-red-500 h-3">
            {errors.email?.message}
          </p>
        </div>

        <Button className="ml-auto w-28" disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default Recovery;
