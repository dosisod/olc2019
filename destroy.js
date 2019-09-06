//where the player is at (from 0-99)
var at=0

var tfs=[
	"true",
	"false",
	"\"\"",
	"\"hello\"",
	"0",
	"1"
]

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
	tmp=arr[~~(Math.random()*arr.length)]
	return tmp
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

	for (i=0;i<100;i++) {
		tmp=generate(i)
		ans[99-i]=tmp[1]

		li=document.createElement("li")
		li.classList.add("hide")
		li.innerHTML=tmp[0]
		li.id="_"+(99-i)
		document.getElementById("exprs").appendChild(li)
	}
	document.getElementById("_0").classList.remove("hide")
	document.getElementById("_0").classList.add("current")
}

function generate(lvl) {
	lvl=99-lvl
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

		tmp=randarr(tfs)
		html+=auto(tmp)
		raw+=tmp
	}
	else if (10<lvl&&lvl<30) {
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
	else {
		html+="TBD"
		raw+="true"
	}
	return [ html, compile(raw) ]
}

function compile(str) {
	tmp=new Function("return "+str)
	return !!tmp()
}

function check(e) {
	//only continue if enter was pressed
	if (e.key!="Enter") return

	input=document.getElementById("input").value.toLowerCase()
	if (input!="true"&&input!="false") gameover()

	if ((""+ans[at])!=input) gameover()

	document.getElementById("_"+at).remove()
	document.getElementById("_"+(at+1)).classList.remove("hide")
	document.getElementById("_"+(at+1)).classList.add("current")
	document.getElementById("input").value=""
	at++
}

window.onload=function() {
	init()
}
