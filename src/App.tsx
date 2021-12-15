import React from 'react';
import './App.css';
import './components/About/About.css';
import NavBar from './components/NavBar/NavBar';
import Hero from './components/Hero';
import BackgroundAnimation from "./components/Background/BackgroundAnimation";
import SectionSplit from "./components/SectionSplit";
import About from './components/About/About';
import Setup from './components/Setup';
import Contact from './components/Contact';

class App extends React.Component {
  render(): React.ReactNode {
    return <div className="App">
      <BackgroundAnimation />
      <NavBar />
      <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
        <Hero />
        <SectionSplit title="About"/>
        <About />
        <SectionSplit title="Setup" fontSize='text-5xl'/>
        <Setup />
        <SectionSplit title="Contact" />
        <Contact />
        <br/>
        <div className='my-24 text-center'>
          <a href="https://github.com/Stukongeluk/stukongeluk.github.io" target="_blank" rel="noreferrer">
            <p className="text-gray-300">
            ☕Created by Jimmy Nguyen (Check it on Github!)☕
            </p>
          </a>
        </div>
        <br></br>
      </main>
    </div>

  }
}

export default App;
