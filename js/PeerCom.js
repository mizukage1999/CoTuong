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
    }

}