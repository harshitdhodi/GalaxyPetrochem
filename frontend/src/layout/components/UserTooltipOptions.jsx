'use client'
import React from 'react'
import { 
  UserCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Link } from 'react-router-dom'

export function UserTooltipOptions({ 
  state, 
  options,
  onOptionSelect 
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger className="w-full">
          <div className="w-full flex justify-center items-center">
            <UserCircle 
              className={cn(
                "h-5 w-5", 
                state.includes('collapsed') ? "w-9" : "w-16"
              )} 
            />
            {!state.includes('collapsed') && (
              <span className="ml-2">User</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="p-1 px-4 bg-white shadow-lg rounded-md border"
        >
          <div className="space-y-1">
            {options.map((option, index) => (
              <Link 
                key={index}
                to={option.value} 
                className="block"
                onClick={() => onOptionSelect?.(option.label)}
              >
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-2 hover:bg-gray-100"
                >
                  {option.label}
                </Button>
              </Link>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default UserTooltipOptions