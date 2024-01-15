"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IAlbumItem } from "@/types/album.interface";
import { FC, useState } from "react";
type Props = {
  allAlbums: IAlbumItem[];
};
const MobileAlbumMenu: FC<Props> = ({ allAlbums }) => {
  const [open, setOpen] = useState(false);
  const albums = allAlbums.map((album) => ({
    value: album.name.toLowerCase(),
    label: album.name,
    id: album._id,
  }));
  const [value, setValue] = useState(albums.at(0)?.value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[160px] justify-between"
        >
          {value
            ? albums.find((album) => album.value === value)?.label
            : "Select album..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search album..." className="h-9" />
          <CommandEmpty>No album found.</CommandEmpty>
          <CommandGroup>
            {albums.map((album) => (
              <Link href={`/albums/${album.id}`} key={album.id}>
                <CommandItem
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {album.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === album.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default MobileAlbumMenu;
