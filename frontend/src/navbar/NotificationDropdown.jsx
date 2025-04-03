import React, { useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

const NotificationsDropdown = ({ 
    notifications, 
    isNotificationsOpen, 
    toggleNotifications, 
    removeNotification 
}) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                toggleNotifications(false); // Close the dropdown
            }
        };

        if (isNotificationsOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isNotificationsOpen, toggleNotifications]);

    return (
        <div className="relative" ref={dropdownRef}>
            <Bell
                className="w-6 h-6 cursor-pointer"
                onClick={toggleNotifications}
            />
            {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                </span>
            )}

            {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg p-2 z-20">
                    <div className="text-sm font-semibold text-gray-700 mb-2 border-b pb-2">
                        Notifications
                    </div>
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="flex justify-between items-start p-2 hover:bg-gray-100 rounded"
                        >
                            <div>
                                <p className="text-sm text-gray-800">{notification.message}</p>
                                <p className="text-xs text-gray-500">{notification.time}</p>
                            </div>
                            <X
                                className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700"
                                onClick={() => removeNotification(notification.id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;
