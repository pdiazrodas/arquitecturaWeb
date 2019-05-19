
import fs from 'fs';
import moment from 'moment';

import logOperations from '../utils/logOperations';

exports.login = async function login(req, res, next) {
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
