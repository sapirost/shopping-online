const CategoryModel = require('../models/categoryModel');
const ProdModel = require('../models/prodModel');
const OrderModel = require('../models/orderModel');
const CartModel = require('../models/cartModel');

const storeModule = {

    insertAllCategories: function () {
        return new Promise(async (resolve, reject) => {
            const c1 = new CategoryModel({ name: "Milk & Eggs" });
            await c1.save();
            const c2 = new CategoryModel({ name: "Vegetables & Fruits" });
            await c2.save();
            const c3 = new CategoryModel({ name: "Meat & Fish" });
            await c3.save();
            const c4 = new CategoryModel({ name: "Wine & Drinks" });
            await c4.save();
            const categoriesData = await this.getAllCategories();
            resolve(categoriesData);
            reject('err')
        });
    },

    getAllCategories: function () {
        return CategoryModel.find();
    },

    addNewProduct: function (name, price, category, image) {
        return new Promise(async (resolve, reject) => {
            const newProd = new ProdModel({ name: name, price: price, category: category, image: image });
            await newProd.save();
            const updatedProds = await this.getAllProducts();
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

    getProductsFromCategory: function (id) {
        return ProdModel.find({ category: id })
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
        const prods = await ProdModel.count();
        const orders = await OrderModel.count();
        return { products: prods, orders: orders }
    },

    checkCartStatus: async function (user) {
        const carts = await CartModel.find({ user: user });
        if (carts !== undefined && carts.length > 0) {
            const openCart = carts.filter(function (e) { return e.status == 'open'; });
            if (openCart.length > 0) {
                return { cartStatus: 'open', myCart: openCart };
            } else {
                const latestCart = await OrderModel.findOne({ 'cart._id': carts[carts.length - 1].id });
                return { cartStatus: 'close', lastOrder: latestCart.orderDate };
            }
        }
        return { cartStatus: null };
    },

    deleteProduct: async function (id) {
        await ProdModel.findByIdAndDelete(id);
        const updatedProds = await this.getAllProducts();
        return updatedProds;
    },

    updateProductById: async function (id, productOBJ) {
        await ProdModel.findOneAndUpdate({ "_id": id }, productOBJ);
        const updatedProds = await this.getAllProducts();
        return updatedProds;
    },

    unavailableDates: async function () {
        const unavailableArr = [];
        const allOrders = await OrderModel.find();
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
            const newOrder = new OrderModel(Object.assign(orderOBJ, { user: userID }));
            await newOrder.save();
            await CartModel.findOneAndUpdate({ 'user': userID, status: 'open' },
                { "$set": { "status": "close" } }, { safe: true, multi: true });
            resolve({ msg: 'success' });
            reject({ msg: 'failed' });
        });
    }
}

module.exports = storeModule;