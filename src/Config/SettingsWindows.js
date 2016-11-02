module.exports = {
  database: {
    nodes: '../databases/nodes.db'
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
  }
}
