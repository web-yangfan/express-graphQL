const Event = require('../../models/events');
const User = require('../../models/user');

const { transformEvent  } = require('./merge');


module.exports = {
  events: async () => {
    try {
      // mongooes 中的 populate 可以跨表查询
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      })
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    // 验证身份
    if (!req.isAuth) {
      throw new Error("未经身份验证");
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price, // 字符串转换Number
      date: new Date(args.eventInput.date),
      creator: req.userId
    });

    let createdEvent;

    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      // 查询这个用户是否存在，并返回结果数据
      const creator = await User.findById(req.userId);

      // 用户不存在
      if (!creator) {
        throw new Error('没有这个用户');
      }
      // 把商品信息 id 保存到 user集合 createEvents 字段中
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err){
      throw err
    }
  }
};