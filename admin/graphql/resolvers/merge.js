const DataLoader = require('dataloader');
const Event = require('../../models/events');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const eventLoader = new DataLoader((eventIds) => {
  // eventIds [ '5cd70be3ff44053c7bdeeb7a', '5cd70c07ff44053c7bdeeb7b' ]
  return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  // userIds [ '5cd70be3ff44053c7bdeeb7a', '5cd70c07ff44053c7bdeeb7b' ]
  return User.find({_id: { $in: userIds }});
});

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });

    events.sort((a, b)=> {
      return (eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString()))
    })

    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    // eventId 是 object类型，需要转换成 Sting类型 才能使用 eventLoader.load
    // const event = await Event.findById(eventId);
    const event = await eventLoader.load(eventId.toString());
    // return transformEvent(event);
    return event;
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    // const user = await User.findById(userId);
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      // createdEvents: events.bind(this, user._doc.createdEvents)
      createdEvents: eventLoader.loadMany(user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)

  }
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  }
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;

// exports.events = events;
// exports.singleEvent = singleEvent;
// exports.user = user;

