var {Client}  = require('pg'); 
var conn_string = require('./pg_config');

async function select_options_form() {
    // Query DB to get the list of shops
    const query_string = `SELECT * FROM shops`;
    const client = new Client(conn_string);
    await client.connect();
    const query_result = await client.query(query_string);
    // Generate the select options form 
    let html_form = `<form action="" method=POST>
        <label for="shops">Select a shop:</label>
        <select name="shop_selected">
        <option value = 0 selected> All </option>`
    for (let i = 0; i < query_result.rowCount; i++) {
        let row = query_result.rows[i];
        html_form += `<option value=${row.id}> ${row.name} </option>`;
    }
    html_form += `</select><input type="submit" value="Submit"></form>`;
    return html_form;
}

module.exports = select_options_form;