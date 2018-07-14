import React from 'react';
import {BrowserRouter as Route, Link} from 'react-router-dom';
import { Image, Form, Button} from 'semantic-ui-react';

class Home extends React.Component {
    render(){
        return (
        <div style={{textAlign: 'center', marginTop: '5px'}}>
          We are a messenger app that help bridge generational differences between elderly and their family in an
           <em> interactive</em> and <span style={{color:"purple"}}>f</span>
          <span style={{color:"red"}}>u</span><span style={{color:"blue"}}>n</span> way!
        </div>
      );
    }
  }

export default Home;
