import User from '../models/user';
import Cart from '../models/cart';
import next from 'next';
import ErrorHandler from '../utils/errorHandler';

export const getCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select('_id');

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    let cart;
    const result = await Cart.find({ user: user._id }).populate('product');
    cart = result;

    // IF THE QUANTITY HAS EXCEDEED THE PRODUCT STOCK AVAILABLE THEN UPDATE THE QUANTITY TO EQUAL THE PRODUCT STOCK

    for (let index = 0; index < result.length; index++) {
      const productQuantity = result[index].quantity;
      const productStock = result[index].product.stock;
      const id = result[index]._id;

      if (productQuantity > productStock) {
        const cartUpdated = await Cart.findByIdAndUpdate(id, {
          quantity: productStock,
        });

        cart = cartUpdated;
      }
    }

    const cartCount = cart.length;

    return res.status(200).json({
      cartCount,
      cart,
    });
  } catch (error) {
    return res.json(error);
  }
};
