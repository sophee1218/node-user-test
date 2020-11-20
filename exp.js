//브라우저에서는 동작하지 않는 스크립트
const exp = require('express');
const dbInfo = require('./db-config');
const oracleDb = require('oracledb');
const port = 80;

var server = exp();

//then : 위에 애가 잘 수행 됐다면.
//catch : then하다가 에러 났을때 싹다 잡아내겠다.
// var con = oracleDb.getConnection(dbInfo)
//         .then(function(con){
//             console.log(con);       
//         })
//         .catch(function (err){
//             console.log(err);
//         });

//async : 자바스크립트는 비동기로 돌기때문에 
//비동기 함수를 포함하는 함수를 정의해서 그 함수를 동기화시키겠다
var getNodeTests = async function(params){
    console.log(params);
    var con = await oracleDb.getConnection(dbInfo);
    var sql = 'select * from node_test';
    if(params){
        sql += ' where 1=1 ';
        if(params.nt_num){
            sql += ' and nt_num=:nt_num ';
        }
        if(params.nt_name){
            sql += ' and nt_name=:nt_name ';
        }
    }
    console.log(sql);
    var result = await con.execute(sql,params);

  
        var jsonArr = [];
        for (var i=0;i<result.rows.length;i++) {
            //console.log(i+','+meta[i]['name'])
            var row = result.rows[i]
            var nt={}
            for (var j=0;j<result.metaData.length;j++) {
                var md = result.metaData[j]
                nt[md.name] = row[j]
            }
            jsonArr.push(nt)
        }
        return jsonArr;
    };
    server.get('/nodetests',async function(req,res,next){
        var jsonArr = await getNodeTests(req.query);
        res.send(jsonArr);
    })
    server.get('/views/*',function(req,res){
        res.sendFile(__dirname + req.url + '.html') 
    })
    server.listen(port,function(){
        console.log(`server started ${port} port`);
    })