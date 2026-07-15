'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import {
  User,
  Settings,
  Package,
  Heart,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { getInitials } from '@/lib/utils';


export function ProfileDropdown() {

  const { data: session } = useSession();


  if (!session?.user) {
    return (
      <Link href="/login">
        <Button
          variant="default"
          size="sm"
        >
          Sign in
        </Button>
      </Link>
    );
  }


  const user = session.user;

  const isAdmin =
    user.role === 'ADMIN' ||
    user.role === 'SUPER_ADMIN';



  return (
    <DropdownMenu>


      <DropdownMenuTrigger asChild>

        <Avatar
          className="
            h-9
            w-9
            cursor-pointer
            ring-2
            ring-foreground/10
            hover:ring-primary/50
            transition-all
            duration-300
            hover:shadow-glow
          "
        >

          <AvatarImage
            src={user.image || ''}
            alt={user.name || ''}
          />

          <AvatarFallback
            className="
              bg-primary/10
              text-primary
              font-semibold
            "
          >
            {getInitials(user.name)}
          </AvatarFallback>

        </Avatar>

      </DropdownMenuTrigger>




      <DropdownMenuContent
        className="w-60 rounded-2xl p-1.5 glass shadow-premium"
        align="end"
        forceMount
      >


        <DropdownMenuLabel className="font-normal px-3 py-2">

          <div className="flex flex-col space-y-1">

            <p className="text-sm font-semibold leading-none">
              {user.name}
            </p>

            <p className="text-xs leading-none text-muted-foreground mt-1">
              {user.email}
            </p>

          </div>

        </DropdownMenuLabel>



        <DropdownMenuSeparator className="my-1" />



        <DropdownMenuItem asChild>
          <Link href="/account">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>



        <DropdownMenuItem asChild>
          <Link href="/account/orders">
            <Package className="mr-2 h-4 w-4" />
            Orders
          </Link>
        </DropdownMenuItem>



        <DropdownMenuItem asChild>
          <Link href="/account/wishlist">
            <Heart className="mr-2 h-4 w-4" />
            Wishlist
          </Link>
        </DropdownMenuItem>



        <DropdownMenuItem asChild>
          <Link href="/account/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>




        {isAdmin && (

          <>
            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              asChild
              className="text-primary"
            >
              <Link href="/admin">

                <LayoutDashboard className="mr-2 h-4 w-4" />

                Admin Panel

              </Link>

            </DropdownMenuItem>

          </>

        )}





        <DropdownMenuSeparator className="my-1" />



        <DropdownMenuItem
          onClick={() =>
            signOut({
              callbackUrl: '/',
            })
          }
          className="
            text-destructive
            focus:text-destructive
            focus:bg-destructive/10
          "
        >

          <LogOut className="mr-2 h-4 w-4" />

          Log out

        </DropdownMenuItem>



      </DropdownMenuContent>


    </DropdownMenu>
  );
}