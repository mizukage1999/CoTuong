class Storage {
    constructor() { this.store = {}; }
    setItem(key, value) { this.store[key] = value; }
    getItem(key) { return this.store[key]; }
}

let store;
if (localStorageAvailable()) {
    store = window.localStorage;
}
else {
    store = new Storage();
}

export function setItem(key, string) {
    store.setItem(key, string);
}

export function getItem(key) {
    return store.getItem(key);
}
function localStorageAvailable() {
    try {
        let storage = window.localStorage;
        let x = '_storage_test_';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&(storage && storage.length !== 0);
    }
}
