import { createConnection } from "mysql2/promise";

export let connection = null;
export async function Connection(){
    try{
        connection = await createConnection({
            host : "localhost",
            user:"root",
            password :"@Devang8094",
            database:"shree_swastik"     ,
            port:3306       
        })
        console.log("DataBase connected successfully");
        // return connection;
    }catch(error){
        console.log("Database connection failed", error);
    }
}

export function getConnection(){
    return connection;
}