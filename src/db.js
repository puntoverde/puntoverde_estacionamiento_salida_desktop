const mysql =require('promise-mysql')

/**funcion que creara un pool de conexiones  */
const pool = async ()=> await mysql.createPool({host:'192.168.1.111',user:'dev_pv',password:'pss_dEv_pv_18',port:3306,database:'punto_verde_v2',connectionLimit : 3});
// const pool = async ()=> await mysql.createPool({host:'127.0.0.1',user:'root',password:'rootroot',port:3306,database:'punto_verde_2021',connectionLimit : 3});

/**exporta no  la funcion si el pool regresado por la funcion */
/**si fuera la funcuion seria si nparaentesis asi estaria exportando la funcion  */
/**pero como es pool() ya eejecuto la function y con ello el return que es el pool... */
module.exports = pool();