import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Home, MessageCircle, Users, Settings,
  Hotel, Car, MoreHorizontal, RefreshCw, Server, Briefcase
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sidebar, SidebarContent, SidebarHeader, useSidebar } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { UserTooltipOptions } from './UserTooltipOptions'


export function SidebarNav({ className, ...props }) {
  const location = useLocation()
  const { state } = useSidebar()

  const sidebarLinks = [
    { href: '/dashboard', title: 'Dashboard', icon: LayoutDashboard },
    { href: '/home', title: 'Home', icon: Home },
    { href: '/query', title: 'Query', icon: MessageCircle },
  ]


  return (
    <Sidebar variant="floating" collapsible="icon" className={className}>
      <SidebarHeader className="border-b px-2 py-2 h-14 flex justify-center items-center bg-white">
        <Link to="/" className="flex items-center space-x-2">
          <LayoutDashboard className="h-6 w-6" />
          {!state.includes('collapsed') && <span className="font-bold">Dashboard</span>}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-10rem)] px-1 bg-white">
          <div className="space-y-2 py-2">
            {sidebarLinks.map((link, index) => (
              <TooltipProvider key={index}>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger className="w-full">
                    <Button
                      variant={location.pathname === link.href ? 'secondary' : 'ghost'}
                      className="w-full flex items-center justify-start"
                      asChild
                    >
                      <Link to={link.href} className="flex items-center w-full">
                        <link.icon className="h-6 w-6 mr-2" />
                        {!state.includes('collapsed') && <span>{link.title}</span>}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{link.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}


export default SidebarNav
