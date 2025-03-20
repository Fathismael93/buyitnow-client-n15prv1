import Product from '../models/product';
import Category from '../models/category';
import APIFilters from '../utils/APIFilters';

export async function GET(req, res) {
  try {
    const resPerPage = 2;

    const apiFilters = new APIFilters(Product.find(), req.query)
      .search()
      .filter();

    let products = await apiFilters.query.populate('category');
    const filteredProductsCount = products.length;

    apiFilters.pagination(resPerPage);

    products = await apiFilters.query.populate('category').clone();

    const result = filteredProductsCount / resPerPage;
    const totalPages = Number.isInteger(result) ? result : Math.ceil(result);

    const categories = await Category.find();

    return res.status(200).json({
      categories,
      totalPages,
      products,
    });
  } catch (error) {
    return res.json(error);
  }
}
