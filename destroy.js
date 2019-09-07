//where the player is at (from 0-49)
var at=0

//current time elapsed
var active=false
var reset=false
var timer_interval=null
var timer_start=0
var timer_now=0

var tfs=[
	"true",
	"false",
	"\"\"",
	"\"hello\"",
	"0",
	"1",
	"[]"
]

var tfs2=[
	"([1,2,3].indexOf(5)>0)",
	"([1,2,3].indexOf(2)>0)",
	"(\"x\".startsWith(\"x\")==true)",
	"(\"x\".startsWith(\"y\")==true)"
]

var both=[...tfs, ...tfs2]

//operations that are able to be put at the start of a statement
var starts=[
	"",
	"!",
	"!!"
]

//operations
var ops=[
	"&&",
	"||",
	"^",
	"!=",
	"=="
]

function randarr(arr) { //given an arry, select a random element
	return arr[~~(Math.random()*arr.length)]
}

function bool_(b) {
	if (b) {
		return "<span class='tf'>true</span>"
	}
	else {
		return "<span class='tf'>false</span>"
	}
}

function auto(str) {
	if (str.startsWith("\"")) {
		return string(str)
	}
	else if (str=="true") {
		return bool_(true)
	}
	else if (str=="false") {
		return bool_(false)
	}
	else {
		return str
	}
}

function string(str) { //turns given string into a string element
	return "<span class='str'>"+str+"</span>"
}

function init() {
	ans=new Array(100)

	for (i=0;i<50;i++) {
		tmp=generate(i)
		ans[49-i]=tmp[1]

		li=document.createElement("li")
		li.classList.add("hide")
		li.innerHTML=tmp[0]
		li.id="_"+(49-i)
		document.getElementById("exprs").appendChild(li)
	}
	document.getElementById("_0").classList.remove("hide")
	document.getElementById("_0").classList.add("current")
}

function generate(lvl) {
	lvl=49-lvl
	raw="" //stores raw text to be sent to compiler
	html=""
	if (lvl==0) {
		html=bool_(true)+"=="+bool_(true)
		raw="true"
	}
	else if (0<lvl&&lvl<=10) {
		tmp=randarr(starts)
		html+=auto(tmp)
		raw+=tmp

		tmp=randarr(both)
		html+=auto(tmp)
		raw+=tmp
	}
	else if (10<lvl&&lvl<=30) {
		tmp=randarr(starts)
		html+=auto(tmp)
		raw+=tmp

		tmp=randarr(tfs)
		html+=auto(tmp)
		raw+=tmp
		
		tmp=randarr(ops)
		html+=auto(tmp)
		raw+=tmp

		tmp=randarr(tfs)
		html+=auto(tmp)
		raw+=tmp
	}
	else if (30<lvl&&lvl<=50) {
		tmp=randarr(tfs)
		html+=auto(tmp)
		raw+=tmp
		
		tmp=randarr(ops)
		html+=auto(tmp)
		raw+=tmp

		tmp=randarr(tfs)
		html+=auto(tmp)
		raw+=tmp

		tmp=randarr(ops)
		html+=auto(tmp)
		raw+=tmp

		tmp=randarr(tfs)
		html+=auto(tmp)
		raw+=tmp
	}
	return [ html, compile(raw) ]
}

function compile(str) {
	tmp=new Function("return !!"+str)
	return !!tmp()
}

function check(e) {
	//only continue if enter was pressed
	if (e.key!="Enter") return

	if (at>=49) {
		win()
		return
	}

	active=true

	if (at==0) document.getElementById("startup").remove()

	input=document.getElementById("input").value.toLowerCase()
	if (input!="true"&&input!="false") return

	if ((""+ans[at])!=input) {
		gameover()
		return
	}

	//everything worked, remove and reset things
	timer_start=Date.now()
	clearInterval(timer_interval)

	timer_interval=setInterval(function() {
		//after 10 seconds, run gameover function
		gameover()
		return
	}, 10000)

	document.getElementById("_"+at).remove()
	document.getElementById("_"+(at+1)).classList.remove("hide")
	document.getElementById("_"+(at+1)).classList.add("current")
	document.getElementById("input").value=""
	at++
}

function win() {
	active=false
	clearInterval(timer_interval)

	document.getElementById("cod").innerHTML=""

	document.getElementById("exprs").innerHTML=""
	document.getElementById("timer").style.width="0%"
	document.body.style.background="white"

	document.getElementById("score").innerText+="100%"
	document.getElementById("msg").innerText="You Win!"

	document.getElementById("gameover").classList.remove("gameover")
}

function gameover() {
	active=false //stop timer
	clearInterval(timer_interval)

	document.getElementById("cod").innerText+=document.getElementById("_"+at).innerText

	document.getElementById("exprs").innerHTML=""
	document.getElementById("timer").style.width="0%"
	document.body.style.background="white"

	document.getElementById("score").innerText+=(at*2)+"%"
	document.getElementById("gameover").classList.remove("gameover")
}

window.onload=function() {
	init()

	setInterval(function() {
		if (active) {
			percent=((Date.now()-timer_start)%10000)/100
			document.getElementById("timer").style.width=percent+"%"
		}
	}, 100)
}
