
const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '10mb' }))

const credentials={
	host: 'proyectointegrador.clx1yhjqu4zt.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Josep25062002',
    database: 'db1'
}

app.get('/', (req, res) => {
	res.send('Desplegao')
})



app.get('/api/vales', (req, res) => {
	var connection = mysql.createConnection(credentials)
	connection.query('SELECT * FROM valecombustible', (err, rows) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send(rows)
		}
	})
})

app.post('/api/guardarvale', (req, res) => {
	const { Fecha,Tipo_combustible,Litros_combustible,Placa } = req.body
	const params = [[Fecha,Tipo_combustible,Litros_combustible,Placa]]
	var connection = mysql.createConnection(credentials)
	connection.query('INSERT INTO valecombustible (Fecha,Tipo_combustible,Litros_combustible,Placa) VALUES ?', [params], (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send({ "status": "success", "message": "Usuario creado" })
		}
	})
	connection.end()
})



app.get('/api/valesSet', (req, res) => {
	var connection = mysql.createConnection(credentials)
	connection.query('SELECT Placa_Combustible FROM automovil', (err, rows) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send(rows)
		}
	})
})

app.get('/api/gas', (req, res) => {
	var connection = mysql.createConnection(credentials)
	connection.query('SELECT * FROM combustible', (err, rows) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send(rows)
		}
	})
})

app.post('/api/busquedaVales', (req, res) => {
	const { Placa_Combustible, Fecha } = req.body;
	var connection = mysql.createConnection(credentials);
	connection.query(
	  'SELECT * FROM automovil NATURAL JOIN valecombustible  WHERE Placa_Combustible = ? AND Fecha=?',
	  [Placa_Combustible,Fecha], 
	  (err, rows) => {
		if (err) {
		  res.status(500).send(err);
		} else {
		  res.status(200).send(rows);
		}
		connection.end(); 
	  }
	);
  });

  app.post('/api/busquedaMod', (req, res) => {
	const { Placa_Combustible, Fecha } = req.body;
	var connection = mysql.createConnection(credentials);
	connection.query(
	  'SELECT * FROM valecombustible  WHERE Placa = ? AND Fecha=?',
	  [Placa_Combustible,Fecha], 
	  (err, rows) => {
		if (err) {
		  res.status(500).send(err);
		} else {
		  res.status(200).send(rows);
		}
		connection.end(); 
	  }
	);
  });
  
  app.post('/api/editar', (req, res) => {
	const {  Fecha,Tipo_Combustible,Litros_Combustible,Placa } = req.body
	const params = [ Fecha,Tipo_Combustible,Litros_Combustible,Placa]
	var connection = mysql.createConnection(credentials)
	connection.query('UPDATE valecombustible set Fecha=?,Tipo_Combustible=?,Litros_Combustible=? WHERE Placa  = ?', params, (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send({ "status": "success", "message": "USuario editado" })
		}
	})
	connection.end()
})

app.post('/api/fechasVales', (req, res) => {
	console.log('Body recibido en la API:', req.body);
	const Fecha = req.body[0].Fecha;
	var connection = mysql.createConnection(credentials);
	console.log('Fecha recibida en la API:', Fecha);
	connection.query(
	  ' SELECT Tipo_Combustible, sum(Litros_Combustible) as Total_Litros, sum(Litros_Combustible*Precio) as Total_Venta from db1.valecombustible natural join combustible where Fecha=?  group by Tipo_Combustible',
	  [Fecha], 
	  (err, rows) => {
		if (err) {
		  res.status(500).send(err);
		  
		} else {
			
		  res.status(200).send(rows);
		  
		}
		connection.end(); 
	  }
	);
  });



app.listen(4000, () => console.log('Serrvidor alojado en el puerto 4000'))


