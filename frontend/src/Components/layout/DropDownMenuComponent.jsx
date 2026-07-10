import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/UI/dropdown-menu";
import { getCurrentUser } from "@/Services/user";
import {
  EllipsisVertical,
  PencilIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

const DropdownMenuComponent = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    getCurrentUser().then((user) => {
      if (res) {
        setUser(user);
      }
    });
  }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="text-white text-title cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShareIcon />
            Share
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMenuComponent;
