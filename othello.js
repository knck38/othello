
/***********************************
 * 定数
 ***********************************/
//マスの状態
const SQUARE_STATUS_IS_OWNED = "01"; //自分が所有している
const SQUARE_STATUS_IS_OTHER = "02"; //相手が所有している
const SQUARE_STATUS_NOT_SELECTED = "09"; //選択されていない


/***********************************
 * 変数
 ***********************************/
//ターンを示す変数
let isOddturn = true;


/***********************************
 * イベント
 ***********************************/
document.addEventListener("DOMContentLoaded", () => {

	createBoard();

	const squares = document.querySelectorAll(".square");
	squares.forEach(square => {
		square.addEventListener("click", clickSquareEvent);
	});

	const button = document.getElementById("button");
	button.addEventListener("click", initializeEvent);

	initializeEvent();

	showTurn();

});


//ボード生成
const createBoard = () => {
	const board = document.getElementById("board");

	for (let row = 0; row < 8; row++) {
		const boardRow = document.createElement("div");
		boardRow.classList.add("board-row");

		for (let col = 0; col < 8; col++) {
			const square = document.createElement("button");
			square.type = "button";
			square.classList.add("square");
			square.setAttribute("data-row", row);
			square.setAttribute("data-col", col);

			boardRow.appendChild(square);

		}

		board.appendChild(boardRow);

	}
}


//ターン表示
const showTurn = () => {
	const turnElm = document.getElementById("turn");

	if (getTurnString() == "black") {
		turnElm.textContent = "黒の番です";
	} else {
		turnElm.textContent = "白の番です";
	}
}


function clickSquareEvent() {

	if (!canSelect(this)) {
		return;
	}

	changeOwner(this);
}


//初期設定（4箇所にピースを配置）
const initializeEvent = () => {

	//リセット
	const squares = document.querySelectorAll(".square");
	squares.forEach(square => {
		square.classList.remove("selected");
		square.removeAttribute("data-owner");
	});

	isOddturn = true;

	changeOwner(getTargetSquare(3, 4));
	changeOwner(getTargetSquare(3, 3));
	changeOwner(getTargetSquare(4, 3));
	changeOwner(getTargetSquare(4, 4));
}


//マス目のオーナーを変更
const changeOwner = (square) => {
	putPiece(square, getTurnString());
	changeOwnerOpposite(square);
	changeTurn();
}


//マス目にピースを置く
const putPiece = (square, owner) => {
	square.setAttribute("data-owner", owner);
	square.classList.add("selected");
}

//ターン文字列
const getTurnString = () => {
	if (isOddturn) {
		return "black";
	}
	return "white";
}


//ターンを変更
const changeTurn = () => {
	isOddturn = !isOddturn;

	const squares = document.querySelectorAll(".square");
	squares.forEach(square => {
		square.classList.toggle("can-select", canSelect(square));
		square.classList.toggle("cant-select", !canSelect(square));
	});

	showTurn();
}


//指定位置のマス目オブジェクトを取得
const getTargetSquare = (row, col) => {
	return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

//選択されているか判定
const canSelect = (square) => {
	if (square.classList.contains("selected")) {
		return false;
	}

	const row = parseInt(square.getAttribute("data-row"));
	const col = parseInt(square.getAttribute("data-col"));

	const checkFunctions = [
		getPosOppositeUpper,
		getPosOppositeLower,
		getPosOppositeLeft,
		getPosOppositeRight,
		getPosOppositeUpperLeft,
		getPosOppositeUpperRight,
		getPosOppositeLowerLeft,
		getPosOppositeLowerRight,
	];

	for (const fn of checkFunctions) {
		if (fn(row, col) !== null) {
			return true;
		}
	}

	return false;
}


//所有者を変更
const changeOwnerOpposite = (square) => {
	const row = parseInt(square.getAttribute("data-row"));
	const col = parseInt(square.getAttribute("data-col"));

	changeOwnerOppositeUpper(row, col);
	changeOwnerOppositeLower(row, col);
	changeOwnerOppositeLeft(row, col);
	changeOwnerOppositeRight(row, col);
	changeOwnerOppositeUpperLeft(row, col);
	changeOwnerOppositeUpperRight(row, col);
	changeOwnerOppositeLowerLeft(row, col);
	changeOwnerOppositeLowerRight(row, col);
}


//所有者を変更（下）
const changeOwnerOppositeLower = (row, col) => {
	let endPos = getPosOppositeLower(row, col);

	if (endPos == null) {
		return;
	}

	for (let targetRow = row + 1; targetRow < endPos.row; targetRow++) {
		let square = getTargetSquare(targetRow, col);
		putPiece(square, getTurnString());
	}
}

//対向の所有マスの位置を確認
const getPosOppositeLower = (row, col) => {
	if (row == 7) {
		return null;
	}

	let targetRow = row + 1;
	let targetCol = col;

	if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
		return null;
	}

	for (targetRow++; targetRow <= 7; targetRow++) {
		let status = getSquareStatus(targetRow, targetCol);

		if (status == SQUARE_STATUS_NOT_SELECTED) {
			return null;
		}

		if (status == SQUARE_STATUS_IS_OWNED) {
			return {
				row: targetRow,
				col: targetCol,
			};
		}
	}

	return null;
}


//所有者を変更（上）
const changeOwnerOppositeUpper = (row, col) => {
	let endPos = getPosOppositeUpper(row, col);

	if (endPos == null) {
		return;
	}

	let targetCol = col;
	for (let targetRow = row - 1; endPos.row < targetRow; targetRow--) {
		let square = getTargetSquare(targetRow, targetCol);
		putPiece(square, getTurnString());
	}
}

//対向の所有マスの位置を確認（上）
const getPosOppositeUpper = (row, col) => {
	if (row == 0) {
		return null;
	}

	let targetRow = row - 1;
	let targetCol = col;

	if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
		return null;
	}

	for (targetRow--; 0 <= targetRow; targetRow--) {
		let status = getSquareStatus(targetRow, targetCol);

		if (status == SQUARE_STATUS_NOT_SELECTED) {
			return null;
		}

		if (status == SQUARE_STATUS_IS_OWNED) {
			return {
				row: targetRow,
				col: targetCol,
			};
		}
	}

	return null;
}


//所有者を変更（左）
const changeOwnerOppositeLeft = (row, col) => {
	let endPos = getPosOppositeLeft(row, col);

	if (endPos == null) {
		return;
	}

	let targetRow = row;
	let targetCol = col - 1;
	for (targetCol; endPos.col < targetCol; targetCol--) {
		let square = getTargetSquare(targetRow, targetCol);
		putPiece(square, getTurnString());
	}
}

//対向の所有マスの位置を確認（左）
const getPosOppositeLeft = (row, col) => {
	if (col == 0) {
		return null;
	}

	let targetRow = row;
	let targetCol = col - 1;

	if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
		return null;
	}

	for (targetCol--; 0 <= targetCol; targetCol--) {
		let status = getSquareStatus(targetRow, targetCol);

		if (status == SQUARE_STATUS_NOT_SELECTED) {
			return null;
		}

		if (status == SQUARE_STATUS_IS_OWNED) {
			return {
				row: targetRow,
				col: targetCol,
			};
		}
	}

	return null;
}


//所有者を変更（右）
const changeOwnerOppositeRight = (row, col) => {
	let endPos = getPosOppositeRight(row, col);

	if (endPos == null) {
		return;
	}

	let targetRow = row;
	let targetCol = col + 1;
	for (targetCol; targetCol < endPos.col; targetCol++) {
		let square = getTargetSquare(targetRow, targetCol);
		putPiece(square, getTurnString());
	}
}

//対向の所有マスの位置を確認（右）
const getPosOppositeRight = (row, col) => {
	if (col == 7) {
		return null;
	}

	let targetRow = row;
	let targetCol = col + 1;

	if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
		return null;
	}

	for (targetCol++; targetCol <= 7; targetCol++) {
		let status = getSquareStatus(targetRow, targetCol);

		if (status == SQUARE_STATUS_NOT_SELECTED) {
			return null;
		}

		if (status == SQUARE_STATUS_IS_OWNED) {
			return {
				row: targetRow,
				col: targetCol,
			};
		}
	}

	return null;
}


//所有者を変更（左上）
const changeOwnerOppositeUpperLeft = (row, col) => {
	let endPos = getPosOppositeUpperLeft(row, col);

	if (endPos == null) {
		return;
	}

	for (let targetRow = row - 1, targetCol = col - 1; endPos.row < targetRow, endPos.col < targetCol; targetRow--, targetCol--) {
		let square = getTargetSquare(targetRow, targetCol);
		putPiece(square, getTurnString());
	}
}

//対向の所有マスの位置を確認（左上）
const getPosOppositeUpperLeft = (row, col) => {
	if (row == 0 || col == 0) {
		return null;
	}

	let targetRow = row - 1;
	let targetCol = col - 1;

	if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
		return null;
	}

	for (targetRow--, targetCol--; 0 <= targetRow, 0 <= targetCol; targetRow--, targetCol--) {
		let status = getSquareStatus(targetRow, targetCol);

		if (status == SQUARE_STATUS_NOT_SELECTED) {
			return null;
		}

		if (status == SQUARE_STATUS_IS_OWNED) {
			return {
				row: targetRow,
				col: targetCol,
			};
		}
	}
	return null;
}


//所有者を変更（右上）
const changeOwnerOppositeUpperRight = (row, col) => {
	let endPos = getPosOppositeUpperRight(row, col);

	if (endPos == null) {
		return;
	}

	for (let targetRow = row - 1, targetCol = col + 1; endPos.row < targetRow, targetCol < endPos.col; targetRow--, targetCol++) {
		let square = getTargetSquare(targetRow, targetCol);
		putPiece(square, getTurnString());
	}
}

//対向の所有マスの位置を確認（右上）
const getPosOppositeUpperRight = (row, col) => {
	if (row == 0 || col == 7) {
		return null;
	}

	let targetRow = row - 1;
	let targetCol = col + 1;

	if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
		return null;
	}

	for (targetRow--, targetCol++; 0 <= targetRow, targetCol <= 7; targetRow--, targetCol++) {
		let status = getSquareStatus(targetRow, targetCol);

		if (status == SQUARE_STATUS_NOT_SELECTED) {
			return null;
		}

		if (status == SQUARE_STATUS_IS_OWNED) {
			return {
				row: targetRow,
				col: targetCol,
			};
		}
	}
	return null;
}


//所有者を変更（左下）
const changeOwnerOppositeLowerLeft = (row, col) => {
	let endPos = getPosOppositeLowerLeft(row, col);

	if (endPos == null) {
		return;
	}

	for (let targetRow = row + 1, targetCol = col - 1; targetRow < endPos.row, endPos.col < targetCol; targetRow++, targetCol--) {
		let square = getTargetSquare(targetRow, targetCol);
		putPiece(square, getTurnString());
	}
}

//対向の所有マスの位置を確認（左下）
const getPosOppositeLowerLeft = (row, col) => {
	if (row == 7 || col == 0) {
		return null;
	}

	let targetRow = row + 1;
	let targetCol = col - 1;

	if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
		return null;
	}

	for (targetRow++, targetCol--; targetRow <= 7, 0 <= targetCol; targetRow++, targetCol--) {
		let status = getSquareStatus(targetRow, targetCol);

		if (status == SQUARE_STATUS_NOT_SELECTED) {
			return null;
		}

		if (status == SQUARE_STATUS_IS_OWNED) {
			return {
				row: targetRow,
				col: targetCol,
			};
		}
	}
	return null;
}


//所有者を変更（右下）
const changeOwnerOppositeLowerRight = (row, col) => {
	let endPos = getPosOppositeLowerRight(row, col);

	if (endPos == null) {
		return;
	}

	for (let targetRow = row + 1, targetCol = col + 1; targetRow < endPos.row, targetCol < endPos.col; targetRow++, targetCol++) {
		let square = getTargetSquare(targetRow, targetCol);
		putPiece(square, getTurnString());
	}
}

//対向の所有マスの位置を確認（右下）
const getPosOppositeLowerRight = (row, col) => {
	if (row == 7 || col == 7) {
		return null;
	}

	let targetRow = row + 1;
	let targetCol = col + 1;

	if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
		return null;
	}

	for (targetRow++, targetCol++; targetRow <= 7, targetCol <= 7; targetRow++, targetCol++) {
		let status = getSquareStatus(targetRow, targetCol);

		if (status == SQUARE_STATUS_NOT_SELECTED) {
			return null;
		}

		if (status == SQUARE_STATUS_IS_OWNED) {
			return {
				row: targetRow,
				col: targetCol,
			};
		}
	}
	return null;
}


//調査対象のマス目の状態を取得
const getSquareStatus = (row, col) => {
	const square = getTargetSquare(row, col);

	if (square) {

		if (!square.classList.contains("selected")) {
			return SQUARE_STATUS_NOT_SELECTED;
		}

		if (getTurnString() == square.getAttribute("data-owner")) {
			return SQUARE_STATUS_IS_OWNED;
		}

		return SQUARE_STATUS_IS_OTHER;
	}
}