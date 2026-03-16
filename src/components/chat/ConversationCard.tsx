import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare, MoreVertical, Trash2, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '../ui/input';
import { getRelativeTime } from '@/lib/getRelativeTime';

interface ConversationCardProps {
  title: string;
  updatedAt: Date;
  isActive?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onRename?: (newTitle: string) => void;
}

const ConversationCard = ({
  title,
  updatedAt,
  isActive = false,
  onClick,
  onDelete,
  onRename,
}: ConversationCardProps) => {
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
        'group w-full flex items-start justify-between gap-2 rounded-xl transition-colors cursor-pointer relative px-2.5 py-2',
        'hover:bg-sidebar-accent/60',
        isActive &&
          'bg-sidebar-accent/70 ring-1 ring-sidebar-border/70 shadow-sm'
      )}
    >
      <button
        onClick={onClick}
        className="flex-1 flex items-start gap-2.5 min-w-0 cursor-pointer text-left"
      >
        <div
          className={cn(
            'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ring-1',
            isActive
              ? 'bg-sidebar-primary/15 ring-sidebar-border/70 text-sidebar-foreground'
              : 'bg-sidebar-accent/40 ring-sidebar-border/60 text-sidebar-foreground/80'
          )}
          aria-hidden="true"
        >
          <MessageSquare className="size-4" />
        </div>

        <div className="flex-1 min-w-0 text-left">
          {isRenaming ? (
            <Input
              ref={inputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="h-7 px-2 text-sm font-medium w-full text-start rounded-lg bg-background/40 ring-1 ring-sidebar-border/70 focus-visible:ring-sidebar-ring/60 focus-visible:ring-2 focus-visible:ring-offset-0 border-none"
            />
          ) : (
            <p className="text-sm font-medium truncate w-full text-start">
              {title}
            </p>
          )}
          <p className="mt-0.5 text-xs text-sidebar-foreground/55 text-left">
            {getRelativeTime(updatedAt)}
          </p>
        </div>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'shrink-0 transition-opacity p-1.5 rounded-lg cursor-pointer absolute right-1.5 top-1.5',
              'bg-background/50 ring-1 ring-sidebar-border/60 backdrop-blur-sm',
              'opacity-0 pointer-events-none',
              'group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4 text-sidebar-foreground/70" />
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
