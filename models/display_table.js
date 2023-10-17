var {Client}  = require('pg'); 
var conn_string = require('./pg_config');

async function table_display(table_name, user_name, role, shop_id) {
    // Connect to DB
    const client = new Client(conn_string);
    await client.connect(); 
    var query_string ="";
    // Query to DB and get the products table 
    if (role == "director") {
        if (shop_id == 0) {
            query_string = `SELECT * FROM  ${table_name}`;
        } else {
            query_string = {
                text: `SELECT * FROM  ${table_name} WHERE shop = 
                    (SELECT name FROM shops WHERE id = $1)`,
                values: [shop_id],
            };
        }
    } else {
        query_string = {
            text: `SELECT * FROM  ${table_name} WHERE shop = 
                (SELECT shop FROM users WHERE user_name = $1)`,
            values: [user_name],
        };
    }
    const query_result = await client.query(query_string);
    client.end();
    // Generate all cells of table for this data
    console.log(query_result);
    if (role == "director") {
        let table_string = table_products(query_result);
        return table_string;
    } else {
        let table_string = table_crud(query_result);
        return table_string;
    }
}

function table_crud(db_table){
    let htlm_string = `<table border=1> <tr>`;
    const fields_list = [];
    // Generate the table header
    db_table.fields.forEach((field) => {
        htlm_string += `<th> ${field.name} </th>`;
        fields_list.push(field.name);
    });
    // Add CRUD in header
    htlm_string += `<th> CRUD </th>`;

    htlm_string += `</tr>`;
    // Generate all table rows
    for (let i=0; i<db_table.rowCount; i++) {
        row = db_table.rows[i];
        htlm_string += `<tr><form action="/users/crud" method=POST>`;
        fields_list.forEach((field) => {
            let cell = row[field];
            htlm_string += `<td><input type=text name=${field} value=${cell}></td>`;
        });
        htlm_string += `<td><input type="submit" name="btn" value="Update"> 
                            <input type="submit" name="btn" value="Delete"> </td>`;
        htlm_string += `</tr>`;    
    }
    // Add an INSERT row
    htlm_string += `<tr>`
    db_table.fields.forEach((field) => {
        htlm_string += `<td> <input type=text name=${field}></td>`;
        fields_list.push(field.name);
    });
    htlm_string += `<td><input type="submit" name="btn" value="Insert"> </td>`;
    htlm_string += `</tr>`;    
    htlm_string += `</table>`;
    return htlm_string;
}

function table_products(db_table){
    let htlm_string = `<table border=1> <tr>`;
    const fields_list = [];
    // Generate the table header
    db_table.fields.forEach((field) => {
        htlm_string += `<th> ${field.name} </th>`;
        fields_list.push(field.name);
    });
    htlm_string += `</tr>`;
    // Generate all table rows
    for (let i=0; i<db_table.rowCount; i++) {
        row = db_table.rows[i];
        htlm_string += `<tr>`;
        fields_list.forEach((field) => {
            let cell = row[field];
            htlm_string += `<td> ${cell} </td>`;
        });
        htlm_string += `</tr>`;    
    }   
    htlm_string += `</table>`;
    return htlm_string;
}

module.exports = table_display;