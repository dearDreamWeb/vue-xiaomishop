const express = require("express");
const app = express();
const cors = require("cors");

const crud = require("./crud"); // 引入crud接口

require("./session")(app); // 引用session

app.listen(3000);

// 解决跨域
const corsOptions = {
    origin: "http://192.168.199.106:8080",
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));

// 创建路由
const useRouter = express.Router();
app.use("/api", useRouter);

// 初始化商品
useRouter.use("/goods", (req, res) => {
    crud("SELECT * FROM `goods` ORDER BY price;", [], data => {
        data.forEach(item => {
            item.productImageUrl = "http://192.168.199.106:3000/images/" + item.productImageUrl;
        });
        res.json({
            "goods": data
        })
    })
})


let minPrice = 0;
let maxPrice = 10000000000;
let orderBy = "";

// 价格排序
useRouter.use("/orderPrice", (req, res) => {
    // 给最大值和最小值赋值
    if (req.query.min || req.query.max) {
        minPrice = Number(req.query.min);
        maxPrice = Number(req.query.max);
    } else {
        minPrice = 0;
        maxPrice = 1000000000;
    }
    orderBy = req.query.default ? "desc" : "asc"; // 升序还是降序
    crud("SELECT * FROM `goods`WHERE price BETWEEN ? AND ? ORDER BY price " + orderBy + ";", [minPrice, maxPrice], data => {
        data.forEach(item => {
            item.productImageUrl = "http://192.168.199.106:3000/images/" + item.productImageUrl;
        });
        res.json({
            "goods": data
        })
    })
})

// 登录
useRouter.use("/login", (req, res) => {
    crud("SELECT * FROM `users` WHERE userName = ? AND password = ?", [req.query.userName, req.query.passWord], data => {
        if (data.length > 0) {
            req.session.userInfo = data[0];
            res.json({
                isLogin: 1,
                data: req.session.userInfo
            })
        } else {
            res.json({
                isLogin: 0
            })
        }
    })
})

// 退出登录，注销session
useRouter.use("/loginOut", (req, res) => {
    req.session.destroy(() => res.json({ "loginOut": true }));
})

// 加入购物车
useRouter.use("/addCart", (req, res) => {
    // 为了防止前端有人改了userId ,所以要和session里面的userId对照一下
    if (req.query.userId == req.session.userInfo.id) {
        crud("SELECT * FROM `cart` WHERE uid = ? AND productId = ?;", [req.session.userInfo.id, req.query.id], data => {
            // 当数据库中没有该数据是插入
            // 当数据库有该数据的话，只改变count
            if (data.length == 0) {
                let obj = {
                    uid: req.session.userInfo.id,
                    productId: req.query.id,
                    productName: req.query.name,
                    count: req.query.count,
                    price: req.query.price,
                    productImageUrl: req.query.imgUrl
                }
                crud("INSERT INTO `cart` set ? ;", obj, data => {
                    data ? res.json({ "message": true }) : false;
                })
            } else {
                let id = data[0].cartId;
                let num = data[0].count;
                num++;
                crud("UPDATE `cart` SET count = ?  WHERE cartId =?;", [num, id], data => {
                    data ? res.json({ "message": true }) : false;
                })
            }
        })
    } else {
        console.log(req.query.userId, req.session.userInfo.userId)
        console.log("前后端userId不一样");
    }

})

// 静态托管
app.use("/images", express.static("./static"));