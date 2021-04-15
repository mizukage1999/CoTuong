import * as notify from './notify.js';
import * as storage from './storage.js';
import PeerCom from './PeerCom.js';
import Board from './chess/board.js';



const elBody = document.getElementById('xiangqi_board_game');

// Board
const elGame = document.getElementById('game');
const elBoard = document.getElementById('board');


const elBtnSettings = document.getElementById('btnSettings');
const elSndCapture = document.getElementById('sndCapture');
const elSndCheck = document.getElementById('sndCheck');
const elSndMove = document.getElementById('sndMove');

// Forms
const elBtnLocal = document.getElementById('btnLocal');

const elBtnCloseGameover = document.getElementById('btnCloseGameover');
const elMsgResult = document.getElementById('msgResult');


const elSelFirstMove = document.getElementById('selFirstMove');
const elSelHandicap = document.getElementById('selHandicap');
const elSelSkill = document.getElementById('selSkill');


// Controls
const elBtnUndo = document.getElementById('btnUndo');
const elBtnRedo = document.getElementById('btnRedo');


const elSelSideSkill = document.getElementById('selSideSkill');
const elChkBoardSize = document.getElementById('chkBoardSize');
const elChkAnimated = document.getElementById('chkAnimated');
const elChkNotiSound = document.getElementById('chkNotiSound');
const elChkNotiPush = document.getElementById('chkNotiPush');

const MODALS = [
    'mod_gameselect',
    'mod_waiting',
    'mod_computer',
    'mod_gameover'
];

let showModal = function (name) {
    elBody.classList.add('shade');
    for (let i = 0, len = MODALS.length; i < len; ++i) {
        elBody.classList.remove(MODALS[i]);
    }
    elBody.classList.add(name);
}

let hideModals = function () {
    elBody.classList.remove('shade');
    for (let i = 0, len = MODALS.length; i < len; ++i) {
        elBody.classList.remove(MODALS[i]);
    }
}

const TYPE_LOCAL = -1;
const TYPE_FIRSTMOVE = 1;
const TYPE_OTHERMOVE = 0;

let main = function () {
    let peerId = new URLSearchParams(window.location.search).get('peerId');
    let peerCom = new PeerCom();

    if (peerId !== null) {
        // console.log('Test');
        peerCom.begin(peerId);
        showModal('mod_waiting');
    } else {
        console.log('I am master');
        peerCom.begin();
        showModal('mod_gameselect');
    }

    elBody.classList.remove('preload');

    let board = null;

    let start = function (computer=false, skill=0) {
        board.animated = (storage.getItem('animated') !== 'disabled');

        

        let onmove = function(evt) {
            let move = evt.detail;
            if (board.online) {
                if (!move.isComputer) {
                    peerCom.send('Move', move);
                }
                else {
                    if (move.check) {
                        notify.flashTitle('Check!');
                    }
                    else {
                        notify.flashTitle('Your move!');
                    }
                }
            }
            if (storage.getItem('notiSound') === 'enabled') {
                if (move.check) { notify.playSound(elSndCheck); }
                else if (move.capture) { notify.playSound(elSndCapture); }
                else { notify.playSound(elSndMove); }
            }
        };
        board.addEventListener('move', onmove);

        let ongameover = function(evt) {
            let details = evt.detail;
            if (board.online) {
                if (details.checkmate) {
                    notify.flashTitle('Checkmate!');
                }
                else {
                    notify.flashTitle('Gameover!');
                }
            }
            elMsgResult.innerHTML = details.message;
            showModal('mod_gameover');
        };
        board.addEventListener('gameover', ongameover);

        let cls = (computer) ? 'play_computer' : (board.online) ? 'play_online' : 'play_local';
        elBody.classList.add(cls);
    }

    // DOM
    let resize = function () {
        let availWidth = elGame.clientWidth;
        let availHeight = elGame.clientHeight;


        let height = availHeight;
        let width = ~~((height * 9)/10) + 1;
        if (width > availWidth) {
            width = availWidth;
            height = ~~((width * 10)/9) + 1;
        }

        width -= 2; // borders
        height -= 2;

        elBoard.style.width = width + 'px';
        elBoard.style.height = height + 'px';

        elMessages.scrollTop = elMessages.scrollHeight;

        if (board) { board.resize(); }
    };
    window.addEventListener('resize', resize);
    //resize(); // Not necessary because of setBoardSize() below

    let skillChange = function (evt) {
        let skill = evt.target.selectedIndex;
        elSelSkill.options[skill].selected = true;
        elSelSideSkill.options[skill].selected = true;
    };
    elSelSkill.addEventListener('change', skillChange);
    elSelSideSkill.addEventListener('change', skillChange);

    elBtnLocal.addEventListener('click', function () {
        board = new Board(elBoard, TYPE_LOCAL, false, 0);
        start();
        hideModals();
    });

    

    elBtnUndo.addEventListener('click', function (evt) {
        if (board) { board.retract(); }
    });
    // elBtnRedo.addEventListener('click', function (evt) {
    //     if (board) { board.expand() ; }
    // });


    let setBoardSize = function () {
        if (storage.getItem('boardSize') === 'disabled') {
            elBoard.style.maxWidth = '';
            elBoard.style.maxHeight = '';
        }
        else {
            elBoard.style.maxWidth = '521px';
            elBoard.style.maxHeight = '577px';
        }
        resize();
    };
    elChkBoardSize.addEventListener('change', function(evt) {
        let status = elChkBoardSize.checked ? 'enabled' : 'disabled';
        storage.setItem('boardSize', status);
        setBoardSize();
    });
    elChkBoardSize.checked = !(storage.getItem('boardSize') === 'disabled');
    setBoardSize();

    elChkNotiSound.addEventListener('change', function(evt) {
        let status = elChkNotiSound.checked ? 'enabled' : 'disabled';
        storage.setItem('notiSound', status);
    });
    elChkNotiSound.checked = (storage.getItem('notiSound') === 'enabled');

    elChkAnimated.addEventListener('change', function(evt) {
        let status = elChkAnimated.checked ? 'enabled' : 'disabled';
        storage.setItem('animated', status);
        if (board) {
            board.animated = elChkAnimated.checked;
        }
    });
    elChkAnimated.checked = (storage.getItem('animated') !== 'disabled');

    elChkNotiPush.addEventListener('change', function(evt) {
        if (notify.pushStatus() !== 'granted' && elChkNotiPush.checked) {
            notify.pushAsk(function (permission) {
                if (permission === 'granted') {
                    storage.setItem('notiPush', 'enabled');
                }
                else if (permission === 'denied') {
                    elChkNotiPush.checked = false;
                    elChkNotiPush.disabled = true;
                }
            });
        }
        else {
            let status = elChkNotiPush.checked ? 'enabled' : 'disabled';
            storage.setItem('notiPush', status);
        }
    });
    if (notify.pushStatus() === 'denied') { // disable
        elChkNotiPush.checked = false;
        elChkNotiPush.disabled = true;
    }
    else {
        elChkNotiPush.checked = (storage.getItem('notiPush') === 'enabled');
    }

    
    window.addEventListener('focus', function(evt) {
        if (notiMove) { notiMove.close(); }
    });

    
}

main();

