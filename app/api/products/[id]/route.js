import Product from '../models/product';
import next from 'next';
import ErrorHandler from '../utils/errorHandler';

export async function GET(req, { params }, res) {
  try {
    const { id } = params;

    const product = await Product.findById(id).populate('category');

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    const sameCategoryProducts = await Product.find({
      category: product?.category,
    }).limit(5);

    return res.status(200).json({
      sameCategoryProducts,
      product,
    });
  } catch (error) {
    return res.json(error);
  }
}
