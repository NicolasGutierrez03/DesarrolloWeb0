<?php

class Conexion
{
    private $connection;
    private $host;
    private $username;
    private $password;
    private $db;
    private $port;
    private $server;

    public function __construct()
    {
        $this->server = $_SERVER['SERVER_NAME'];
        $this->connection = null;
        // $this->host = 'localhost';
        $this->host = '';
        $this->port = 3306; //puerto por default de mysql
        $this->db = '';
        $this->username = '';
        $this->password = '';

        /*
        SQL: Crear la bd y la tabla

        CREATE TABLE proyecto(
            id INT PRIMARY KEY,
            nombre VARCHAR(50) not null,
            descripcion VARCHAR(50) not null,
            integrantes VARCHAR(500) NOT NULL,
            url VARCHAR(100) NOT NULL,
            activo BOOLEAN NOT NULL
        );

        INSERT INTO `proyecto` (`id`, `nombre`, `descripcion`, `integrantes`, `url`, `activo`) VALUES ('1', 'Demo1', 'Es el primero de ejemplo', 'Sebastián Cabezas, y todo el curso', 'https://udp.coningenio.cl/', '1');
         */
    }

    public function getConnection()
    {
        try {
            $this->connection = mysqli_connect($this->host, $this->username, $this->password, $this->db, $this->port);
            mysqli_set_charset($this->connection, 'utf8');
            if (!$this->connection) {
                throw new Exception("Error en la conexión: " . mysqli_connect_error());
            }
            return $this->connection;
        } catch (Exception $ex) {
            error_log($ex->getMessage());
            die("Error al conectar a la base de datos.");
        }
    }

    public function closeConnection()
    {
        if ($this->connection) {
            mysqli_close($this->connection);
        }
    }
}

?>