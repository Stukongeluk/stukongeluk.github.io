import React from 'react';
import logo from '../../assets/logo.png';
import NavBarState from "./NavBarState";

class NavBar extends React.Component<{}, NavBarState> {
  constructor(props: any) {
    super(props);
    this.state = { screenWidth: window.innerWidth, isOpen: false };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.navigateToSection = this.navigateToSection.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions)
  }

  private updateWindowDimensions() {
    this.setState({ screenWidth: window.innerWidth });
  }

  public handleToggle() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  public navigateToSection(section: string) {
    this.handleToggle()
    return window.location.href = section;
  }

  private renderHamburgerItems(navigationElements: JSX.Element[]) {
    if (this.state.isOpen) {
      return (
        <div>
          {navigationElements}
        </div>
      )
    } else {
      return
    }
  }

  private renderHamburger(navigationItems: string[]) {
    let navigationElements = navigationItems.map(item => {
      return (
        <div key={item} className="border w-full h-20 text-center">
          <button key={item} className="w-full h-full block" onClick={() => this.navigateToSection(`#${item}`)}>
            <p className="font-extrabold text-white text-4xl">
              {item}
            </p>
          </button>
        </div>
      )
    });

    return (
      <nav className='mobile-navbar sticky top-0 z-10 bg-slate-500 bg-opacity-30 border-b border-gray-200 backdrop-filter backdrop-blur-lg'>
        <div className="md:hidden flex items-center flex justify-end">
          <button className="border" onClick={this.handleToggle}>
            <svg
              className="w-20 h-20 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        {this.renderHamburgerItems(navigationElements)}

      </nav>
    )
  }

  private renderDefault(navigationItems: string[]) {
    let navigationElements = navigationItems.map(item => {
      return <a key={item} className="font-extrabold py-2 px-4" href={`#${item}`}>{item}</a>
    });

    return <nav className='default-navbar sticky top-0 z-10 bg-slate-500 bg-opacity-30 border-b border-gray-200 backdrop-filter backdrop-blur-lg'>
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

  render(): React.ReactNode {
    let navigationItems = ["About", "Setup", "Contact"];

    if (this.state.screenWidth <= 760) {
      return this.renderHamburger(navigationItems);
    } else {
      return this.renderDefault(navigationItems);
    }
  }
}

export default NavBar;