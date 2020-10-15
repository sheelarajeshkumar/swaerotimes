const express = require('express'),
    router = express.Router(),
    template = require('./template'),

    passwordHash = require('password-hash'),
    dataModel = require('../models/mcp'),
    mongoose = require('mongoose');
var CronJob = require('cron').CronJob;
var fs = require('fs');
var _ = require('lodash');
var exec = require('child_process').exec;

var dbOptions = {
    user: 'admin',
    pass: '',
    host: 'localhost',
    port: 27017,
    database: 'swaerotimes_db',
    autoBackup: true,
    removeOldBackup: true,
    keepLastDaysBackup: 2,
    autoBackupPath: 'public/backup/' // i.e. /var/database-backup/
};
/* return date object */
function stringToDate (dateString) {
    return new Date(dateString);
}
/* return if variable is empty or not. */
function empty (mixedVar) {
    var undef, key, i, len;
    var emptyValues = [undef, null, false, 0, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
            return true;
        }
    }
    if (typeof mixedVar === 'object') {
        for (key in mixedVar) {
            return false;
        }
        return true;
    }
    return false;
};
// Auto backup script
function dbAutoBackUp(){
    // check for auto backup is enabled or disabled
    if (dbOptions.autoBackup == true) {
        var date = new Date();
        var beforeDate, oldBackupDir, oldBackupPath;
        currentDate = stringToDate(date); // Current date
        var newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
        var newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir; // New backup path for current backup process
        // check for remove old backup after keeping # of days given in configuration
        if (dbOptions.removeOldBackup == true) {
            beforeDate = _.clone(currentDate);
            beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
            oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
            oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir; // old backup(after keeping # of days)
        }
        var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --out ' + newBackupPath; // Command for mongodb dump process
       console.log(cmd);
        exec(cmd, function (error, stdout, stderr) {
            if (empty(error)) {
                // check for remove old backup after keeping # of days given in configuration
                if (dbOptions.removeOldBackup == true) {
                    if (fs.existsSync(oldBackupPath)) {
                        exec("rm -rf " + oldBackupPath, function (err) { });
                    }
                }
            }
        });
    }
}



router.get('/backup', function (req, res, next) {
    console.log("backup start");
    console.log(__dirname);
/*     new CronJob('0 0 0 * * *', function () {
        console.log('1');
        dbAutoBackUp();
    }, null, true, 'America/New_York').start(); */
    dbAutoBackUp();
    console.log("backup end");
    res.redirect('/');
});

module.exports = router;
