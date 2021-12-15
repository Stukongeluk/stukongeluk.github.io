import React from "react";
import mailImg from "../assets/mail.svg";

class Contact extends React.Component {
    // TODO: Contact form logic

    render(): React.ReactNode {
        return (
            <section id="Contact">
                <div className="flex flex-center">
                    <div className="text-gray-200">
                        <h1 className="text-7xl">Get in touch.</h1>
                        <br/>
                        <p className="text-white">
                            I'm always open for new opportunities even though I may not be available at the moment.
                            If you have any questions or just want to say hi, you can always click on the mail icon below to send me an e-mail!
                        </p>
                        <a href="mailto:developer@jimmynguyen.nl?">
                            <img src={mailImg} alt="mail" className="m-auto h-60 w-50"/>
                        </a>
                    </div>
                </div>
            </section>
        )
    }
}

export default Contact;