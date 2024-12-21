import { useNavigate } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
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
    <div className="flex items-center gap-4">
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
      {isAuthenticated ? (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCartClick}
            className="hidden sm:flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleProfileClick}
            className="hidden sm:flex items-center gap-2"
          >
            <UserRound className="h-4 w-4" />
            Profile
          </Button>
          <Button
            onClick={handleLogoutClick}
            size="sm"
            className="bg-ngenda-600 hover:bg-ngenda-700 text-white"
          >
            Logout
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleLoginClick}
          size="sm"
          className="bg-ngenda-600 hover:bg-ngenda-700 text-white"
        >
          Login
        </Button>
      )}
    </div>
  );
}