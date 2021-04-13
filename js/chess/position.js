"use strict";

function binarySearch(vlss, vl) {
  let low = 0;
  let high = DAT_LEN - 1;
  while (low <= high) {
    let mid = (low + high) >> 1;
    if (vlss(mid, 0) < vl) {
      low = mid + 1;
    } else if (vlss(mid, 0) > vl) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  return -1;
}

const MATE_VALUE = 10000;
const BAN_VALUE = MATE_VALUE - 100;
const WIN_VALUE = MATE_VALUE - 200;
const NULL_SAFE_MARGIN = 400;
const NULL_OKAY_MARGIN = 200;
const DRAW_VALUE = 20;
const ADVANCED_VALUE = 3;

const PIECE_KING = 0;
const PIECE_ADVISOR = 1;
const PIECE_BISHOP = 2;
const PIECE_KNIGHT = 3;
const PIECE_ROOK = 4;
const PIECE_CANNON = 5;
const PIECE_PAWN = 6;

const RANK_TOP = 3;
const RANK_BOTTOM = 12;
const FILE_LEFT = 3;
const FILE_RIGHT = 11;

const ADD_PIECE = false;
const DEL_PIECE = true;

const IN_BOARD_ = new Uint8Array([
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]);

const IN_FORT_ = new Uint8Array([
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]);

const LEGAL_SPAN = new Uint8Array([
                       0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0,
]);

const KNIGHT_PIN_ = new Int16Array([
                              0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,-16,  0,-16,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0, -1,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0, -1,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0, 16,  0, 16,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,
]);

const KING_DELTA = [-16, -1, 1, 16];
const ADVISOR_DELTA = [-17, -15, 15, 17];
const KNIGHT_DELTA = [[-33, -31], [-18, 14], [-14, 18], [31, 33]];
const KNIGHT_CHECK_DELTA = [[-33, -18], [-31, -14], [14, 31], [18, 33]];
const MVV_VALUE = [50, 10, 10, 30, 40, 30, 20, 0];

const PIECE_VALUE = [
  new Uint16Array([
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  9,  9,  9, 11, 13, 11,  9,  9,  9,  0,  0,  0,  0,
    0,  0,  0, 19, 24, 34, 42, 44, 42, 34, 24, 19,  0,  0,  0,  0,
    0,  0,  0, 19, 24, 32, 37, 37, 37, 32, 24, 19,  0,  0,  0,  0,
    0,  0,  0, 19, 23, 27, 29, 30, 29, 27, 23, 19,  0,  0,  0,  0,
    0,  0,  0, 14, 18, 20, 27, 29, 27, 20, 18, 14,  0,  0,  0,  0,
    0,  0,  0,  7,  0, 13,  0, 16,  0, 13,  0,  7,  0,  0,  0,  0,
    0,  0,  0,  7,  0,  7,  0, 15,  0,  7,  0,  7,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0, 11, 15, 11,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  ]), new Uint16Array([
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0, 20,  0,  0,  0, 20,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0, 18,  0,  0, 20, 23, 20,  0,  0, 18,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0, 23,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0, 20, 20,  0, 20, 20,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  ]), new Uint16Array([
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0, 20,  0,  0,  0, 20,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0, 18,  0,  0, 20, 23, 20,  0,  0, 18,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0, 23,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0, 20, 20,  0, 20, 20,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  ]), new Uint16Array([
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0, 90, 90, 90, 96, 90, 96, 90, 90, 90,  0,  0,  0,  0,
    0,  0,  0, 90, 96,103, 97, 94, 97,103, 96, 90,  0,  0,  0,  0,
    0,  0,  0, 92, 98, 99,103, 99,103, 99, 98, 92,  0,  0,  0,  0,
    0,  0,  0, 93,108,100,107,100,107,100,108, 93,  0,  0,  0,  0,
    0,  0,  0, 90,100, 99,103,104,103, 99,100, 90,  0,  0,  0,  0,
    0,  0,  0, 90, 98,101,102,103,102,101, 98, 90,  0,  0,  0,  0,
    0,  0,  0, 92, 94, 98, 95, 98, 95, 98, 94, 92,  0,  0,  0,  0,
    0,  0,  0, 93, 92, 94, 95, 92, 95, 94, 92, 93,  0,  0,  0,  0,
    0,  0,  0, 85, 90, 92, 93, 78, 93, 92, 90, 85,  0,  0,  0,  0,
    0,  0,  0, 88, 85, 90, 88, 90, 88, 90, 85, 88,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  ]), new Uint16Array([
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,206,208,207,213,214,213,207,208,206,  0,  0,  0,  0,
    0,  0,  0,206,212,209,216,233,216,209,212,206,  0,  0,  0,  0,
    0,  0,  0,206,208,207,214,216,214,207,208,206,  0,  0,  0,  0,
    0,  0,  0,206,213,213,216,216,216,213,213,206,  0,  0,  0,  0,
    0,  0,  0,208,211,211,214,215,214,211,211,208,  0,  0,  0,  0,
    0,  0,  0,208,212,212,214,215,214,212,212,208,  0,  0,  0,  0,
    0,  0,  0,204,209,204,212,214,212,204,209,204,  0,  0,  0,  0,
    0,  0,  0,198,208,204,212,212,212,204,208,198,  0,  0,  0,  0,
    0,  0,  0,200,208,206,212,200,212,206,208,200,  0,  0,  0,  0,
    0,  0,  0,194,206,204,212,200,212,204,206,194,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  ]), new Uint16Array([
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,100,100, 96, 91, 90, 91, 96,100,100,  0,  0,  0,  0,
    0,  0,  0, 98, 98, 96, 92, 89, 92, 96, 98, 98,  0,  0,  0,  0,
    0,  0,  0, 97, 97, 96, 91, 92, 91, 96, 97, 97,  0,  0,  0,  0,
    0,  0,  0, 96, 99, 99, 98,100, 98, 99, 99, 96,  0,  0,  0,  0,
    0,  0,  0, 96, 96, 96, 96,100, 96, 96, 96, 96,  0,  0,  0,  0,
    0,  0,  0, 95, 96, 99, 96,100, 96, 99, 96, 95,  0,  0,  0,  0,
    0,  0,  0, 96, 96, 96, 96, 96, 96, 96, 96, 96,  0,  0,  0,  0,
    0,  0,  0, 97, 96,100, 99,101, 99,100, 96, 97,  0,  0,  0,  0,
    0,  0,  0, 96, 97, 98, 98, 98, 98, 98, 97, 96,  0,  0,  0,  0,
    0,  0,  0, 96, 96, 97, 99, 99, 99, 97, 96, 96,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  ]), new Uint16Array([
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  9,  9,  9, 11, 13, 11,  9,  9,  9,  0,  0,  0,  0,
    0,  0,  0, 19, 24, 34, 42, 44, 42, 34, 24, 19,  0,  0,  0,  0,
    0,  0,  0, 19, 24, 32, 37, 37, 37, 32, 24, 19,  0,  0,  0,  0,
    0,  0,  0, 19, 23, 27, 29, 30, 29, 27, 23, 19,  0,  0,  0,  0,
    0,  0,  0, 14, 18, 20, 27, 29, 27, 20, 18, 14,  0,  0,  0,  0,
    0,  0,  0,  7,  0, 13,  0, 16,  0, 13,  0,  7,  0,  0,  0,  0,
    0,  0,  0,  7,  0,  7,  0, 15,  0,  7,  0,  7,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0, 11, 15, 11,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  ])
];
function IN_BOARD(sq) {
    return IN_BOARD_[sq];
  }
  
  function IN_FORT(sq) {
    return IN_FORT_[sq];
  }
  
  function RANK_Y(sq) {
    return sq >> 4;
  }
  
  function FILE_X(sq) {
    return sq & 15;
  }
  
  function COORD_XY(x, y) {
    return x + (y << 4);
  }
  
  function SQUARE_FLIP(sq) {
    return 254 - sq;
  }
  
  function FILE_FLIP(x) {
    return 14 - x;
  }
  
  function RANK_FLIP(y) {
    return 15 - y;
  }
  
  function MIRROR_SQUARE(sq) {
    return COORD_XY(FILE_FLIP(FILE_X(sq)), RANK_Y(sq));
  }
  
  function SQUARE_FORWARD(sq, sd) {
    return sq - 16 + (sd << 5);
  }
  
  function KING_SPAN(sqSrc, sqDst) {
    return LEGAL_SPAN[sqDst - sqSrc + 256] === 1;
  }
  
  function ADVISOR_SPAN(sqSrc, sqDst) {
    return LEGAL_SPAN[sqDst - sqSrc + 256] === 2;
  }
  
  function BISHOP_SPAN(sqSrc, sqDst) {
    return LEGAL_SPAN[sqDst - sqSrc + 256] === 3;
  }
  
  function BISHOP_PIN(sqSrc, sqDst) {
    return (sqSrc + sqDst) >> 1;
  }
  
  function KNIGHT_PIN(sqSrc, sqDst) {
    return sqSrc + KNIGHT_PIN_[sqDst - sqSrc + 256];
  }
  
  function HOME_HALF(sq, sd) {
    return (sq & 0x80) !== (sd << 7);
  }
  
  function AWAY_HALF(sq, sd) {
    return (sq & 0x80) === (sd << 7);
  }
  
  function SAME_HALF(sqSrc, sqDst) {
    return ((sqSrc ^ sqDst) & 0x80) === 0;
  }
  
  function SAME_RANK(sqSrc, sqDst) {
    return ((sqSrc ^ sqDst) & 0xf0) === 0;
  }
  
  function SAME_FILE(sqSrc, sqDst) {
    return ((sqSrc ^ sqDst) & 0x0f) === 0;
  }
  
  function SIDE_TAG(sd) {
    return 8 + (sd << 3);
  }
  
  function OPP_SIDE_TAG(sd) {
    return 16 - (sd << 3);
  }
  
  function SRC(mv) {
    return mv & 255;
  }
  
  function DST(mv) {
    return mv >> 8;
  }
  
  function MOVE(sqSrc, sqDst) {
    return sqSrc + (sqDst << 8);
  }
  
  function MIRROR_MOVE(mv) {
    return MOVE(MIRROR_SQUARE(SRC(mv)), MIRROR_SQUARE(DST(mv)));
  }
  
  function MVV_LVA(pc, lva) {
    return MVV_VALUE[pc & 7] - lva;
  }
  
  function CHR(n) {
    return String.fromCharCode(n);
  }
  
  function ASC(c) {
    return c.charCodeAt(0);
  }
  
  const FEN_PIECE = "        KABNRCP kabnrcp ";
  
  function CHAR_TO_PIECE(c) {
    switch (c) {
    case "K":
      return PIECE_KING;
    case "A":
      return PIECE_ADVISOR;
    case "B":
    case "E":
      return PIECE_BISHOP;
    case "H":
    case "N":
      return PIECE_KNIGHT;
    case "R":
      return PIECE_ROOK;
    case "C":
      return PIECE_CANNON;
    case "P":
      return PIECE_PAWN;
    default:
      return -1;
    }
  }
  
  function RC4(key) {
    this.x = this.y = 0;
    this.state = [];
    for (let i = 0; i < 256; ++i) {
      this.state.push(i);
    }
    let j = 0;
    for (let i = 0; i < 256; ++i) {
      j = (j + this.state[i] + key[i % key.length]) & 0xff;
      this.swap(i, j);
    }
  }
  
  RC4.prototype.swap = function(i, j) {
    let t = this.state[i];
    this.state[i] = this.state[j];
    this.state[j] = t;
  }
  
  RC4.prototype.nextByte = function() {
    this.x = (this.x + 1) & 0xff;
    this.y = (this.y + this.state[this.x]) & 0xff;
    this.swap(this.x, this.y);
    let t = (this.state[this.x] + this.state[this.y]) & 0xff;
    return this.state[t];
  }
  
  RC4.prototype.nextLong = function() {
    let n0 = this.nextByte();
    let n1 = this.nextByte();
    let n2 = this.nextByte();
    let n3 = this.nextByte();
    return n0 + (n1 << 8) + (n2 << 16) + ((n3 << 24) & 0xffffffff);
  }
  
  let rc4 = new RC4([0]);
  
  const PreGen_zobristKeyPlayer = rc4.nextLong();
  rc4.nextLong();
  const PreGen_zobristLockPlayer = rc4.nextLong();
  
  const PreGen_zobristKeyTable = [], PreGen_zobristLockTable = [];
  for (let i = 0; i < 14; ++i) {
    let keys = new Int32Array(256);
    let locks = new Int32Array(256);
    for (let j = 0; j < 256; ++j) {
      keys[j] = rc4.nextLong();
      rc4.nextLong();
      locks[j] = rc4.nextLong();
    }
    PreGen_zobristKeyTable.push(keys);
    PreGen_zobristLockTable.push(locks);
  }
  
  function Position() {
    // sdPlayer, zobristKey, zobristLock, vlWhite, vlBlack, distance;
    // squares, mvList, pcList, keyList, chkList;
  }
  
  Position.prototype.clearBoard = function() {
    this.sdPlayer = 0;
    this.squares = [];
    for (let sq = 0; sq < 256; ++sq) {
      this.squares.push(0);
    }
    this.zobristKey = this.zobristLock = 0;
    this.vlWhite = this.vlBlack = 0;
  };
  
  Position.prototype.setIrrev = function() {
    this.mvList = [0];
    this.pcList = [0];
    this.keyList = [0];
    this.chkList = [this.checked()];
    this.distance = 0;
  }
  
  Position.prototype.addPiece = function(sq, pc, bDel) {
    let pcAdjust;
    this.squares[sq] = bDel ? 0 : pc;
    if (pc < 16) {
      pcAdjust = pc - 8;
      this.vlWhite += bDel ? -PIECE_VALUE[pcAdjust][sq] :
          PIECE_VALUE[pcAdjust][sq];
    } else {
      pcAdjust = pc - 16;
      this.vlBlack += bDel ? -PIECE_VALUE[pcAdjust][SQUARE_FLIP(sq)] :
          PIECE_VALUE[pcAdjust][SQUARE_FLIP(sq)];
      pcAdjust += 7;
    }
    this.zobristKey ^= PreGen_zobristKeyTable[pcAdjust][sq];
    this.zobristLock ^= PreGen_zobristLockTable[pcAdjust][sq];
  }
  
  Position.prototype.movePiece = function(mv) {
    let sqSrc = SRC(mv);
    let sqDst = DST(mv);
    let pc = this.squares[sqDst];
    this.pcList.push(pc);
    if (pc > 0) {
      this.addPiece(sqDst, pc, DEL_PIECE);
    }
    pc = this.squares[sqSrc];
    this.addPiece(sqSrc, pc, DEL_PIECE);
    this.addPiece(sqDst, pc, ADD_PIECE);
    this.mvList.push(mv);
  }
  
  Position.prototype.undoMovePiece = function() {
    let mv = this.mvList.pop();
    let sqSrc = SRC(mv);
    let sqDst = DST(mv);
    let pc = this.squares[sqDst];
    this.addPiece(sqDst, pc, DEL_PIECE);
    this.addPiece(sqSrc, pc, ADD_PIECE);
    pc = this.pcList.pop();
    if (pc > 0) {
      this.addPiece(sqDst, pc, ADD_PIECE);
    }
  }
  
  Position.prototype.changeSide = function() {
    this.sdPlayer = 1 - this.sdPlayer;
    this.zobristKey ^= PreGen_zobristKeyPlayer;
    this.zobristLock ^= PreGen_zobristLockPlayer;
  }
  
  Position.prototype.makeMove = function(mv) {
    let zobristKey = this.zobristKey;
    this.movePiece(mv);
    if (this.checked()) {
      this.undoMovePiece(mv);
      return false;
    }
    this.keyList.push(zobristKey);
    this.changeSide();
    this.chkList.push(this.checked());
    ++this.distance;
    return true;
  }
  
  Position.prototype.undoMakeMove = function() {
    this.distance --;
    this.chkList.pop();
    this.changeSide();
    this.keyList.pop();
    this.undoMovePiece();
  }
  
  Position.prototype.nullMove = function() {
    this.mvList.push(0);
    this.pcList.push(0);
    this.keyList.push(this.zobristKey);
    this.changeSide();
    this.chkList.push(false);
    ++this.distance;
  }
  
  Position.prototype.undoNullMove = function() {
    this.distance --;
    this.chkList.pop();
    this.changeSide();
    this.keyList.pop();
    this.pcList.pop();
    this.mvList.pop();
  }
  
  Position.prototype.fromFen = function(fen) {
    this.clearBoard();
    let y = RANK_TOP;
    let x = FILE_LEFT;
    let index = 0;
    if (!fen.length) {
      this.setIrrev();
      return;
    }
    let c = fen.charAt(index);
    while (c !== " ") {
      if (c === "/") {
        x = FILE_LEFT;
        ++y;
        if (y > RANK_BOTTOM) {
          break;
        }
      } else if (c >= "1" && c <= "9") {
        x += (ASC(c) - ASC("0"));
      } else if (c >= "A" && c <= "Z") {
        if (x <= FILE_RIGHT) {
          let pt = CHAR_TO_PIECE(c);
          if (pt >= 0) {
            this.addPiece(COORD_XY(x, y), pt + 8);
          }
          ++x;
        }
      } else if (c >= "a" && c <= "z") {
        if (x <= FILE_RIGHT) {
          let pt = CHAR_TO_PIECE(CHR(ASC(c) + ASC("A") - ASC("a")));
          if (pt >= 0) {
            this.addPiece(COORD_XY(x, y), pt + 16);
          }
          ++x;
        }
      }
      ++index;
      if (index === fen.length) {
        this.setIrrev();
        return;
      }
      c = fen.charAt(index);
    }
    ++index;
    if (index === fen.length) {
      this.setIrrev();
      return;
    }
    if (this.sdPlayer === (fen.charAt(index) === "b" ? 0 : 1)) {
      this.changeSide();
    }
    this.setIrrev();
  }
  
  Position.prototype.toFen = function() {
    let fen = "";
    for (let y = RANK_TOP; y <= RANK_BOTTOM; ++y) {
      let k = 0;
      for (let x = FILE_LEFT; x <= FILE_RIGHT; ++x) {
        let pc = this.squares[COORD_XY(x, y)];
        if (pc > 0) {
          if (k > 0) {
            fen += CHR(ASC("0") + k);
            k = 0;
          }
          fen += FEN_PIECE.charAt(pc);
        } else {
          ++k;
        }
      }
      if (k > 0) {
        fen += CHR(ASC("0") + k);
      }
      fen += "/";
    }
    return fen.substring(0, fen.length - 1) +
        (this.sdPlayer === 0 ? " w" : " b");
  }
  
  Position.prototype.generateMoves = function(vls) {
    let mvs = [];
    let pcSelfSide = SIDE_TAG(this.sdPlayer);
    let pcOppSide = OPP_SIDE_TAG(this.sdPlayer);
    for (let sqSrc = 0; sqSrc < 256; ++sqSrc) {
      let pcSrc = this.squares[sqSrc];
      if ((pcSrc & pcSelfSide) === 0) {
        continue;
      }
      switch (pcSrc - pcSelfSide) {
      case PIECE_KING:
        for (let i = 0; i < 4; ++i) {
          let sqDst = sqSrc + KING_DELTA[i];
          if (!IN_FORT(sqDst)) {
            continue;
          }
          let pcDst = this.squares[sqDst];
          if (vls === null) {
            if ((pcDst & pcSelfSide) === 0) {
              mvs.push(MOVE(sqSrc, sqDst));
            }
          } else if ((pcDst & pcOppSide) !== 0) {
            mvs.push(MOVE(sqSrc, sqDst));
            vls.push(MVV_LVA(pcDst, 5));
          }
        }
        break;
      case PIECE_ADVISOR:
        for (let i = 0; i < 4; ++i) {
          let sqDst = sqSrc + ADVISOR_DELTA[i];
          if (!IN_FORT(sqDst)) {
            continue;
          }
          let pcDst = this.squares[sqDst];
          if (vls === null) {
            if ((pcDst & pcSelfSide) === 0) {
              mvs.push(MOVE(sqSrc, sqDst));
            }
          } else if ((pcDst & pcOppSide) !== 0) {
            mvs.push(MOVE(sqSrc, sqDst));
            vls.push(MVV_LVA(pcDst, 1));
          }
        }
        break;
      case PIECE_BISHOP:
        for (let i = 0; i < 4; ++i) {
          let sqDst = sqSrc + ADVISOR_DELTA[i];
          if (!(IN_BOARD(sqDst) && HOME_HALF(sqDst, this.sdPlayer) &&
              this.squares[sqDst] === 0)) {
            continue;
          }
          sqDst += ADVISOR_DELTA[i];
          let pcDst = this.squares[sqDst];
          if (vls === null) {
            if ((pcDst & pcSelfSide) === 0) {
              mvs.push(MOVE(sqSrc, sqDst));
            }
          } else if ((pcDst & pcOppSide) !== 0) {
            mvs.push(MOVE(sqSrc, sqDst));
            vls.push(MVV_LVA(pcDst, 1));
          }
        }
        break;
      case PIECE_KNIGHT:
        for (let i = 0; i < 4; ++i) {
          let sqDst = sqSrc + KING_DELTA[i];
          if (this.squares[sqDst] > 0) {
            continue;
          }
          for (let j = 0; j < 2; ++j) {
            sqDst = sqSrc + KNIGHT_DELTA[i][j];
            if (!IN_BOARD(sqDst)) {
              continue;
            }
            let pcDst = this.squares[sqDst];
            if (vls === null) {
              if ((pcDst & pcSelfSide) === 0) {
                mvs.push(MOVE(sqSrc, sqDst));
              }
            } else if ((pcDst & pcOppSide) !== 0) {
              mvs.push(MOVE(sqSrc, sqDst));
              vls.push(MVV_LVA(pcDst, 1));
            }
          }
        }
        break;
      case PIECE_ROOK:
        for (let i = 0; i < 4; ++i) {
          let delta = KING_DELTA[i];
          let sqDst = sqSrc + delta;
          while (IN_BOARD(sqDst)) {
            let pcDst = this.squares[sqDst];
            if (pcDst === 0) {
              if (vls === null) {
                mvs.push(MOVE(sqSrc, sqDst));
              }
            } else {
              if ((pcDst & pcOppSide) !== 0) {
                mvs.push(MOVE(sqSrc, sqDst));
                if (vls !== null) {
                  vls.push(MVV_LVA(pcDst, 4));
                }
              }
              break;
            }
            sqDst += delta;
          }
        }
        break;
      case PIECE_CANNON:
        for (let i = 0; i < 4; ++i) {
          let delta = KING_DELTA[i];
          let sqDst = sqSrc + delta;
          while (IN_BOARD(sqDst)) {
            let pcDst = this.squares[sqDst];
            if (pcDst === 0) {
              if (vls === null) {
                mvs.push(MOVE(sqSrc, sqDst));
              }
            } else {
              break;
            }
            sqDst += delta;
          }
          sqDst += delta;
          while (IN_BOARD(sqDst)) {
            let pcDst = this.squares[sqDst];
            if (pcDst > 0) {
              if ((pcDst & pcOppSide) !== 0) {
                mvs.push(MOVE(sqSrc, sqDst));
                if (vls !== null) {
                  vls.push(MVV_LVA(pcDst, 4));
                }
              }
              break;
            }
            sqDst += delta;
          }
        }
        break;
      case PIECE_PAWN:
        let sqDst = SQUARE_FORWARD(sqSrc, this.sdPlayer);
        if (IN_BOARD(sqDst)) {
          let pcDst = this.squares[sqDst];
          if (vls === null) {
            if ((pcDst & pcSelfSide) === 0) {
              mvs.push(MOVE(sqSrc, sqDst));
            }
          } else if ((pcDst & pcOppSide) !== 0) {
            mvs.push(MOVE(sqSrc, sqDst));
            vls.push(MVV_LVA(pcDst, 2));
          }
        }
        if (AWAY_HALF(sqSrc, this.sdPlayer)) {
          for (let delta = -1; delta <= 1; delta += 2) {
            sqDst = sqSrc + delta;
            if (IN_BOARD(sqDst)) {
              let pcDst = this.squares[sqDst];
              if (vls === null) {
                if ((pcDst & pcSelfSide) === 0) {
                  mvs.push(MOVE(sqSrc, sqDst));
                }
              } else if ((pcDst & pcOppSide) !== 0) {
                mvs.push(MOVE(sqSrc, sqDst));
                vls.push(MVV_LVA(pcDst, 2));
              }
            }
          }
        }
        break;
      }
    }
    return mvs;
  }
  
  Position.prototype.legalMove = function(mv) {
    let sqSrc = SRC(mv);
    let pcSrc = this.squares[sqSrc];
    let pcSelfSide = SIDE_TAG(this.sdPlayer);
    if ((pcSrc & pcSelfSide) === 0) {
      return false;
    }
  
    let sqDst = DST(mv);
    let pcDst = this.squares[sqDst];
    if ((pcDst & pcSelfSide) !== 0) {
      return false;
    }
  
    let sqPin;
    switch (pcSrc - pcSelfSide) {
    case PIECE_KING:
      return IN_FORT(sqDst) && KING_SPAN(sqSrc, sqDst);
    case PIECE_ADVISOR:
      return IN_FORT(sqDst) && ADVISOR_SPAN(sqSrc, sqDst);
    case PIECE_BISHOP:
      return SAME_HALF(sqSrc, sqDst) && BISHOP_SPAN(sqSrc, sqDst) &&
          this.squares[BISHOP_PIN(sqSrc, sqDst)] === 0;
    case PIECE_KNIGHT:
      sqPin = KNIGHT_PIN(sqSrc, sqDst);
      return sqPin !== sqSrc && this.squares[sqPin] === 0;
    case PIECE_ROOK:
    case PIECE_CANNON:
      let delta;
      if (SAME_RANK(sqSrc, sqDst)) {
        delta = (sqDst < sqSrc ? -1 : 1);
      } else if (SAME_FILE(sqSrc, sqDst)) {
        delta = (sqDst < sqSrc ? -16 : 16);
      } else {
        return false;
      }
      sqPin = sqSrc + delta;
      while (sqPin !== sqDst && this.squares[sqPin] === 0) {
        sqPin += delta;
      }
      if (sqPin === sqDst) {
        return pcDst === 0 || pcSrc - pcSelfSide === PIECE_ROOK;
      }
      if (pcDst === 0 || pcSrc - pcSelfSide !== PIECE_CANNON) {
        return false;
      }
      sqPin += delta;
      while (sqPin !== sqDst && this.squares[sqPin] === 0) {
        sqPin += delta;
      }
      return sqPin === sqDst;
    case PIECE_PAWN:
      if (AWAY_HALF(sqDst, this.sdPlayer) && (sqDst === sqSrc - 1 || sqDst === sqSrc + 1)) {
        return true;
      }
      return sqDst === SQUARE_FORWARD(sqSrc, this.sdPlayer);
    default:
      return false;
    }
  }
  
  Position.prototype.checked = function() {
    let pcSelfSide = SIDE_TAG(this.sdPlayer);
    let pcOppSide = OPP_SIDE_TAG(this.sdPlayer);
    for (let sqSrc = 0; sqSrc < 256; ++sqSrc) {
      if (this.squares[sqSrc] !== pcSelfSide + PIECE_KING) {
        continue;
      }
      if (this.squares[SQUARE_FORWARD(sqSrc, this.sdPlayer)] === pcOppSide + PIECE_PAWN) {
        return true;
      }
      for (let delta = -1; delta <= 1; delta += 2) {
        if (this.squares[sqSrc + delta] === pcOppSide + PIECE_PAWN) {
          return true;
        }
      }
      for (let i = 0; i < 4; ++i) {
        if (this.squares[sqSrc + ADVISOR_DELTA[i]] !== 0) {
          continue;
        }
        for (let j = 0; j < 2; j ++) {
          let pcDst = this.squares[sqSrc + KNIGHT_CHECK_DELTA[i][j]];
          if (pcDst === pcOppSide + PIECE_KNIGHT) {
            return true;
          }
        }
      }
      for (let i = 0; i < 4; ++i) {
        let delta = KING_DELTA[i];
        let sqDst = sqSrc + delta;
        while (IN_BOARD(sqDst)) {
          let pcDst = this.squares[sqDst];
          if (pcDst > 0) {
            if (pcDst === pcOppSide + PIECE_ROOK || pcDst === pcOppSide + PIECE_KING) {
              return true;
            }
            break;
          }
          sqDst += delta;
        }
        sqDst += delta;
        while (IN_BOARD(sqDst)) {
          let pcDst = this.squares[sqDst];
          if (pcDst > 0) {
            if (pcDst === pcOppSide + PIECE_CANNON) {
              return true;
            }
            break;
          }
          sqDst += delta;
        }
      }
      return false;
    }
    return false;
  }
  
  Position.prototype.isMate = function() {
    let mvs = this.generateMoves(null);
    for (let i = 0; i < mvs.length; ++i) {
      if (this.makeMove(mvs[i])) {
        this.undoMakeMove();
        return false;
      }
    }
    return true;
  }
  
  Position.prototype.mateValue = function() {
    return this.distance - MATE_VALUE;
  }
  
  Position.prototype.banValue = function() {
    return this.distance - BAN_VALUE;
  }
  
  Position.prototype.drawValue = function() {
    return (this.distance & 1) === 0 ? -DRAW_VALUE : DRAW_VALUE;
  }
  
  Position.prototype.evaluate = function() {
    let vl = (this.sdPlayer === 0 ? this.vlWhite - this.vlBlack :
        this.vlBlack - this.vlWhite) + ADVANCED_VALUE;
    return vl === this.drawValue() ? vl - 1 : vl;
  }
  
  Position.prototype.nullOkay = function() {
    return (this.sdPlayer === 0 ? this.vlWhite : this.vlBlack) > NULL_OKAY_MARGIN;
  }
  
  Position.prototype.nullSafe = function() {
    return (this.sdPlayer === 0 ? this.vlWhite : this.vlBlack) > NULL_SAFE_MARGIN;
  }
  
  Position.prototype.inCheck = function() {
    return this.chkList[this.chkList.length - 1];
  }
  
  Position.prototype.captured = function() {
    return this.pcList[this.pcList.length - 1] > 0;
  }
  
  Position.prototype.repValue = function(vlRep) {
    let vlReturn = ((vlRep & 2) === 0 ? 0 : this.banValue()) +
        ((vlRep & 4) === 0 ? 0 : -this.banValue());
    return vlReturn === 0 ? this.drawValue() : vlReturn;
  }
  
  Position.prototype.repStatus = function(recur_) {
    let recur = recur_;
    let selfSide = false;
    let perpCheck = true;
    let oppPerpCheck = true;
    let index = this.mvList.length - 1;
    while (this.mvList[index] > 0 && this.pcList[index] === 0) {
      if (selfSide) {
        perpCheck = perpCheck && this.chkList[index];
        if (this.keyList[index] === this.zobristKey) {
          recur --;
          if (recur === 0) {
            return 1 + (perpCheck ? 2 : 0) + (oppPerpCheck ? 4 : 0);
          }
        }
      } else {
        oppPerpCheck = oppPerpCheck && this.chkList[index];
      }
      selfSide = !selfSide;
      index --;
    }
    return 0;
  }
  
  Position.prototype.mirror = function() {
    let pos = new Position();
    pos.clearBoard();
    for (let sq = 0; sq < 256; ++sq) {
      let pc = this.squares[sq];
      if (pc > 0) {
        pos.addPiece(MIRROR_SQUARE(sq), pc);
      }
    }
    if (this.sdPlayer === 1) {
      pos.changeSide();
    }
    return pos;
  }
  
  Position.prototype.bookMove = function() {
    if (typeof book_dat !== "function" || !DAT_LEN) {
      return 0;
    }
    let mirror = false;
    let lock = this.zobristLock >>> 1; // Convert into Unsigned
    let index = binarySearch(book_dat, lock);
    if (index < 0) {
      mirror = true;
      lock = this.mirror().zobristLock >>> 1; // Convert into Unsigned
      index = binarySearch(book_dat, lock);
    }
    if (index < 0) {
      return 0;
    }
    index --;
    while (index >= 0 && book_dat(index, 0) === lock) {
      index --;
    }
    let mvs = [], vls = [];
    let value = 0;
    ++index;
    while (index < DAT_LEN && book_dat(index, 0) === lock) {
      let mv = book_dat(index, 1);
      mv = (mirror ? MIRROR_MOVE(mv) : mv);
      if (this.legalMove(mv)) {
        mvs.push(mv);
        let vl = book_dat(index, 2);
        vls.push(vl);
        value += vl;
      }
      ++index;
    }
    if (value === 0) {
      return 0;
    }
    value = Math.floor(Math.random() * value);
    for (index = 0; index < mvs.length; ++index) {
      value -= vls[index];
      if (value < 0) {
        break;
      }
    }
    return mvs[index];
  }
  
  Position.prototype.historyIndex = function(mv) {
    return ((this.squares[SRC(mv)] - 8) << 8) + DST(mv);
  }
  