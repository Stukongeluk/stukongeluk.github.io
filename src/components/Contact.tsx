import React from "react";

class Contact extends React.Component {
    // TODO: Contact form logic

    render(): React.ReactNode {
        return (
            <section id="Contact">
                <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-1">
                    <div className="text-gray-200">
                        <h1 className="text-7xl">Get in touch.</h1>
                        <br/>
                        <p className="text-white">
                            I'm always open for new opportunities even though I may not be available at the moment.
                            If you have any questions or just want to say hi, you always use the contact form to reach out to me.
                        </p>
                    </div>
                    <form className="w-full max-w-lg justify-self-center">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                    First Name
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-400 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Powder" />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" htmlFor="grid-last-name">
                                    Last Name
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-400 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Jinx" />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" htmlFor="grid-password">
                                    E-mail
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-400 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="email" />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" htmlFor="grid-password">
                                    Message
                                </label>
                                <textarea className="no-resize appearance-none block w-full bg-gray-200 text-gray-400 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none" id="message"></textarea>
                            </div>
                        </div>
                        <div className="md:flex md:items-center">
                            <div className="w-full">
                                <button className="shadow bg-red-400 hover:bg-red-300 focus:shadow-outline focus:outline-none text-white font-bold w-full h-12 px-6 rounded" type="button">
                                    Send
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

            </section>
        )
    }
}

export default Contact;