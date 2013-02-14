require 'webrick'

root = File.expand_path '..', __FILE__
server = WEBrick::HTTPServer.new Port: 1337, DocumentRoot: root

trap 'INT' do server.shutdown end

server.start
