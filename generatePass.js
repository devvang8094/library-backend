import { hashSync } from "bcrypt";

const pass = @vishal8104;
const hashPass = hashSync(pass, 10);
console.log(hashSync);