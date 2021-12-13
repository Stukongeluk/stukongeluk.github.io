import React from "react";
import AboutTextType from "./AboutTextType";
import mySelf from "../../assets/avatar-icon.jpeg";
import aws from "../../assets/AWS_Logo.svg";
import docker from "../../assets/docker.svg";
import angular from "../../assets/angular-icon-1.svg";
import gitlab from "../../assets/gitlab.svg";
import java from "../../assets/java-4.svg";
import elasticSearch from "../../assets/elasticsearch.svg";
import react from "../../assets/react-2.svg";
import spring from "../../assets/spring-3.svg";
import python from "../../assets/python-5.svg";

interface AboutInterfaceState {
  textType: AboutTextType;
}

class About extends React.Component<any, AboutInterfaceState> {
  constructor(props: any) {
    super(props)

    this.state = { textType: AboutTextType.Medium }
    this.handleTextChange = this.handleTextChange.bind(this)
    this.getText = this.getText.bind(this)
  }

  handleTextChange(textType: AboutTextType) {
    this.setState({ textType: textType })
  }

  private getSkillImagesElement(): JSX.Element {
    return (
      <div className="my-2 grid grid-cols-3 grid-rows-3 gap-2 items-center place-items-center">
        <div className="bg-white ring rounded-full ring-red-400 overflow-hidden">
          <img alt="aws" src={aws} className="h-40 w-40" />
        </div>
        <div className="bg-white ring rounded-full ring-red-400 overflow-hidden">
          <img alt="java" src={java} className="h-40 w-50" />
        </div>
        <div className="bg-white ring rounded-full ring-red-400 overflow-hidden">
          <img alt="docker" src={docker} className="h-40 w-40" />
        </div>
        <div className="bg-white ring rounded-full ring-red-400 overflow-hidden">
          <img alt="elasticsearch" src={elasticSearch} className="h-40 w-50" />
        </div>
        <div className="bg-white ring rounded-full ring-red-400 overflow-hidden">
          <img alt="angular" src={angular} className="h-40 w-50" />
        </div>
        <div className="bg-white ring rounded-full ring-red-400 overflow-hidden">
          <img alt="react" src={react} className="h-40 w-40" />
        </div>
        <div className="bg-white ring rounded-full ring-red-400 overflow-hidden">
          <img alt="gitlab" src={gitlab} className="h-40 w-40" />
        </div>
        <div className="bg-white ring rounded-full ring-red-400 overflow-hidden">
          <img alt="Spring framework" src={spring} className="h-40 w-40" />
        </div>
        <div className="bg-white ring rounded-full ring-red-400 overflow-hidden">
          <img alt="python" src={python} className="h-40 w-40" />
        </div>
      </div>
    )
  }

  private getText(textType: AboutTextType) {
    if (textType === AboutTextType.Short) {
      return (
        <div className="order-2 sm:order-1">
          <p className="text-gray-300 text-center my-8">
            I do cool stuff with <span className="text-white font-bold">computers and code. </span>Hit me up if you want to see it.
            ( P.S. I don't want to fix your printer/tablet/wifi etc.)
          </p>
        </div>
      )
    } else if (textType === AboutTextType.Medium) {
      return (
        <div className="text-gray-300 my-8 order-2 sm:order-1">
          <p>
            Hello! I am a Software Engineer who has a lot of experience in creating <span className="text-white font-bold">quality software</span> for different kinds of businesses!
          </p>
          <br />
          <p>
            <span className="text-white font-bold">Full-stack development?</span> I got you! Need some help with <span className="text-white font-bold">migrations to the Cloud?</span>
            I'm your guy! Need a <span className="text-white font-bold">small web application</span> or a <span className="text-white font-bold">huge enterprise application?</span> I can help :)
          </p>
          <p>
            Having experienced multiple projects in different kind of industries,
            I'm sure I can help your business and team <span className="text-red-400 font-bold">getting things done!</span>
          </p>
          <br />
          <p>
            My favourite Tech-stack contains: <span className="text-white font-bold">Java, AWS and Angular</span>, but that doesn't mean I'm not open to learn/use other technologies!
          </p>
        </div>
      )
    } else {
      return (
        <div className="order-2 sm:order-1 text-gray-300 my-8">
          <p>
            I do cool stuff with computers and code.
          </p>
        </div>

      )
    }
  }

  render(): React.ReactNode {
    return (
      <section id="About">
        <div className="grid grid-cols-3 divide-x-3 text-center">
          <hr className="my-8 border-white" />
          <h2 className="text-white text-base font-extrabold">
            <span className="text-4xl">
              About me
            </span>
          </h2>
          <hr className="my-8 border-white" />
        </div>
        <div className="grid grid-cols-3 divide-x-3 text-center">
          <button className={"about-button bg-gray-700 hover:bg-red-500 active:bg-red-400 text-gray-800 font-bold py-2 px-4 rounded-l " + (this.state.textType === AboutTextType.Short ? "active" : null)} onClick={() => this.handleTextChange(AboutTextType.Short)}>
            <span className="text-white">Short version</span>
          </button>
          <button className={"about-button bg-gray-700 hover:bg-red-500 active:bg-red-400 text-gray-800 font-bold py-2 px-4 rounded-l " + (this.state.textType === AboutTextType.Medium ? "active" : null)} onClick={() => this.handleTextChange(AboutTextType.Medium)}>
            <span className="text-white">Medium version</span>
          </button>
          <button className={"about-button bg-gray-700 hover:bg-red-500 active:bg-red-400 text-gray-800 font-bold py-2 px-4 rounded-l " + (this.state.textType === AboutTextType.Long ? "active" : null)} onClick={() => this.handleTextChange(AboutTextType.Long)}>
            <span className="text-white">Long version</span>
          </button>
        </div>
        <div className="grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 md:divide-x-2 border-none sm:grid-cols-1 sm:grid-rows-2">
          {this.getText(this.state.textType)}
          <div className="w-60 h-60 border-none justify-center my-8 justify-self-center order-1 sm:order-2">
            <img alt="me" src={mySelf} className="object-cover object-top w-60 h-60 rounded-full ring ring-offset-2 ring-1 ring-red-500 hover:ring-offset-4 hover:animate-spin" />
          </div>
        </div>
        {this.getSkillImagesElement()}
      </section>
    )
  };
}

export default About;