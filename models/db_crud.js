var {Client}  = require('pg'); 
var conn_string = require('./pg_config');

async function crud(body) {
    let id = parseInt(body.id);
    let name = body.name;
    let price = parseInt(body.price);
    let amount = parseInt(body.amount);
    let shop = body.shop;
    let btn = body.btn;
    // Connect to DB
    const client = new Client(conn_string);
    await client.connect(); 
    if (btn == "Update" ) {
        // query to update DB 
        console.log("UPDATED")    
    }
    else if (btn == "Delete") {
        // Query to delete row in DB
        const query_string = {
            text: `DELETE FROM products WHERE id = $1`,
            values: [id],
        }
        const query_result = await client.query(query_string);
        console.log("DELETE")
    }
    else {
        // Query to insert in DB
        console.log("INSERT")
    }

}

module.exports = crud; 