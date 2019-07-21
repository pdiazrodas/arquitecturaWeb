
import fs from 'fs';
import { ObjectId } from 'mongojs';
import mongoist from 'mongoist';
import config from 'config';
import moment from 'moment';

import logOperations from '../utils/logOperations';

const db = mongoist(config.connection.mongodb.uri);
db.ObjectId = ObjectId;

exports.addOrder = async function addOrder(req, res, next) {
  const date = moment().format('LTS');
  const params = {
    itemId: ObjectId(req.swagger.params.itemId.value),
    quantity: req.swagger.params.quantity.value,
  };

  try {
    const resp = await db.collection('order').insertOne(params);
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

exports.updateOrder = async function updateOrder(req, res, next) {
  const date = moment().format('LTS');

  try {
    const updateObject = {
      quantity: req.swagger.params.order.value.quantity,
    };

    if (!updateObject.quantity) {
      const error = new Error();
      error.status = 500;
      error.message = 'Nothing to update';
      throw error;
    }

    const resp = await db.collection('order').update(
      {
        _id: ObjectId(req.swagger.params.orderId.value),
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

exports.order = async function order(req, res, next) {
  const date = moment().format('LTS');

  try {
    if (req.method === 'GET' && req.swagger.params.orderId) {
      const data = await db.collection('order').find({ _id: ObjectId(req.swagger.params.orderId.value) });
      res.send(data);
    }

    const data = await db.collection('order').find();
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

exports.deleteOrder = async function deleteOrder(req, res, next) {
  const date = moment().format('LTS');

  try {
    db.collection('order').remove({
      _id: ObjectId(req.swagger.params.orderId.value),
    });
    res.send('Rgistro eliminado');
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
