import React from 'react';
import logo from '../assets/logo.png';

class NavBar extends React.Component {
  render(): React.ReactNode {
    let navigationItems = ["About", "Setup", "Contact"];

    let navigationElements = navigationItems.map(item => {

      return <a key={item} className="font-extrabold py-2 px-4" href={`#${item}`}>{item}</a>
    });

    return <nav className='sticky top-0 z-10 bg-slate-500 bg-opacity-30 border-b border-gray-200 backdrop-filter backdrop-blur-lg'>
      <div className="max-w-4xl mx-auto px-1">
        <div className="flex items-center justify-between h-16">
          <span>
            <img alt="logo" src={logo} />
          </span>
          <div className='flex space-x-6 text-white'>
            {navigationElements}
            <a href="https://www.linkedin.com/in/jimmy-nguyen-software-engineer/" target="_blank" rel="noreferrer" className='py-2 px-4 border rounded border-red-400 font-extrabold'>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </nav>
  }
}

export default NavBar;