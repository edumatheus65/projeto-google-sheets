// app/_components/user-profile-dropdown.tsx
"use client";

import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { User } from "../src/domains/user/entities/User";

interface UserProfileDropdownProps {
  user: User | null;
  logout: () => Promise<void>;
}

export function UserProfileDropdown({
  user,
  logout,
}: UserProfileDropdownProps) {
  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-3">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`Avatar de ${user.name}`}
              className="h-9 w-9 rounded-full"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-sm font-semibold">
              {user.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "U"}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Você pode adicionar mais itens aqui no futuro */}
        {/* <DropdownMenuItem onSelect={() => router.push('/profile')}>Perfil</DropdownMenuItem> */}
        {/* <DropdownMenuItem onSelect={() => router.push('/settings')}>Configurações</DropdownMenuItem> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
