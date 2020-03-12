module.exports = {
  HOST: 'localhost',
  USER: 'bozzleyc_beereader',
  PASSWORD: 'Skunkap3',
  DB: 'bozzleyc_beereader',
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};