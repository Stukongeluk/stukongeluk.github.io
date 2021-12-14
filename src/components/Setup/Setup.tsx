import React from 'react';
import setupImg from '../../assets/setup.jpg';
import server from '../../assets/server.svg';
import tools from '../../assets/tools.svg';
import cat from '../../assets/cat.svg';

class Setup extends React.Component {
    render(): React.ReactNode {
        return (
            <section id="Setup" className="text-gray-300 text-center ">
                <img src={setupImg} alt="setup" className="rounded-3xl border border-red-400" />
                <div className="grid grid-cols-3 gap-3">
                    <div className="max-h-256 min-h-64">
                        <br/>
                        <img src={server} alt="hardware" className="m-auto h-30 w-40"/>
                        <br/>
                        <h3 className="text-2xl font-extrabold">Hardware</h3>
                        <p>Hardware as in chair, table and other things you can actually touch!</p>
                        <br/>
                        <ul className="text-white font-extrabold list-disc list-inside">
                            <li>Random office chair</li>
                            <li>Ikea Micke desk</li>
                            <li>HP Pavilion 300 QWERTY Keyboard</li>
                            <li>Sharkoon SHARK Force mouse</li>
                            <li>Razer Seiren Mini Microphone</li>
                            <li>Aukey PC-LM1 1080p Webcam</li>
                            <li>iiyama G-Master G2230HS-B1 Black Hawk Monitor</li>
                            <li>Sony WH-1000XM3 Headphones</li>
                            <li>Jelly Comb Monitor stand</li>
                            <li>A MSI Windows laptop :) </li>
                        </ul>
                    </div>
                    <div className="max-h-256 min-h-64 ">
                        <br/>
                        <img src={tools} alt="tools" className="m-auto h-30 w-40"/>
                        <br/>
                        <h3 className="text-2xl font-extrabold">Tools</h3>
                        <p>Tools I use daily for my development work!</p>
                        <br/>
                        <ul className="text-white font-extrabold list-disc list-inside">
                            <li>Git</li>
                            <li>AWS CDK</li>
                            <li>AWS CLI</li>
                            <li>Visual Studio Code</li>
                            <li>IntelliJ </li>
                            <li>Postman</li>
                            <li>Bitbucket</li>
                            <li>Gitlab</li>
                            <li>Bash Terminal</li>
                        </ul>

                    </div>
                    <div className="max-h-256 min-h-64">
                        <br/>
                        <img src={cat} alt="cat" className="m-auto h-30 w-40"/>
                        <br/>
                        <h3 className="text-2xl font-extrabold">Cat</h3>
                        <p>The newest member of the household!</p>
                        <br/>
                        <ul className="text-white font-extrabold list-disc list-inside">
                            <li>1+ years old</li>
                            <li>~7 Kilograms</li>
                            <li>Maine Coon</li>
                            <li>Orange and white fur</li>
                            <li>Fluffly</li>
                            <li>Likes cuddles in the morning</li>
                            <li>Likes to bite/destroy cables</li>
                        </ul>
                    </div>
                </div>
            </section>
        );
    }
}

export default Setup;