import { Search } from 'lucide-react';

import { Label } from '@/components/ui/label';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from '@/components/ui/sidebar';

export function SidebarSearch({
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<'form'>, 'onChange'> & {
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <form {...props}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search..."
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="pl-7 bg-sidebar-accent/40 text-sidebar-foreground placeholder:text-sidebar-foreground/50 border-sidebar-border/70 ring-1 ring-transparent focus-visible:ring-sidebar-ring/60 focus-visible:border-sidebar-border focus-visible:ring-2 focus-visible:ring-offset-0 rounded-md text-xs font-medium h-8"
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground select-none" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
