let pageTitle = document.title;
export function setTitle(title) {
    pageTitle = title;
    document.title = title;
}

export function flashTitle(msg) {
    if (document.hasFocus()) { return; }
    let toggle = function() {
        document.title = (document.title === pageTitle) ? msg : pageTitle;
    }
    let id = window.setInterval(toggle, 1000);

    let clear = function() {
        window.removeEventListener('focus', clear);
        window.clearInterval(id);
        document.title = pageTitle;
    }
    window.addEventListener('focus', clear);
}
//Push notification to ask user
export function pushAsk(callback) {
    function checkNotificationPromise() {
        try {
            Notification.requestPermission().then();
        } catch {
            return false;
        }
        return true;
    }

    function handlePermission(permission) {
        if(!('permission' in Notification)) {
            Notification.permission = permission;
        }
        callback(permission);
    }
    if (!"Notification" in window) {
        console.log("This browser does not support notifications.");
    } else {
        if (checkNotificationPromise()) {
            Notification.requestPermission()
            .then(function (permission) {
                handlePermission(permission);
            })
        } else {
            Notification.requestPermission(function(permission) {
                handlePermission(permission);
            });
        }
    }
}