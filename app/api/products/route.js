import dbConnect from '@/backend/config/dbConnect';
import Product from '@/backend/models/product';
import Category from '@/backend/models/category';
import APIFilters from '@/backend/utils/APIFilters';

export async function GET(req, res) {
  try {
    dbConnect();
    const resPerPage = 2;

    const apiFilters = new APIFilters(Product.find(), req.nextUrl.searchParams)
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
    return res.status(500).json(error);
  }
}
