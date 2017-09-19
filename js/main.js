const myBallGetId = document.getElementById("myBall");
const stickGetId = document.getElementById("stick");
const ball8GetId = document.getElementById("ball8");

let mouse = {
	pointX: 0,
	pointY: 0
};
let myBallYMouseYDifference;
let myBallXMouseXDifference;
let functionVariable = {
	mousemove_count: 0,
	move_count: 0, //moveの関数のカウント
	JudgmentCount: 0
};

let myBallX = 540; //自分のボールのX座標
let myBallY = 600; //自分のボールのY座標

let directionX = 1; //自分のボールの、進むXの方向
let directionY = 1; //自分のボールの、進むYの方向

let flagX = 1; //壁の判定で、進むXの方向
let flagY = 1; //壁の判定で、進むYの方向

let othersBallsX = [540, 525, 555, 510, 540, 570, 525, 555, 540]; //自分以外のボールのポイントX
let othersBallsY = [100, 130, 130, 160, 160, 160, 190, 190, 220]; //自分以外のボールのポイントY

let lounchAngle = 0; //発射の角度
let lounchAngle1 = 0; //発射の角度(仮)

let SpeedX1 = 0; //１回にボールが進む距離のX計算に使用)
let SpeedY1 = 0; //１回にボールが進む距離のY(計算に使用)

let myBallSpeed = 0; //ボールの本当のスピード三平方で斜めの進んだ距離を取得

let tobasuSpeed = 1; //tobasuの関数のsetTimeoutの速さ
//ボール８について
let directionX8 = 1; //8ボールの、進むXの方向
let directionY8 = 1; //8ボールの、進むYの方向

let flagX8 = 1; //壁の判定で、進むXの方向
let flagY8 = 1; //壁の判定で、進むYの方向

let Speed = 0;


//発射の角度と方向
document.onmousemove = function mousemove() {
	mouse["pointX"] = event.x;
	mouse["pointY"] = event.y;

	functionVariable["mousemove_count"] += 2;
	if (functionVariable["mousemove_count"] >= 360) {
		functionVariable["mousemove_count"] = 0;
	}
	let pointX = event.x - myBallX;
	let pointY = myBallY - event.y;
	let radian = Math.acos(pointX / Math.sqrt(pointX ** 2 + pointY ** 2));
	let degree = radian * 180 / Math.PI;
	if (pointY < 0) {
		degree = 360 - degree;
	}
	degree = (degree + 270) * -1;
	stickGetId.style.WebkitTransform = "rotate(" + degree + 90 + "deg)";

	lounchAngle = degree + 90;
	if (degree <= -90) {
		lounchAngle = (degree + 90) * -1;
	}
	lounchAngle = 360 - lounchAngle % 360;
	lounchAngle = Math.round(lounchAngle);
	lounchAngle1 = lounchAngle - 90;
	if (lounchAngle1 <= 0) {
		lounchAngle1 += 360;
	}
}
//自分のボールを動かす
function move() {
	if (functionVariable["move_count"] === 0) {
		functionVariable["move_count"]++;
		myBallYMouseYDifference = mouse["pointY"] - myBallY;
		myBallXMouseXDifference = mouse["pointX"] - myBallX;
	}
	myBallY += directionY * (myBallYMouseYDifference / 50);
	myBallX += directionX * (myBallXMouseXDifference / 50);
	myBallGetId.style.top = myBallY + "px";
	myBallGetId.style.left = myBallX + "px";

	Speed += 1.3;
	if (Speed >= 100) {
		Speed = 1;
		functionVariable["move_count"] = 0;
		stickGetId.style.WebkitTransform = "rotate(0deg)";
		stickGetId.style.top = myBallY - 225 + "px";
		stickGetId.style.left = myBallX + "px";
		directionY, directionX = 1;
	}
	console.log((myBallX-othersBallsX[8]) ** 2 + (myBallY-othersBallsY[8]) ** 2);
	if(((myBallX-othersBallsX[8]) ** 2 + (myBallY-othersBallsY[8]) ** 2) <= 1200){
		// return;
		directionY *= -1;
	}
	holeJudgment();
	wallJudgment();
	SpeedSearch(Speed);
	setTimeout(move, Speed);
}
//自分のボールと壁の当たあたり判定
function wallJudgment() {
	if (myBallX < 753 && myBallX > 333) {
		flagX = 0;
	} else {
		flagX = 1;
	}
	if (myBallY < 658 && myBallY > 85) {
		flagY = 0;
	} else {
		flagY = 1;
	}
	if (flagY === 1) {
		directionY *= -1;
	}
	if (flagX === 1) {
		directionX *= -1;
	}
}

function wallJudgment8() {
	if (othersBallsX[8] < 753 && othersBallsX[8] > 333) {
		flagX8 = 0;
	} else {
		flagX8 = 1;
	}

	if (othersBallsY[8] < 658 && othersBallsY[8] > 85) {
		flagY8 = 0;
	} else {
		flagY8 = 1;
	}
	if (flagY8 === 1) {
		directionY8 *= -1;
	}
	if (flagX8 === 1) {
		directionX8 *= -1;
	}
}
//自分のボールと穴の当たあたり判定
function holeJudgment() {
	if ((myBallX >= 333 && myBallX <= 363) || (myBallX >= 723 && myBallX <= 793)) {
		if ((myBallY >= 92 && myBallY <= 132) || (myBallY >= 376 && myBallY <= 416) || (myBallY >= 631 && myBallY <= 701)) {
			location.reload();
		}
	}
}

//最初に表示する
set();

function set() {
	myBallGetId.style.top = myBallY + "px";
	myBallGetId.style.left = myBallX + "px";
}
//三平方でボールのスピードを取得
function SpeedSearch(num1) {
	let SpeedY = (myBallYMouseYDifference / 50) ** 2;
	let SpeedX = (myBallXMouseXDifference / 50) ** 2;
	myBallSpeed = (Math.sqrt(SpeedX + SpeedY)) / num1;
	myBallSpeed *= 1000;
	myBallSpeed = Math.round(myBallSpeed);
	myBallSpeed /= 10;
	SpeedY1 = (myBallYMouseYDifference / 50) / num1 / 2;
	SpeedX1 = (myBallXMouseXDifference / 50) / num1 / 2;
}
//ぶつかったボールを飛ばす
function tobasu(num, num1) {
	if (num1 === 8) {
		if (num === 0) {
			othersBallsX[8] += (directionX8 * (SpeedX1 * 200 * -1));
			othersBallsY[8] += (directionY8 * (SpeedY1 * 200));
			ball8GetId.style.top = othersBallsY[8] + "px";
			ball8GetId.style.left = othersBallsX[8] + "px";
			tobasuSpeed += 1.3;
			wallJudgment8();
			setTimeout("tobasu(" + num + "," + num1 + ")", tobasuSpeed);
		}
	}
}
