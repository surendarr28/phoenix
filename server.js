var express = require('express')
var path = require('path');
var app = express();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

app.use(express.static(path.resolve(__dirname, 'app/build')));
console.log(path.resolve(__dirname, 'app/build'));

app.get('/v1/api/tables', function (req, res) {
    try {
        client.query('SELECT * from tblTable where isAvail = true;', (err, result) => {
            if (err) return res.send(err);
            return res.send(result.rows);

        });
    } catch (e) {
        return res.send("Some Error");
    }
});

app.get('/v1/api/tables/:tableId', function (req, res) {
    try {
        client.query('select item.name, oim.status, oim.quantity, oim.order_id, item.item_id from tblordertablemapping as otm' +
            'join tblorederitemmapping as oim on oim.order_id = otm.order_id' +
            'join tblitem as item on item.id = oim.item_id' +
            'where otm.table_id = ' + req.params.tableId + ' and otm.orderstatus = 1', (err, result) => {
                if (err) return res.send(err);
                return res.send(result.rows);

            });
    } catch (e) {
        return res.send("Some Error");
    }
});

app.get('/', function (req, res) {
    res.send("oreder me");
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!')
})