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
        // console.log('Connecting to Peer server.');
        this.peerId = pId;
        if (lastId) {
            this._peer = new Peer(lastId);
        }
        else {
            this._peer = new Peer();
        }

        
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


    /**
     * Send data to peer.
     * @param {String} type String that describes the data.
     * @param {*} data Data to send.
     */
    
}

