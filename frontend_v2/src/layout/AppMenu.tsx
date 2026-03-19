/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

import { useAuth } from '@/contexts/AuthContext';

const AppMenu = () => {
    const { user } = useAuth();
    const { layoutConfig } = useContext(LayoutContext);

    const adminModel: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/admin' }]
        },
        {
            label: 'Management',
            items: [
                { label: 'Categories', icon: 'pi pi-fw pi-list', to: '/admin/categories' },
                { label: 'Services', icon: 'pi pi-fw pi-briefcase', to: '/admin/services' },
                { label: 'Bookings', icon: 'pi pi-fw pi-calendar', to: '/admin/bookings' },
                { label: 'Users', icon: 'pi pi-fw pi-users', to: '/admin/users' },
            ]
        },
        {
            label: 'Reports & Revenue',
            items: [
                { label: 'Payments', icon: 'pi pi-fw pi-wallet', to: '/admin/payments' },
                { label: 'Feedback', icon: 'pi pi-fw pi-comment', to: '/admin/feedback' },
                { label: 'Reports', icon: 'pi pi-fw pi-file-pdf', to: '/admin/reports' },
            ]
        },
        {
            label: 'System',
            items: [
                { label: 'Settings', icon: 'pi pi-fw pi-cog', to: '/admin/settings' },
                { label: 'CMS', icon: 'pi pi-fw pi-desktop', to: '/admin/cms' },
            ]
        }
    ];

    const providerModel: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/provider' }]
        },
        {
            label: 'Service Operations',
            items: [
                { label: 'My Services', icon: 'pi pi-fw pi-briefcase', to: '/provider/services' },
                { label: 'My Bookings', icon: 'pi pi-fw pi-calendar', to: '/provider/bookings' },
                { label: 'Schedule', icon: 'pi pi-fw pi-clock', to: '/provider/schedule' },
            ]
        },
        {
            label: 'Performance',
            items: [
                { label: 'Reviews', icon: 'pi pi-fw pi-star', to: '/provider/reviews' },
                { label: 'Earnings', icon: 'pi pi-fw pi-money-bill', to: '/provider/earnings' },
            ]
        }
    ];

    const clientModel: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
        },
        {
            label: 'My Activities',
            items: [
                { label: 'My Bookings', icon: 'pi pi-fw pi-calendar', to: '/dashboard/bookings' },
                { label: 'My Profile', icon: 'pi pi-fw pi-user', to: '/dashboard/profile' },
            ]
        }
    ];

    const getModel = () => {
        if (!user) return [];
        switch (user.role) {
            case 'admin': return adminModel;
            case 'provider': return providerModel;
            default: return clientModel;
        }
    };

    const model = getModel();

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
