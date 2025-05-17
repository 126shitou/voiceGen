'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User as UserIcon, LogOut, Settings, CreditCard } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { signOut } from 'next-auth/react';

interface UserMenuProps {
  user: {
    uid: string;
    email: string | null | undefined;
    displayName: string | null | undefined;
    photoURL: string | null | undefined;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus:outline-none">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.displayName && (
              <p className="font-medium">{user.displayName}</p>
            )}
            {user?.email && (
              <p className="text-sm text-muted-foreground truncate w-40">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer flex w-full items-center">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>{t('userMenu.dashboard')}</span>
          </Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem asChild>
          <Link href="/dashboard/billing" className="cursor-pointer flex w-full items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>{t('userMenu.billing')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="cursor-pointer flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('userMenu.settings')}</span>
          </Link>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
            setOpen(false);
          }}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('userMenu.signOut')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}