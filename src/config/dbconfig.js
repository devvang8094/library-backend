// import { createConnection } from "mysql2/promise";

// export let connection = null;
// export async function Connection(){
//     try{
//         connection = await createConnection({
//             host : "localhost",
//             user:"root",
//             password :"@Devang8094",
//             database:"shree_swastik"     ,
//             port:3306       
//         })
//         console.log("DataBase connected successfully");
//         // return connection;
//     }catch(error){
//         console.log("Database connection failed", error);
//     }
// }

// export function getConnection(){
//     return connection;
// }

import { createConnection } from "mysql2/promise";

export let connection = null;

export async function Connection() {
  try {
    connection = await createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "@Devang8094",
      database: process.env.DB_NAME || "shree_swastik",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    });

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.log("❌ Database connection failed:", error.message);
  }
}

export function getConnection() {
  return connection;
}
