"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/_components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { cn } from "@/app/_lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";

interface User {
  user_id: string;
  user_name: string;
}

interface ComboboxUserProps {
  onUserSelect: (userId: string, userName: string) => void;
}

export function ComboboxUsers({ onUserSelect }: ComboboxUserProps) {
  console.log("onUserSelect recebido:", onUserSelect);
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState<User[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Erro ao buscar usuários", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedUser ? selectedUser.user_name : "Selecione um usuário..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar usuário..." />
          <CommandList>
            <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.user_id}
                  onSelect={() => {
                    console.log(
                      "Chamando onUserSelect com:",
                      user.user_id,
                      user.user_name,
                    );
                    setSelectedUser(user);
                    setOpen(false);
                    onUserSelect(user.user_id, user.user_name);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedUser?.user_id === user.user_id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {user.user_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
