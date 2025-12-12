import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MoreVertical, Trash2, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '../ui/input';
import { getRelativeTime } from '@/lib/getRelativeTime';

interface ConversationCardProps {
  id: string;
  title: string;
  updatedAt: Date;
  isActive?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onRename?: (newTitle: string) => void;
}

const ConversationCard = ({
  id,
  title,
  updatedAt,
  isActive = false,
  onClick,
  onDelete,
  onRename,
}: ConversationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus and select text when entering rename mode
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  // Handle saving the renamed title
  const handleBlur = () => {
    const trimmedTitle = editedTitle.trim();

    // Only save if the title has changed
    if (trimmedTitle && trimmedTitle !== title) {
      onRename?.(trimmedTitle);
    } else {
      // Reset to original title if empty or unchanged
      setEditedTitle(title);
    }

    setIsRenaming(false);
  };

  // Handle Enter key to save
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsRenaming(false);
    }
  };

  return (
    <div
      className={cn(
        'w-full flex items-start justify-between gap-2 p-2 py-0.5 rounded-lg transition-colors cursor-pointer relative',
        'hover:bg-accent/50',
        isActive && 'bg-accent/50 ring-1 ring-secondary'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onClick}
        className="flex-1 flex flex-col items-start min-w-0 cursor-pointer"
      >
        {isRenaming ? (
          <Input
            ref={inputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="text-sm font-medium w-full text-start border border-border rounded  focus:outline-none focus:ring-1 focus:ring-primary focus-visible:ring-0 focus-visible:ring-offset-0 focus-within:border-none bg-accent h-5 pl-0.5 border-none"
          />
        ) : (
          <p className="text-sm font-medium truncate w-full text-start">
            {title}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {getRelativeTime(updatedAt)}
        </p>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'shrink-0 transition-opacity p-1 bg-accent rounded cursor-pointer absolute right-1 top-1',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-40">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsRenaming(true);
            }}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ConversationCard;
