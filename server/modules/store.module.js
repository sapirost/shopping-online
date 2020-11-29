var CategoryModel = require('../models/categoryModel');
var ProdModel = require('../models/prodModel');
var OrderModel = require('../models/orderModel');
var CartModel = require('../models/cartModel');

var storeModule = {

    insertAllCategories: function () {
        return new Promise(async (resolve, reject) => {
            var c1 = new CategoryModel({ name: "Milk & Eggs" });
            await c1.save();
            var c2 = new CategoryModel({ name: "Vegetables & Fruits" });
            await c2.save();
            var c3 = new CategoryModel({ name: "Meat & Fish" });
            await c3.save();
            var c4 = new CategoryModel({ name: "Wine & Drinks" });
            await c4.save();
            var categoriesData = await this.getAllCategories();
            resolve(categoriesData);
            reject('err')
        });
    },

    getAllCategories: function () {
        return CategoryModel.find();
    },

    addNewProduct: function (name, price, category, image) {
        return new Promise(async (resolve, reject) => {
            var newProd = new ProdModel({ name: name, price: price, category: category, image: image });
            await newProd.save();
            var updatedProds = await this.getAllProducts();
            resolve(updatedProds);
            reject({ msg: 'failed' });
        });
    },

    findProducts: text => {
        return ProdModel.find({ "name": { "$regex": text, "$options": "i" } })
            .populate('category')
            .exec()
            .then(docs => {
                return ({
                    products: docs.map(doc => {
                        return {
                            _id: doc._id,
                            category: doc.category.name,
                            name: doc.name,
                            image: doc.image,
                            price: doc.price
                        };
                    })
                });
            })
            .catch(err => { return err; });
    },

    findProductById: id => {
        return ProdModel.findOne({ "_id": id })
            .populate('category')
            .exec()
            .then(docs => {
                return ({
                    _id: docs._id,
                    category: docs.category.name,
                    categoryID: docs.category._id,
                    name: docs.name,
                    image: docs.image,
                    price: docs.price
                })
            })
            .catch(err => { return err; });
    },

    getAllProducts: function () {
        return ProdModel.find()
            .populate('category')
            .exec()
            .then(docs => {
                return ({
                    products: docs.map(doc => {
                        return {
                            _id: doc._id,
                            category: doc.category.name,
                            name: doc.name,
                            image: doc.image,
                            price: doc.price
                        };
                    })
                });
            })
            .catch(err => { return err; });
    },

    getProductsFromCategory: function(id) {
        return ProdModel.find({category: id})
            .populate('category')
            .exec()
            .then(docs => {
                return ({
                    products: docs.map(doc => {
                        return {
                            _id: doc._id,
                            category: doc.category.name,
                            name: doc.name,
                            image: doc.image,
                            price: doc.price
                        };
                    })
                });
            })
            .catch(err => { return err; });
    },


    getGeneralInfo: async function () {
        var prods = await ProdModel.count();
        var orders = await OrderModel.count();
        return { products: prods, orders: orders }
    },

    checkCartStatus: async function (user) {
        var carts = await CartModel.find({ user: user });
        if (carts !== undefined && carts.length > 0) {
            var openCart = carts.filter(function (e) { return e.status == 'open'; });
            if (openCart.length > 0) {
                return { cartStatus: 'open', myCart: openCart };
            } else {
                var latestCart = await OrderModel.findOne({ 'cart._id': carts[carts.length - 1].id });
                return { cartStatus: 'close', lastOrder: latestCart.orderDate };
            }
        }
        return { cartStatus: null };
    },

    deleteProduct: async function (id) {
        await ProdModel.findByIdAndDelete(id);
        var updatedProds = await this.getAllProducts();
        return updatedProds;
    },

    updateProductById: async function (id, productOBJ) {
        await ProdModel.findOneAndUpdate({ "_id": id }, productOBJ);
        var updatedProds = await this.getAllProducts();
        return updatedProds;
    },

    unavailableDates: async function () {
        var unavailableArr = [];
        var allOrders = await OrderModel.find();
        if (Array.isArray(allOrders)) {
            allOrders.forEach(element => {
                let counter = 0;
                allOrders.map(o => { if (element.deliveryDate === o.deliveryDate) counter++; })
                if (counter >= 3 && unavailableArr.indexOf(element.deliveryDate) === -1) {
                    unavailableArr.push(element.deliveryDate);
                }
            });
        }
        return unavailableArr;
    },

    submitOrder: function (orderOBJ, userID) {
        return new Promise(async (resolve, reject) => {
            var newOrder = new OrderModel(Object.assign(orderOBJ, { user: userID }));
            await newOrder.save();
            await CartModel.findOneAndUpdate({ 'user': userID, status: 'open' },
                { "$set": { "status": "close" } }, { safe: true, multi: true });
            resolve({ msg: 'success' });
            reject({ msg: 'failed' });
        });
    }
}

module.exports = storeModule;