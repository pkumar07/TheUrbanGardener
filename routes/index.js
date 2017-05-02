var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var dbConfig = require('./dbConfig.js');
/* GET home page. */
router.post('/', function(req, res, next) {

    res.render('index', { title: 'Express' });
});
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//volunteer form filled
router.get('/volunteer', function(req, res, next) {
    res.render('volunteer', { title: 'Express' });
});



//maintenance request form
router.get('/reqmaintain', function(req, res, next) {
    res.render('reqmaintain', { title: 'Express' });
});
//maintenance request form

//maintenance request form filled
router.post('/volunteer', function(req, res, next) {

    res.render('volunteer', { title: 'Express' });
    //res.render('volunteer', { title: 'Express' });
});

router.get('/knowmore', function(req, res, next) {

    res.render('knowMore', { title: 'Express' });
    //res.render('volunteer', { title: 'Express' });
});





//your area species
router.get('/yourareaspecies', function(req, res, next) {
    res.render('yourareaspecies', { title: 'Express' });
});

//area stats
router.get('/areastats', function (req,res,next) {
    res.render('areastats', {title: 'Express'});

});

router.get('/treediversity', function(req, res, next) {

    oracledb.getConnection(
        {
            user: dbConfig.user,
            password: dbConfig.password,
            connectString:dbConfig.connectionstring
        }
        ,
        function(err, connection)
        {
            var areaname = req.query.data;

            console.log("woah");

            var query = "SELECT A.AREA_NAME ,A.AREA_ID ,T.SPECIES_NAME ,ROUND(SUM(T.TREE_ID)/100) AS TREE_COUNT FROM TREES T INNER JOIN AREAS A ON T.AREA_ID = A.AREA_ID WHERE T.IS_ALIVE=1 AND A.AREA_NAME='"+areaname+"' GROUP BY A.AREA_ID,A.AREA_NAME,T.SPECIES_NAME ORDER BY A.AREA_ID";
            console.log(query);

            connection.execute(
                query,
                function(err, results)
                {
                    if (err) {
                        console.error(err.message);

                        doRelease(connection);
                        return;
                    }
                    //added else
                    else
                    {

                        console.log(results.rows);

                        res.send({chartdata: results.rows});


                        doRelease(connection);
                    }


                });
        });

// Note: connections should always be released when not needed
    function doRelease(connection)
    {
        connection.close(
            function(err) {
                if (err) {
                    console.error(err.message);
                }
            });
    }
});

router.get('/treesuitarea', function(req, res, next) {

    oracledb.getConnection(
        {
            user: dbConfig.user,
            password: dbConfig.password,
            connectString:dbConfig.connectionstring
        }
        ,
        function(err, connection)
        {
            var areaname = req.query.data;

            connection.execute(
                // The statement to execute
                "SELECT TS.SPECIES_NAME FROM TREE_SPECIES TS WHERE TS.TEMP_REQUIRED BETWEEN (SELECT A.TEMPERATURE-40 FROM AREAS A WHERE A.AREA_NAME='"+areaname+"') AND (SELECT A.TEMPERATURE+50 FROM AREAS A WHERE A.AREA_NAME='"+areaname+"') AND TS.WATER_REQUIRED BETWEEN (SELECT A.RAINFALL -70 FROM AREAS A WHERE A.AREA_NAME='"+areaname+"') AND (SELECT A.RAINFALL+50 FROM AREAS A WHERE A.AREA_NAME='"+areaname+"') GROUP BY TS.SPECIES_ID,TS.SPECIES_NAME,TS.PRUNING_DURATION,TS.TEMP_REQUIRED,TS.WATER_REQUIRED ORDER BY TS.PRUNING_DURATION ASC",

                function(err, results)
                {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }
                    //added else
                    else
                    {
                        //console.log("Response recieved",results.resultSet.getRows());
                        console.log(results.rows);
                        //just have it inside an object to esily identify it while fetching
                        res.send({chartdata: results.rows});


                        doRelease(connection);
                    }

                });
        });

// Note: connections should always be released when not needed
    function doRelease(connection)
    {
        connection.close(
            function(err) {
                if (err) {
                    console.error(err.message);
                }
            });
    }
});

router.get('/pollutiongases', function(req, res, next) {
    // console.log(req);
    oracledb.getConnection(
        {
            user: dbConfig.user,
            password: dbConfig.password,
            connectString:dbConfig.connectionstring
        }
        ,
        function(err, connection)
        {

            var areaname = req.query.data;

            connection.execute(
                "SELECT AREA_NAME ,AQI ,CO2 ,CO ,NO2 ,SO FROM ( SELECT * FROM POLLUTION P WHERE P.AREA_NAME ='"+areaname+"' ORDER BY DATE_RECORDED DESC ) WHERE ROWNUM=1",
                function(err, results)
                {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }
                    //added else
                    else
                    {
                        //console.log("Response recieved",results.resultSet.getRows());
                        console.log(results.rows);
                        //just have it inside an object to esily identify it while fetching
                        res.send({chartdata: results.rows});


                        doRelease(connection);
                    }

                });
        });

// Note: connections should always be released when not needed
    function doRelease(connection)
    {
        connection.close(
            function(err) {
                if (err) {
                    console.error(err.message);
                }
            });
    }
});

router.get('/treesplanted', function(req, res, next) {
    // console.log(req);
    oracledb.getConnection(
        {
            user: dbConfig.user,
            password: dbConfig.password,
            connectString:dbConfig.connectionstring
        }
        ,
        function(err, connection)
        {

            connection.execute(
                // The statement to execute
                //"SELECT length,country1 FROM borders WHERE country1 = :id",

                "SELECT DISTINCT A.AREA_NAME ,A.AREA_ID ,ROUND(SUM(T.TREE_ID)/100) AS TREE_COUNT FROM TREES T INNER JOIN AREAS A ON T.AREA_ID = A.AREA_ID WHERE T.PLANTED_DATE BETWEEN ADD_MONTHS(SYSDATE,-150) AND ADD_MONTHS(SYSDATE,-10) GROUP BY A.AREA_ID,A.AREA_NAME ORDER BY A.AREA_ID",

                function(err, results)
                {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }
                    //added else
                    else
                    {
                        //console.log("Response recieved",results.resultSet.getRows());
                        console.log(results.rows);
                        //just have it inside an object to esily identify it while fetching
                        res.send({chartdata: results.rows});


                        doRelease(connection);
                    }

                });
        });

// Note: connections should always be released when not needed
    function doRelease(connection)
    {
        connection.close(
            function(err) {
                if (err) {
                    console.error(err.message);
                }
            });
    }
});







module.exports = router;
