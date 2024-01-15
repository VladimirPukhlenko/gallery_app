"use client";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import LoginForm from "./LoginForm";

const LoginModal: FC = () => {
  const [open, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>

      <div className="flex flex-col gap-4">
        <DialogContent className="md:max-w-screen-sm flex flex-col gap-6 border dark:border-neutral-600">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          <LoginForm setIsOpen={setIsOpen} />
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default LoginModal;
