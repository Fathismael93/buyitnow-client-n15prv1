import mongoose from 'mongoose';

class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    console.log(this.query);
    const keyword = this.queryStr.get('keyword')
      ? {
          name: {
            $regex: this.queryStr.get('keyword'),
            $options: 'i',
          },
        }
      : {};

    console.log('are we coming to the end of the search method');
    console.log({ ...keyword });

    this.query.find({ ...keyword });
    console.log('After the search, returning this.query');
    console.log(this.query);
    return this;
  }

  filter() {
    console.log('WE ARE IN THE BEGINNING OF THE FILTER METHOD');
    const queryCopy = { ...this.queryStr };

    const removeFields = ['keyword', 'page'];
    removeFields.forEach((el) => delete queryCopy[el]);

    let output = {};
    let prop = '';

    for (let key in queryCopy) {
      if (!key.match(/\b(gt|gte|lt|lte)/)) {
        if (key === 'category') {
          const categoryId = mongoose.Types.ObjectId.createFromHexString(
            queryCopy[key],
          );

          output[key] = categoryId;
        } else {
          output[key] = queryCopy[key];
        }
      } else {
        prop = key.split('[')[0];

        let operator = key.match(/\[(.*)\]/)[1];

        if (!output[prop]) {
          output[prop] = {};
        }

        output[prop][`$${operator}`] = queryCopy[key];
      }
    }
    // { price: { $gte: 100, $lte: 1000 } }

    console.log('HERE IS THE OUTPUT FOR FILTERING');
    console.log(output);

    this.query = this.query.find(output);
    console.log('After the filtering, returning this.query');
    console.log(this.query);
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFilters;
