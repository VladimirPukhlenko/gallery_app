"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { AxiosError } from "axios";
import { useAuth } from "@/providers/AuthProvider";
import { useRef, useState } from "react";
import { HiEye } from "react-icons/hi";
import { ErrorRes } from "@/types/error.interface";
import {
  confirmationData,
  confirmationSchema,
} from "@/schemas/confirmationSchema";

const Confirmation = ({
  searchParams,
}: {
  searchParams: { email: string };
}) => {
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { setUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const toggleVisibilityAndFocus = () => {
    setIsVisible((prev) => !prev);
    setTimeout(() => {
      passwordRef.current!.selectionStart = passwordRef.current!.value.length;
    }, 0);
    passwordRef.current!.focus();
  };
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<confirmationData>({
    resolver: yupResolver(confirmationSchema),
    mode: "onTouched",
  });

  const { ref, ...rest } = register("password");
  const onSubmit = async (data: confirmationData) => {
    try {
      await AxiosInstanceClient.post("auth/recovery/confirmation", data);
      setUser(null);
      reset();
      router.replace("/");
      toast({
        title: "Success",
        description: "Password has been successfully changed.",
      });
    } catch (e) {
      const error = e as AxiosError<ErrorRes>;
      toast({
        title: "Error",
        description: error.response?.data.message,
      });
    }
  };
  return (
    <div className="flex flex-col relative  justify-start  flex-1 p-2 sm:p-8 md:justify-center md:p-10 lg:p-10">
      <form
        className="p-8 border dark:border-neutral-600 shadow-xl rounded-md flex  flex-col gap-3 xl:gap-12 items-center justify-center "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="">
          <h1 className="text-xl text-center mb-5">Change Password</h1>
          <p className="mb-3 text-sm text-justify">
            An email with a 5-symbols code has been sent to{" "}
            <b>{searchParams.email}</b>. Please enter this code in the field
            below, and then create a new password.
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <Input
                type="text"
                placeholder="Recovery key..."
                className={`mb-2 ${
                  errors.password
                    ? "focus-visible:outline-red-500 focus-visible:ring-1 "
                    : ""
                }`}
                {...register("key")}
              />
              <p className=" text-xs font-normal text-red-500 h-3">
                {errors.key?.message}
              </p>
            </div>
            <div className="relative">
              <Input
                placeholder="New password..."
                className={`mb-2 pr-12 ${
                  errors.password
                    ? "focus-visible:outline-red-500 focus-visible:ring-1 "
                    : ""
                }`}
                type={isVisible ? "text" : "password"}
                {...rest}
                name="password"
                ref={(e: HTMLInputElement) => {
                  ref(e);
                  passwordRef.current = e;
                }}
              />
              <HiEye
                onClick={toggleVisibilityAndFocus}
                className={`absolute top-2 right-3 cursor-pointer text-2xl ${
                  isVisible ? `text-gray-800` : `text-gray-200`
                }`}
              />
              <p className=" text-xs font-normal text-red-500 h-3">
                {errors.password?.message}
              </p>
            </div>
          </div>
        </div>

        <Button className="ml-auto w-24">Submit</Button>
      </form>
    </div>
  );
};

export default Confirmation;
