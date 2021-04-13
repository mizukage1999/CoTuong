let lastId = null;
if (sessionStorage) {
    lastId = sessionStorage.getItem('myId');
}

export default class PeerCom extends EventTarget {
    constructor() {
        super();
        this._peer = null;
        this._conn = null;
        this._receiveHandlers = {};
        this.isConnected = false;
        this.peerId = null;
    }
    begin(pId=null) {
        console.log('Connecting to Peer server.');
        this.peerId = pId;
        if (lastId) {
            this._peer = new Peer(lastId);
        }
        else {
            this._peer = new Peer();
        }

        let ondisconnected = function () {
            console.log("Data connection has been closed.");
            this.isConnected = false
            this.dispatchEvent(new Event('disconnected'));
            this._conn = null;
            this.peerId = null;
        }.bind(this);

        let onconnected = function () {
            console.log('Connected to peer at ID: ' + this._conn.peer);
            this.dispatchEvent(new CustomEvent('connectedpeer', {
                detail: this._conn.peer
            }));
            this._conn.on('data', this._received.bind(this)); 
            this.peerId = this._conn.peer;
            this.isConnected = true;
        }.bind(this);

        let onconnect = function (conn) {
            this._conn = conn;
            this._conn.on('open', onconnected);
            this._conn.on('close', ondisconnected);
        }.bind(this);

        let onopen = function (id) {
            console.log('Established connection to Peer server. My ID: ' + id);
            if (sessionStorage) {
                sessionStorage.setItem('myId', id);
            }
            if (pId) { // Connect to the peer.
                console.log('Connecting to peer at ID: ' + pId);
                onconnect(this._peer.connect(pId));
            } else { // or wait for a connection
                console.log('Waiting for connection from peer.')
                this.dispatchEvent(new CustomEvent('wait', { detail: id }));
            }
            this._peer.on('connection', onconnect);
        }.bind(this);

        this._peer.on('open', onopen);
    }
    disconnect() {
        if (this._conn) { this._conn.close(); }
        if (this._peer) { this._peer.disconnect(); }
    }

    _received(obj) {
        let type = obj.type;
        let data = obj.data;
        if (this._receiveHandlers[type]) {
            let handle = function () {
                this._receiveHandlers[type](data)
            }.bind(this);
            window.setTimeout(handle, 0);
        }
    }

    addReceiveHandler(type, fct) {
        this._receiveHandlers[type] = fct;
    }

    removeReceiveHandler(type) {
        delete this._receiveHandlers[type];
    }

    send(type, data) {
        if (!this._conn) { throw new Error('Connection not established!'); }
        this._conn.send({
            'type': type,
            'data': data
        });
    }
}