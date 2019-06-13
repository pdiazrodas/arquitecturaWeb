
import fs from 'fs';
import { ObjectId } from 'mongojs';
import mongoist from 'mongoist';
import config from 'config';
import moment from 'moment';

import logOperations from '../utils/logOperations';

const db = mongoist(config.connection.mongodb.uri);
db.ObjectId = ObjectId;

exports.addPet = async function addPet(req, res, next) {
  const date = moment().format('LTS');
  const params = {
    name: req.swagger.params.petName.value,
    age: req.swagger.params.petAge.value,
    url1: req.swagger.params.urlPetPicture1.value,
    url2: req.swagger.params.urlPetPicture2.value,
  };

  if (!params.url1) delete params.url1;
  if (!params.url2) delete params.url2;

  try {
    const resp = await db.collection('pet').insertOne(params);
    res.send(resp);
  } catch (e) {
    switch (e.status) {
      case 500:
        res.status(e.status);
        res.json(e.message);
        fs.appendFile(logOperations.logFilePath, `${date} - Status Code: ${e.status} - ${e.message} - Host: ${req.headers.host} IP: ${req.ip}\n`, (err) => {
          if (err) process.stdout.write('Error at writing logErrors.txt');
        });
        break;
      default:
        next(e);
    }
  }
};

exports.updatePet = async function updatePet(req, res, next) {
  const date = moment().format('LTS');

  try {
    res.send('ok');
  } catch (e) {
    switch (e.status) {
      case 400:
        res.status(e.status);
        res.json(e.message);
        fs.appendFile(logOperations.logFilePath, `${date} - Status Code: ${e.status} - ${e.message} at Download controller - Host: ${req.headers.host} IP: ${req.ip}\n`, (err) => {
          if (err) process.stdout.write('Error at writing logErrors.txt');
        });
        break;
      case 500:
        res.status(e.status);
        res.json(e.message);
        fs.appendFile(logOperations.logFilePath, `${date} - Status Code: ${e.status} - ${e.message} - Host: ${req.headers.host} IP: ${req.ip}\n`, (err) => {
          if (err) process.stdout.write('Error at writing logErrors.txt');
        });
        break;
      default:
        next(e);
    }
  }
};

exports.pet = async function pet(req, res, next) {
  const date = moment().format('LTS');

  try {
    const data = await db.collection('pet').find();
    res.send(data);
  } catch (e) {
    switch (e.status) {
      case 400:
        res.status(e.status);
        res.json(e.message);
        fs.appendFile(logOperations.logFilePath, `${date} - Status Code: ${e.status} - ${e.message} at Download controller - Host: ${req.headers.host} IP: ${req.ip}\n`, (err) => {
          if (err) process.stdout.write('Error at writing logErrors.txt');
        });
        break;
      case 500:
        res.status(e.status);
        res.json(e.message);
        fs.appendFile(logOperations.logFilePath, `${date} - Status Code: ${e.status} - ${e.message} - Host: ${req.headers.host} IP: ${req.ip}\n`, (err) => {
          if (err) process.stdout.write('Error at writing logErrors.txt');
        });
        break;
      default:
        next(e);
    }
  }
};

exports.deletePet = async function deletePet(req, res, next) {
  const date = moment().format('LTS');

  try {
    res.send('ok');
  } catch (e) {
    switch (e.status) {
      case 400:
        res.status(e.status);
        res.json(e.message);
        fs.appendFile(logOperations.logFilePath, `${date} - Status Code: ${e.status} - ${e.message} at Download controller - Host: ${req.headers.host} IP: ${req.ip}\n`, (err) => {
          if (err) process.stdout.write('Error at writing logErrors.txt');
        });
        break;
      case 500:
        res.status(e.status);
        res.json(e.message);
        fs.appendFile(logOperations.logFilePath, `${date} - Status Code: ${e.status} - ${e.message} - Host: ${req.headers.host} IP: ${req.ip}\n`, (err) => {
          if (err) process.stdout.write('Error at writing logErrors.txt');
        });
        break;
      default:
        next(e);
    }
  }
};
