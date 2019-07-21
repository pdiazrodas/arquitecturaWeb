
import fs from 'fs';
import { ObjectId } from 'mongojs';
import mongoist from 'mongoist';
import config from 'config';
import moment from 'moment';

import logOperations from '../utils/logOperations';

const db = mongoist(config.connection.mongodb.uri);
db.ObjectId = ObjectId;

exports.addInventoryItem = async function addInventoryItem(req, res, next) {
  const date = moment().format('LTS');
  const params = {
    name: req.swagger.params.itemName.value,
    quantity: req.swagger.params.quantity.value,
    unit: req.swagger.params.unit.value,
  };

  try {
    const resp = await db.collection('inventory').insertOne(params);
    res.send(resp);
  } catch (e) {
    const error = new Error();
    error.status = 500;
    error.message = `There was an error - Status Code: ${error.status} - ${e.message}`;
    res.status(error.status);
    res.json(error.message);
    fs.appendFile(logOperations.logFilePath, `${date} - Status Code: ${error.status} - ${e.message} - Host: ${req.headers.host} IP: ${req.ip}\n`, (err) => {
      if (err) process.stdout.write('Error at writing logErrors.txt');
    });
  }
};

exports.updateInventoryItem = async function updateInventoryItem(req, res, next) {
  const date = moment().format('LTS');

  try {
    const updateObject = {
      name: req.swagger.params.item.value.itemName,
      quantity: req.swagger.params.item.value.quantity,
      unit: req.swagger.params.item.value.unit,
    };

    if (!updateObject.name && !updateObject.quantity && !updateObject.unit) {
      const error = new Error();
      error.status = 500;
      error.message = 'Nothing to update';
      throw error;
    }

    if (!updateObject.name) delete updateObject.name;
    if (!updateObject.quantity) delete updateObject.quantity;
    if (!updateObject.unit) delete updateObject.unit;

    const resp = await db.collection('inventory').update(
      {
        _id: ObjectId(req.swagger.params.itemId.value),
      },
      {
        $set: updateObject,
      },
    );

    res.send(resp);
  } catch (e) {
    if (e.status === 500) res.send(e);
    const error = new Error();
    error.status = 500;
    error.message = `There was an error - Status Code: ${error.status} - ${e.message}`;
    res.status(error.status);
    res.json(error.message);
    fs.appendFile(logOperations.logFilePath, `${date} - Status Code: ${error.status} - ${e.message} - Host: ${req.headers.host} IP: ${req.ip}\n`, (err) => {
      if (err) process.stdout.write('Error at writing logErrors.txt');
    });
  }
};

exports.inventory = async function inventory(req, res, next) {
  const date = moment().format('LTS');

  try {
    if (req.method === 'GET' && req.swagger.params.itemId) {
      const data = await db.collection('inventory').find({ _id: ObjectId(req.swagger.params.itemId.value) });
      res.send(data);
    }

    const data = await db.collection('inventory').find();
    res.send(data);
  } catch (e) {
    const error = new Error();
    error.status = 500;
    error.message = `There was an error - Status Code: ${error.status} - ${e.message}`;
    res.status(error.status);
    res.json(error.message);
    fs.appendFile(logOperations.logFilePath, `${date} - Status Code: ${error.status} - ${e.message} - Host: ${req.headers.host} IP: ${req.ip}\n`, (err) => {
      if (err) process.stdout.write('Error at writing logErrors.txt');
    });
  }
};

exports.deleteInventoryItem = async function deleteInventoryItem(req, res, next) {
  const date = moment().format('LTS');

  try {
    db.collection('inventory').remove({
      _id: ObjectId(req.swagger.params.itemId.value),
    });
    res.send('Registro eliminado');
  } catch (e) {
    const error = new Error();
    error.status = 500;
    error.message = `There was an error - Status Code: ${error.status} - ${e.message}`;
    res.status(error.status);
    res.json(error.message);
    fs.appendFile(logOperations.logFilePath, `${date} - Status Code: ${error.status} - ${e.message} - Host: ${req.headers.host} IP: ${req.ip}\n`, (err) => {
      if (err) process.stdout.write('Error at writing logErrors.txt');
    });
  }
};
