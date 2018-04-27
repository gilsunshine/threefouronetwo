import React from 'react'

class Instructions extends React.Component{

  constructor(){
    super()
    this.state = {
      show: true
    }
  }

  hideInstructions = () => {
    this.setState({show: !this.state.show})
  }

  render(){
    return(
      <div onClick={this.hideInstructions}>
        {this.state.show ? <div style={divStyle}> <strong style={textStyle}>Welcome to ThreeFourOneTwo</strong>
        <p style={textStyle}>See that blue dot? That's you. Any red dots you might see are other users. When the yellow screen passes a dot it plays the note associated with that dot.</p>
        <p style={textStyle}>Press W, A, S, and D keys to move your dot in the x and y axes. Press Z and X to move up and down in the z axis.</p>
        <p style={textStyle}>The x axis controls the pitch, the y axis controls the tone and sustain, and the z axis controls where in the sequence your note is played.</p>
        <p style={textStyle}>Click and drag to rotate your view. Click on the instructions to hide them.</p> </div>  : <div style={instructionDivStyle}><strong style={instructionTextStyle}>Instructions</strong></div>}
      </div>
    )
  }
}

export default Instructions

let textStyle = {
  color: "#555",
  fontFamily: "'Roboto Mono', monospace",
  fontSize: '0.8em'
}

let divStyle = {
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  margin: "2%",
  padding: "1%",
  backgroundColor: '#eee',
  zIndex: 10,
  width: "15%"
}

let instructionTextStyle = {
  color: "#000",
  fontFamily: "'Roboto Mono', monospace",
  fontSize: '0.8em'
}

let instructionDivStyle = {
  display: "inline-block",
  position: "absolute",
  margin: "2%",
  padding: "1%",
  backgroundColor: '#555',
  zIndex: 10,
}
