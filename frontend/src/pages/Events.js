import React, { Component } from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';

import './Events.css';

class EventsPage extends Component {
  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  // 组件加载完成
  componentDidMount() {
    this.fetchEvents()
  }

  static contextType = AuthContext;

  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectEvent: null
  }

  startCreateEventHandler = () => {
    this.setState({creating: true});
  }

  modalCancelHandler = () => {
    this.setState({creating: false, selectedEvent: null});
  }

  // 提交事件
  modalConfirmHeadler =() => {
    this.setState({creating: false});
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value; 
    if (
      title.trim().length === 0 ||
      price <= 0 || 
      date.trim().length === 0 || 
      description.trim().length === 0
    ) {
      return;
    }

    const event = {title, price, date, description};

    
    // 如果没有登陆

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"}) {
            _id
            title
            description
            date
            price
          }
        }
      `
    };

    const token = this.context.token;
    fetch('http://localhost:4000/graphql', {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ token
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('failed!')
      };
      return res.json();
    }).then(resData => {
      this.setState(prevState => {
        // 获取上一个 prevState.events 数据
        const updatedEvents = [...prevState.events];
        // 把新增的数据添加到updatedEvents数组里
        updatedEvents.push({
          _id: resData.data.createEvent._id,
          title: resData.data.createEvent.title,
          description: resData.data.createEvent.description,
          date: resData.data.createEvent.date,
          price: resData.data.createEvent.price,
          creator: {
            _id: this.context.userId
          }
        });
        // 在把更新后的数据返回，这样就不需要在查询数据库了
        return {events: updatedEvents}
      })
    }).catch(error => {
      console.log(error);
    });
  }

  // 获取列表
  fetchEvents() {
    this.setState({isLoading: true});
    const requestBody = {
      query: `
        query {
          events {
            _id,
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `
    };

    fetch('http://localhost:4000/graphql', {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('failed!')
      }
      return res.json();
    }).then(resData => {
      const events = resData.data.events;
      this.setState({
        events: events,
        isLoading: false
      });
    }).catch(error => {
      console.log(error);
      this.setState({isLoading: false});
    });

  }

  showDetailHandler = eventId => {
    
    console.log(this)
    console.log(eventId)
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return {selectedEvent: selectedEvent};
    })
  }

  bookingEventHandler = () => {

  }

  render () {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}

        {this.state.creating && ( 
          <Modal 
            title="添加事件" 
            canCancel 
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHeadler}
            confirmText="确定"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">标题</label>
                <input type="text" id="title" ref={this.titleElRef}/>
              </div>

              <div className="form-control">
                <label htmlFor="price">价格</label>
                <input type="number" id="price" ref={this.priceElRef}/>
              </div>

              <div className="form-control">
                <label htmlFor="date">时间</label>
                <input type="date" id="date" ref={this.dateElRef}/>
              </div>

              <div className="form-control">
                <label htmlFor="description">描述</label>
                <textarea id="description" rows="4" ref={this.descriptionElRef}/>
              </div>
            </form>
          </Modal>
        )}

        {this.state.selectedEvent && (
          <Modal 
            title={this.state.selectedEvent.title}
            canCancel 
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookingEventHandler}
            confirmText="Book"
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>
              ${this.state.selectedEvent.price} -- {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>)}

        {this.context.token && (
          <div className="events-control">
            <p>分享你自己的事件!</p> 
            <button className="btn" onClick={this.startCreateEventHandler}>新建事件</button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList 
            events={this.state.events} 
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />
        )}
        
       
      </React.Fragment>
    );
  }
}

export default EventsPage;