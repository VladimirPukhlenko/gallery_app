import React, { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import { HiEye } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { ErrorRes } from "@/types/error.interface";
import {
  RegistrationData,
  registrationSchema,
} from "@/schemas/registrationSchema";

type Props = {
  setSubmited: Dispatch<SetStateAction<boolean>>;
};

const RegistrationForm: FC<Props> = ({ setSubmited }) => {
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: yupResolver(registrationSchema),
    mode: "onTouched",
  });
  const { ref, ...rest } = register("password");

  const toggleVisibilityAndFocus = () => {
    setIsVisible((prev) => !prev);
    setTimeout(() => {
      passwordRef.current!.selectionStart = passwordRef.current!.value.length;
    }, 0);
    passwordRef.current!.focus();
  };

  const onSubmit = async (data: RegistrationData) => {
    try {
      await AxiosInstanceClient.post("auth/registration", data);
      toast({
        title: "Success",
        description: "Account has been successfully created",
      });
      setSubmited(true);
      reset();
      setTimeout(() => {
        router.push("/");
      }, 4000);
    } catch (e) {
      const error = e as AxiosError<ErrorRes>;
      toast({
        title: "Error",
        description: error.response?.data.message,
      });
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-start sm:justify-center p-1 md:p-5 md:px-8"
      >
        <div className="flex flex-col justify-start sm:justify-center gap-4 flex-1 p-8 border dark:border-neutral-600  shadow-xl rounded-md">
          <div className="flex flex-col  gap-4 ">
            <div className="flex justify-between">
              <Label htmlFor="fullName">Full name</Label>
              <p className="text-xs h-1 font-medium text-red-500">
                {errors?.fullName && errors.fullName.message}
              </p>
            </div>
            <Input
              id="fullName"
              placeholder="Enter your full name..."
              {...register("fullName")}
            />
          </div>
          <div className="flex flex-col  gap-4">
            <div className="flex justify-between">
              <Label htmlFor="email">Email address</Label>
              <p className="text-xs h-1 font-medium text-red-500">
                {errors?.email && errors.email.message}
              </p>
            </div>

            <Input
              id="email"
              placeholder="Enter your email  address..."
              {...register("email")}
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <p className="text-xs h-1 font-medium text-red-500">
                {errors?.password && errors.password.message}
              </p>
            </div>

            <div className="relative flex items-center">
              <Input
                id="password"
                placeholder="Create your password..."
                type={isVisible ? "text" : "password"}
                className={`pr-12`}
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
            </div>
          </div>
          <Button className=" w-24 mt-5 ml-auto " type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
