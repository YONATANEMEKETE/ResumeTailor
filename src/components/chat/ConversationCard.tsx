import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MoreVertical, Trash2, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ConversationCardProps {
  id: string;
  title: string;
  updatedAt: Date;
  isActive?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onRename?: () => void;
}

const ConversationCard = ({
  title,
  updatedAt,
  isActive = false,
  onClick,
  onDelete,
  onRename,
}: ConversationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Format relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      className={cn(
        'w-full flex items-start justify-between gap-2 p-2 rounded-lg transition-colors cursor-pointer',
        'hover:bg-accent/50',
        isActive && 'bg-accent'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onClick}
        className="flex-1 flex flex-col items-start min-w-0"
      >
        <p className="text-sm font-medium truncate w-full">{title}</p>
        <p className="text-xs text-muted-foreground">
          {getRelativeTime(updatedAt)}
        </p>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'shrink-0 transition-opacity p-1 hover:bg-accent rounded cursor-pointer',
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
              onRename?.();
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
