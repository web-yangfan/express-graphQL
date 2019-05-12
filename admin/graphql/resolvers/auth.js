const bcrypt = require('bcrypt');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

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
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new Error('用户不存在');
    }
    // 比较两个密码
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('密码是不正确的');
    }
    // 生成token
    const token = jwt.sign(
      { userId: user.id, email:  user.email },
      'somesupersecretkey',
      { expiresIn: '1h' } // 设置有效期
    );
    return { userId: user.id, token: token, tokenExpiration: 1 }
  }
};