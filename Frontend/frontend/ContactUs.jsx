import React, { Component } from 'react';

const feedbackOptions = [
  { id: 'One', value: '1' },
  { id: 'two', value: '2' },
  { id: 'three', value: '3' },
  { id: 'four', value: '4' },
  { id: 'five', value: '5' }
];

class ContactUs extends Component {
  constructor() {
    super();
    this.state = {
      feedback: '',
      message: ''
    };
    // Properly bind the methods in constructor
    this.handleFeedbackChange = this.handleFeedbackChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  // Ensure the method properly handles the event
  handleFeedbackChange(e) {
    this.setState({ feedback: e.target.value });
  }

  handleClick() {
    if (this.state.feedback) {
      this.setState({ message: 'Thanks for your valuable feedback!!!.' });
    } else {
      this.setState({ message: 'Feedback rating field should not be empty' });
    }
  }

  render() {
    return (
      <div style={{ marginLeft: '25px' }}>
        <h1 style={{ textAlign: 'center' }}>iTech - Temple of Learning</h1>
        <h3 style={{
          height: '50px',
          color: '#ffffff',
          padding: '10px',
          marginLeft: '5px',
          backgroundColor: '#81807E'
        }}>Contact Us</h3>
        
        <div>
          <h4>Address</h4>
          <p style={{ color: '#FFFFFF' }}>
            Way 1111<br />
            Building 1234<br />
            North Lane<br />
            Los Angeles<br />
            California 93239
          </p>
        </div>

        <h4>Feedback</h4><br />
        
        <form id="fbForm">
          <table id="feedback" border="2">
            <tbody>
              <tr>
                <td colSpan="5">Please rate our service</td>
              </tr>
              <tr>
                {feedbackOptions.map(option => (
                  <td key={option.id}>
                    <input
                      type="radio"
                      name="feedback"
                      id={option.id}
                      value={option.value}
                      onChange={this.handleFeedbackChange}
                      checked={this.state.feedback === option.value}
                    />
                    <label htmlFor={option.id}>{option.value}</label>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <br /><br />
          
          <button 
            id="Click1" 
            type="button" 
            onClick={this.handleClick} 
            style={{
              backgroundColor: '#ffd700',
              height: '30px',
              textAlign: 'center',
              width: '75px'
            }}
          >
            Click Me
          </button>
        </form>
        
        <br /><br />
        
        <div id="display1" style={{
          color: "#FFFFFF",
          fontWeight: "bolder",
          fontSize: "20px",
          padding: "3px"
        }}>
          {this.state.message}
        </div>
      </div>
    );
  }
}

export default ContactUs; 