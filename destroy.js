const MAX_LVL=50
var currentLvl=0

var isActive=false
var isDead=false
var gameTimer=undefined
var timerStart=0

const easyExpressions=[
	"true",
	"false",
	"\"\"",
	"\"hello\"",
	"0",
	"1",
	"[]",
	"null",
	"undefined"
]

const harderExpressions=[
	"(1 in [1,2,3])",
	"(5 in [1,2,3])",
	"(\"x\".startsWith(\"x\"))",
	"(\"x\".startsWith(\"y\"))"
]

const allExpressions=[
	...easyExpressions,
	...harderExpressions
]

const inversionExpressions=[
	"",
	"!",
	"!!"
]

const bitwiseOperations=[
	"&&",
	"||",
	"^",
	"!=",
	"=="
]

function getRandom(arr) {
	return arr[~~(
		Math.random() * arr.length
	)]
}

function colorize(obj) {
	if (typeof obj==="string") {
		if (obj.startsWith("\"") && obj!="false" && obj!="true") {
			return colorizeString(obj)
		}
	}
	if (typeof obj==="boolean") {
		return colorizeBool(obj)
	}
	else if (easyExpressions.indexOf(obj) > -1) {
		return colorizeBool(obj)
	}
	else {
		return obj
	}
}

function colorizeBool(bool) {
	if (bool===false || bool==="false") {
		return "<span class='tf'>false</span>"
	}
	else if (bool===true || bool==="true") {
		return "<span class='tf'>true</span>"
	}
	else {
		return "<span class'tf'>"+bool+"</span>"
	}
}

function colorizeString(str) {
	return "<span class='str'>"+str+"</span>"
}

function generateLvl(lvl) {
	lvl=MAX_LVL - 1 - lvl

	if (lvl==0) {
		return [
			colorizeBool(true)+"=="+colorizeBool(true),
			true
		]
	}
	else if (0 < lvl && lvl <= 10) {
		return randomlyCombine([
			inversionExpressions,
			allExpressions
		])
	}
	else if (10 < lvl && lvl <= 30) {
		return randomlyCombine([
			inversionExpressions,
			easyExpressions,
			bitwiseOperations,
			easyExpressions
		])
	}
	else if (30 < lvl && lvl <= MAX_LVL) {
		return randomlyCombine([
			easyExpressions,
			bitwiseOperations,
			easyExpressions,
			bitwiseOperations,
			easyExpressions
		])
	}
}

function randomlyCombine(arrays) {
	var html=""
	var raw=""

	for (const array of arrays) {
		const random=getRandom(array)
		html+=colorize(random)
		raw+=random
	}

	return [ html, evaluate(raw) ]
}

function evaluate(expression) {
	return !!(new Function(
		"return !!"+expression
	))()
}

function check(e) {
	if (e.key!="Enter" || isDead) return

	if (currentLvl == MAX_LVL - 1) {
		win()
		return
	}

	isActive=true
	isDead=false

	if (currentLvl==0) {
		getId("startup").remove()
	}

	const input=getId("input").value.toLowerCase()
	if (input!="true" && input!="false") return

	if ((""+answers[currentLvl]) != input) {
		gameover()
		return
	}

	timerStart=Date.now()
	clearInterval(gameTimer)

	gameTimer=setInterval(function() {
		gameover()
		return
	}, 10000)

	getId("lvl_"+ currentLvl).remove()
	getId("lvl_"+(currentLvl + 1)).classList.remove("hide")
	getId("lvl_"+(currentLvl + 1)).classList.add("current")
	getId("input").value=""
	currentLvl++
}

function win() {
	isDead=true
	isActive=false
	clearInterval(gameTimer)

	getId("cod").innerHTML=""

	getId("expressions").innerHTML=""
	getId("timer").style.width="0%"
	document.body.style.background="white"

	getId("score").innerText+="100%"
	getId("msg").innerText="You Win!"

	getId("gameover").classList.remove("gameover")
}

function gameover() {
	isDead=true
	isActive=false
	clearInterval(gameTimer)

	getId("cod").innerText+=getId("lvl_"+currentLvl).innerText

	getId("expressions").innerHTML=""
	getId("timer").style.width="0%"
	document.body.style.background="white"

	getId("score").innerText+=~~(currentLvl / MAX_LVL * 100)+"%"
	getId("gameover").classList.remove("gameover")
}

function setupGame() {
	answers=new Array(100)

	for (let lvl=0; lvl<MAX_LVL; lvl++) {
		const tmp=generateLvl(lvl)
		answers[MAX_LVL - 1 - lvl]=tmp[1]

		const li=document.createElement("li")
		li.classList.add("hide")
		li.innerHTML=tmp[0]
		li.id="lvl_" + (MAX_LVL - 1 - lvl)
		getId("expressions").appendChild(li)
	}
	getId("lvl_0").classList.remove("hide")
	getId("lvl_0").classList.add("current")
}

window.onload=function() {
	setupGame()

	setInterval(function() {
		if (isActive) {
			percent=((Date.now()-timerStart)%10000)/100
			getId("timer").style.width=percent+"%"
		}
	}, 100)
}

function getId(id) {
	return document.getElementById(id)
}
