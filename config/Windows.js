module.exports = {
  database: {
      infra: 'F:/databases/infra.db',
      nodes: 'F:/databases/nodes.db'
  },
  mqtt: {
    host: 'http://10.0.0.200',
    port: 1883,
    prefix: 'windows_'
  },
  udp_server: {
    recv_host: '0.0.0.0',
    recv_port: 33333,
    send_host: '255.255.255.255',
    send_port: 22222
  },
  serial_port: {
    name_port: 'COM19',
    baud_rate: 115200
  },
  application_port: {
    portal: 8080,
    src: 4000,
    infra: 5000
  }
}
