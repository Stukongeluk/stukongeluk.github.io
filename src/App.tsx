import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import BackgroundAnimation from "./components/background/BackgroundAnimation";

class App extends React.Component {
  render(): React.ReactNode {
    return <div className="App">
    <BackgroundAnimation/>
    <NavBar/>
    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
      <Hero/>
      <section className='About'>
        <h1>GHUH</h1> 
      </section>
    </main>
  </div>
  
  } 
}

export default App;
