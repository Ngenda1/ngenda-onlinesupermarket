import { useNavigate } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { LogIn, LogOut, UserRound, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface NavigationMenuProps {
  isAuthenticated: boolean;
}

export function NavigationMenu({ isAuthenticated }: NavigationMenuProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleLogoutClick = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <Menubar className="border-none bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">Menu</MenubarTrigger>
        <MenubarContent>
          {isAuthenticated ? (
            <>
              <MenubarItem onClick={handleProfileClick}>
                <UserRound className="mr-2 h-4 w-4" />
                Profile
              </MenubarItem>
              <MenubarItem onClick={handleCartClick}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={handleLogoutClick}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </MenubarItem>
            </>
          ) : (
            <MenubarItem onClick={handleLoginClick}>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </MenubarItem>
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}