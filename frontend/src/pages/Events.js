import React, { Component } from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/backdrop';

import './Events.css';

class EventsPage extends Component {

  state = {
    creating: false
  }

  startCreateEventHandler = () => {
    this.setState({creating: true});
  }

  modalCancelHandler = () => {
    this.setState({creating: false});
  }

  modalConfirmHeadler =() => {
    this.setState({creating: false});
  }
  render () {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && ( 
          <Modal 
            title="添加事件" 
            canCancel 
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHeadler}
          >
          <p>sdfsfsfs</p>
        </Modal>)}
        <div className="events-control">
          <p>分享你自己的事件!</p> 
          <button className="btn" onClick={this.startCreateEventHandler}>新建事件</button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;