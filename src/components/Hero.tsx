import React from 'react';

class Hero extends React.Component {

    render(): React.ReactNode {
        return <section className="flex flex-col justify-center h-screen sm:text-center lg:text-center">
              <p className='text-red-400 text-lg'>Hi! My name is</p>
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block  text-white xl:inline">Jimmy Nguyen</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                <span className='xl:inline'>I am a </span>
                <span className='text-white xl:inline'>software engineer </span>
                <span>who likes to create </span>
                <span className='text-white xl:inline'>fully-functional </span>
                <span className='xl:inline'>and </span>
                <span className='text-white xl:inline'>maintainable software solutions. </span>
                <span className='xl:inline'>Currently working at DPG Media</span>
              </p>
        </section>
    }
}
export default Hero;