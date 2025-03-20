import mongoose from 'mongoose';

class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.get('keyword')
      ? {
          name: {
            $regex: this.queryStr.get('keyword'),
            $options: 'i',
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    let queryCopy = {};

    if (this.queryStr.get('category')) {
      queryCopy = {
        category: this.queryStr.get('category'),
        ...queryCopy,
      };
    }

    if (this.queryStr.get('price[gte]')) {
      queryCopy = {
        'price[gte]': this.queryStr.get('price[gte]'),
        ...queryCopy,
      };
    }

    if (this.queryStr.get('price[lte]')) {
      queryCopy = {
        'price[lte]': this.queryStr.get('price[lte]'),
        ...queryCopy,
      };
    }

    console.log('QUERYCOPY BEFORE REMOVING KEYWORD AND PAGE');
    console.log(queryCopy);

    const removeFields = ['keyword', 'page'];
    removeFields.forEach((el) => delete queryCopy[el]);

    let output = {};
    let prop = '';

    for (let key in queryCopy) {
      console.log('KEY IN QUERYCOPY');
      console.log(key);
      if (!key.match(/\b(gt|gte|lt|lte)/)) {
        if (key === 'category') {
          console.log('queryCopy[key]: ');
          console.log(queryCopy[key]);

          console.log('output object before objectId');
          console.log(output);

          const categoryId = mongoose.Types.ObjectId.createFromHexString(
            queryCopy[key],
          );

          output[key] = categoryId;

          console.log('output object after objectId');
          console.log(output);
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
