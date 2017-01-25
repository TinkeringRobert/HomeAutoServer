module.exports = {
  database: {
      infra: 'home/pi/Database/infra.db',
      nodes: 'home/pi/Database/nodes.db'
  },
  mqtt: {
    host: 'http://127.0.0.1',
    port: 1883,
    prefix: ''
  },
  udp_server: {
    recv_host: '255.255.255.255',
    recv_port: 33333,
    send_host: '255.255.255.255',
    send_port: 22222
  },
  serial_port: {
    name_port: '/dev/ttyACM0',
    baud_rate: 115200
  },
  application_port: {
    portal: 80,
    src: 4000,
    infra: 5000
  }
}
