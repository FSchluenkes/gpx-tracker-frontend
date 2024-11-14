// components/Header.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header
      id="header"
      className="flex flex-row justify-between items-center p-4 border-b"
    >
      <div className="flex flex-grow">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="text-foreground text-lg"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <ModeToggle />
      </div>
    </header>
  );
}
