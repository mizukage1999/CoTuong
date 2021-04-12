import * as notify from './notify.js';
import * as storage from './storage.js';
import PeerCom from './PeerCom.js';
import Board from './chess/board.js';



const elBody = document.getElementById('xiangqi_board_game');

// Board
const elGame = document.getElementById('game');
const elBoard = document.getElementById('board');

// const elBtnChat = document.getElementById('btnChat');
const elBtnSettings = document.getElementById('btnSettings');

const elSndCapture = document.getElementById('sndCapture');
const elSndCheck = document.getElementById('sndCheck');
const elSndMove = document.getElementById('sndMove');

// Forms
// const elBtnOnline = document.getElementById('btnOnline');
const elBtnLocal = document.getElementById('btnLocal');
const elBtnComputer = document.getElementById('btnComputer');

const elBtnCloseGameover = document.getElementById('btnCloseGameover');
// const elBtnCopyUrl = document.getElementById('btnCopyUrl');

// const elMsgUrl = document.getElementById('msgUrl');
const elMsgResult = document.getElementById('msgResult');

// const elPeerShow = document.getElementById('peerShow');
// const elPeerWait = document.getElementById('peerWait');

const elSelFirstMove = document.getElementById('selFirstMove');
const elSelHandicap = document.getElementById('selHandicap');
const elSelSkill = document.getElementById('selSkill');
const elBtnComputerStart = document.getElementById('btnComputerStart');

// Chat
const elMessages = document.getElementById('bubbles');
const elTxtMsg = document.getElementById('txtMsg');
const elBtnSendMsg = document.getElementById('btnSendMsg');

// Controls
const elBtnUndo = document.getElementById('btnUndo');
const elSelSideSkill = document.getElementById('selSideSkill');
const elChkBoardSize = document.getElementById('chkBoardSize');
const elChkAnimated = document.getElementById('chkAnimated');
const elChkNotiSound = document.getElementById('chkNotiSound');
const elChkNotiPush = document.getElementById('chkNotiPush');

const MODALS = [
    'mod_gameselect',
    'mod_waiting',
    // 'mod_disconnected',
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
        console.log('I am slave');
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

        if (computer) { // vs. computer
            board.setSearch(16);
            board.millis = Math.pow(10, skill + 1);
            board.response();
        }

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