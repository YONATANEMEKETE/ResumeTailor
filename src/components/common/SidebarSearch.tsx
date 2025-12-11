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
            className="pl-8 border-border text-foreground placeholder:text-muted-foreground focus-visible:border-border focus-visible:ring-0 focus-visible:ring-offset-0 bg-background rounded-lg text-sm font-medium"
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground select-none" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
