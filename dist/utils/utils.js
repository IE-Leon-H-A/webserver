import "../socketio/socket.io.js"

export function get_sock_object() {
    return io();
}
