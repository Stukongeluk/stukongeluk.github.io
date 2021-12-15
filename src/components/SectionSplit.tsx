import React from "react";

class SectionSplit extends React.Component<{ title: string, fontSize?: string }> {
  render(): React.ReactNode {
    return (
      <div id={this.props.title} className="grid grid-cols-3 divide-x-3 text-center">
        <hr className="my-8 border-white" />
        <h2 className="text-white text-base font-extrabold">
          <span className={this.props.fontSize || "text-4xl"}>
            {this.props.title}
          </span>
        </h2>
        <hr className="my-8 border-white" />
      </div>
    )
  }
}

export default SectionSplit;