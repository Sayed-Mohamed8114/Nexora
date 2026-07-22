import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/UI/dropdown-menu";

import {
  EllipsisVertical,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

const DropdownMenuComponent = ({
  course,
  onEdit,
  onDelete,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer">
          <EllipsisVertical className="text-sky-900 text-title" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onEdit(course)} className={"cursor-pointer"}>
            <PencilIcon className="mr-2 h-4 w-4 " />
            Edit
          </DropdownMenuItem>


          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(course)}
            className={"cursor-pointer"}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMenuComponent;