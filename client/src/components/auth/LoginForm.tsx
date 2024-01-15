import React, { FC, useRef, useState } from "react";
import { HiEye } from "react-icons/hi";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { useAuth } from "@/providers/AuthProvider";
import { TooltipLoginHelp } from "./LoginHelp";
import { ErrorRes } from "@/types/error.interface";
import { LoginUser } from "@/types/user.interface";
import { LoginData, loginSchema } from "@/schemas/loginSchema";
import { setToken } from "../../actions/cookiesManager";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginForm: FC<Props> = ({ setIsOpen }) => {
  const router = useRouter();
  const { setUser } = useAuth();
  const { toast } = useToast();
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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
  } = useForm<LoginData>({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  });

  const { ref, ...rest } = register("password");

  const onSubmit = async (data: LoginData) => {
    try {
      const { data: loginResData } = await AxiosInstanceClient.post<LoginUser>(
        "/auth/login",
        data
      );
      setUser(loginResData.user);

      setToken("access_token_client", loginResData.tokens.access_token);
      setToken("refresh_token_client", loginResData.tokens.refresh_token);

      setIsOpen(false);
      reset();
      router.refresh();
    } catch (e) {
      const error = e as AxiosError<ErrorRes>;
      toast({
        title: "Error",
        description: error.response?.data.message,
      });
    }
  };
  return (
    <form
      className=" flex flex-col gap-4 text-sm font-medium  "
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col  gap-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="email">
            Email address (test account: test@mail.com)
          </Label>
          <p className="h-1 flex items-center font-medium text-red-500">
            {errors.email && errors.email.message}
          </p>
        </div>
        <Input
          id="email"
          {...register("email")}
          placeholder="Enter your email address..."
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password (test account: 11111)</Label>
          <p className=" text-red-500 h-1 flex items-center">
            {errors.password && errors.password.message}
          </p>
        </div>

        <div className="flex flex-col text-xs gap-3">
          <div className="relative flex items-center">
            <Input
              id="password"
              placeholder="Enter your your password..."
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

          <div>
            Don't have an account ?{" "}
            <Link
              href="/registration"
              className="underline"
              onClick={() => setIsOpen(false)}
            >
              Create account
            </Link>
          </div>
        </div>
        <div className="flex justify-between">
          <TooltipLoginHelp setIsOpen={setIsOpen} />
          <Button type="submit" className="">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
