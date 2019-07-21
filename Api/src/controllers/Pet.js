
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

exports.updatePet = async function updatePet(req, res, next) {
  const date = moment().format('LTS');

  try {
    const updateObject = {
      url1: req.swagger.params.petUrls.value.urlPetPicture1,
      url2: req.swagger.params.petUrls.value.urlPetPicture2,
    };

    if (!updateObject.url1 && !updateObject.url2) {
      const error = new Error();
      error.status = 500;
      error.message = 'Nothing to update';
      throw error;
    }

    if (!updateObject.url1) delete updateObject.url1;
    if (!updateObject.url2) delete updateObject.url2;

    const resp = await db.collection('pet').update(
      {
        _id: ObjectId(req.swagger.params.petId.value),
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

exports.pet = async function pet(req, res, next) {
  const date = moment().format('LTS');

  try {
    if (req.method === 'GET' && req.swagger.params.petId) {
      const data = await db.collection('pet').find({ _id: ObjectId(req.swagger.params.petId.value) });
      res.send(data);
    }

    const data = await db.collection('pet').find();
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

exports.deletePet = async function deletePet(req, res, next) {
  const date = moment().format('LTS');

  try {
    const resp = db.collection('pet').remove({
      _id: ObjectId(req.swagger.params.petId.value),
    });
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
