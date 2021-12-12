import React from "react";
import AboutTextType from "./AboutTextType";

interface AboutInterfaceState {
  textType: AboutTextType;
}

class About extends React.Component<any, AboutInterfaceState> {
  constructor(props: any) {
    super(props)

    this.state = {textType: AboutTextType.Medium}
    this.handleTextChange = this.handleTextChange.bind(this)
  }

    handleTextChange(textType: AboutTextType) {
      this.setState({textType: textType})
    }

    getText(textType: AboutTextType) {
      if (this.state.textType === AboutTextType.Short) {
        return (
          <p className="text-gray-400">
            I do cool stuff with computers and code.
          </p>
        )
      } else if (this.state.textType === AboutTextType.Medium) {
        return (
          <p className="text-gray-400">
            I do cool stuff with computers and code.
          </p>
        )
      } else {
        return (
          <p className="text-gray-400">
            I do cool stuff with computers and code.
          </p>
        )
      }
    }

    render(): React.ReactNode {
      return (
        <section className="text-center">
          <h2 className="text-white text-base font-extrabold ">
            <span className="text-4xl">
              About me
            </span>
          </h2>
          {this.getText(this.state.textType)}
        </section>
      )
    };
}

export default About;