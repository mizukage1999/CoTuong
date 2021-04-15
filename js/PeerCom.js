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

    /**
     * Establishes a connection between two peers.  If a peer ID is provided, it 
     * begins a connection with that Peer.  Otherwise, it calls the wait callback 
     * function, passing a connection ID.  The user must send this ID to their 
     * peer so that they can connect.
     * 
     * @param {String} pId If given, the peer ID to connect to.
     */
    begin(pId=null) {
        // console.log('Connecting to Peer server.');
        this.peerId = pId;
        if (lastId) {
            this._peer = new Peer(lastId);
        }
        else {
            this._peer = new Peer();
        }
    }


    /**
     * Received data from a peer.
     * @param {Object} obj JSON object containing 'type' (type of data) and 'data'
     * (data received)
     */
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

    /**
     * When the we receive data from the peer, call a function if it matches
     * the given type.
     * @param {String} type Type of data to handle.
     * @param {Function} fct Function to call when we receive that type of data.  
     * The data is passed to fct as a parameter.
     */
    addReceiveHandler(type, fct) {
        this._receiveHandlers[type] = fct;
    }

    removeReceiveHandler(type) {
        delete this._receiveHandlers[type];
    }


    /**
     * Send data to peer.
     * @param {String} type String that describes the data.
     * @param {*} data Data to send.
     */
    // send(type, data) {
    //     if (!this._conn) { throw new Error('Connection not established!'); }
    //     this._conn.send({
    //         'type': type,
    //         'data': data
    //     });
    // }
}

