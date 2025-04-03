import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Settings,
  FileText,
  History,
  Star,
  Box,
  Blocks,
  Paintbrush,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DocumentationInterface() {
  const [openSections, setOpenSections] = useState({
    playground: true,
    models: false,
    documentation: false,
    settings: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="grid h-screen grid-cols-[270px_1fr]">
      {/* Sidebar */}
      <div className="border-r bg-background">
        
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="p-4 space-y-8">
            <div>
              <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                Platform
              </h3>
              <div className="space-y-1">
                <Collapsible
                  open={openSections.playground}
                  onOpenChange={() => toggleSection("playground")}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Playground
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 ml-auto transition-transform",
                          {
                            "-rotate-90": !openSections.playground,
                          }
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                    >
                      <History className="w-4 h-4" />
                      History
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                    >
                      <Star className="w-4 h-4" />
                      Starred
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Button>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible
                  open={openSections.models}
                  onOpenChange={() => toggleSection("models")}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                    >
                      <Blocks className="w-4 h-4" />
                      Models
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 ml-auto transition-transform",
                          {
                            "-rotate-90": !openSections.models,
                          }
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                    >
                      Model 1
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                    >
                      Model 2
                    </Button>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible
                  open={openSections.documentation}
                  onOpenChange={() => toggleSection("documentation")}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                    >
                      <FileText className="w-4 h-4" />
                      Documentation
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 ml-auto transition-transform",
                          {
                            "-rotate-90": !openSections.documentation,
                          }
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                    >
                      Getting Started
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                    >
                      API Reference
                    </Button>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible
                  open={openSections.settings}
                  onOpenChange={() => toggleSection("settings")}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 ml-auto transition-transform",
                          {
                            "-rotate-90": !openSections.settings,
                          }
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                    >
                      General
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 font-normal"
                    >
                      Security
                    </Button>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                Projects
              </h3>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 font-normal"
                >
                  <Paintbrush className="w-4 h-4" />
                  Design Engineering
                </Button>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 font-normal"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">
                    SC
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">shadcn</div>
                  <div className="text-xs text-muted-foreground">
                    m@example.com
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 ml-auto" />
              </div>
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>Building Your Application</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-foreground">Data Fetching</span>
        </nav>
      </div>
    </div>
  );
}
