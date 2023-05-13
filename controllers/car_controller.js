
const Car = require("../models/car_model");
const jwt = require("jsonwebtoken");
const fs=require("fs");

class CarController {
  static createCar = async (req, res) => {
    const {
      carname,
      brandId,
      noOfSeats,
      maxSpeed,
      pricePerDay,
      pricePerWeek,
      priceHalfWeek,
      description,
    } = req.body;
   
      const thumbnail  = "car/" + req.file.filename;
    
    const token = req.headers.authorization.split("Bearer ")[1];
    const decoded = jwt.decode(token);
    
    const car = new Car({
      creatorId:decoded.id,
      carname: carname,
      brandId: brandId,
      thumbnail: thumbnail,
    
      noOfSeats: noOfSeats,
      maxSpeed: maxSpeed,
      pricePerDay: pricePerDay,
      priceHalfWeek: priceHalfWeek,
      pricePerWeek: pricePerWeek,
      description: description,
    });
    await car
      .save()
      .then((doc) => {
        res
          .status(201)
          .json({ message: "Car data created successfully!", data: doc });
      })
      .catch((error) => {
        fs.unlinkSync(req.file.path);
        res
          .status(500)
          .json({ error: "Database error occured!", error: error.message });
      });
    
  };
  static getCarByBrand = async (req, res) => {
    const brandId = req.params.brandId;
    
    await Car.find({ brandId: brandId })
      .then((docs) => {
        res.json({ message: "success", data: docs });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Error occured while fetching data!" });
      });
  };
  static getAllCars = async (req, res) => {
    await Car.find()
      .then((docs) => {
        res.json({ message: "success", data: docs });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Error fetching data!" });
      });
  };
}
module.exports = CarController;
