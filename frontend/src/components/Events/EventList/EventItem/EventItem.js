import React from 'react';

import './EventItem.css';

const eventItem = props => (
  <li key={props.eventId} className="events__list-item">
    <div>
      <h1>{props.title}</h1>
      <h2>${props.price} -- {new Date(props.date).toLocaleDateString()}</h2>
    </div>
    <div>
      {props.userId === props.creatorId ? (
        <p>您是这个事件的所有者</p>
      ) : (
        <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>查看详情</button>
      )}
      
    </div>

  </li>
);

export default eventItem
