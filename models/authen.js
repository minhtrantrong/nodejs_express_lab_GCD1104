var {Client} = require('pg');
var conn_string = require('./pg_config');

async function authenticate(uname, pword) {
    let auth = false;
    let shop = "";
    const client = new Client(conn_string);
    await client.connect();
    const query_string = {
        text: 'SELECT * FROM users WHERE user_name=$1 AND pass_word=$2',
        values: [uname, pword],
    } 
    const results = await client.query(query_string);
    // console.log(results);
    if (results.rowCount == 1) { 
        auth = true;
        shop = results.rows[0]['shop']
    }
    client.end();
    return {"auth": auth, "shop": shop};
}

module.exports = authenticate;