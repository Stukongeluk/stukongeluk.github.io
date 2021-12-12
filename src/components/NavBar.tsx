import React from 'react';
import logo from '../assets/logo.png';

class NavBar extends React.Component {
    render(): React.ReactNode {
        let navigationItems = ["About", "Experience", "Contact"];

        let navigationElements = navigationItems.map(item => {
            
            return <a href={`#${item}`}>{item}</a>
        });
        
        return <nav className='sticky top-0 z-10 bg-slate-500 bg-opacity-30 border-b border-gray-200 backdrop-filter backdrop-blur-lg'>
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                <span><img src={logo}/></span>
                <div className='flex space-x-4 text-white'>
                    {navigationElements}
                </div>
                </div>
            </div>
        </nav>
    }
}

export default NavBar;