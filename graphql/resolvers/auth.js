const bcrypt = require('bcrypt');
const User = require('../../models/user');

module.exports = {
  createUser: async (args) => {
    try {
      // 检查email是否存在
      const existingUser = await User.findOne({ email: args.userInput.email })
      if (existingUser) {
        throw new Error('用户已经存在');
      }
      // 不存在返回加密后的密码
      const hashedPassword =await bcrypt.hash(args.userInput.password, 12);
      const user = User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();
      return { ...result._doc, _id: result.id };
    } catch (err) {
      throw err;
    }
  }
};