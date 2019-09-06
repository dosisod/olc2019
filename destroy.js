var tfs=[
	"true",
	"false",
	"\"\"",
	"\"hello\"",
	"0",
	"1"
]

var starts=[
	"",
	"!",
	"!!"
]

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
	done=[]
	ans=[]

	for (i=0;i<100;i++) {
		tmp=generate(i)
		done.push(tmp[0])
		ans.push(tmp[1])

		li=document.createElement("li")
		li.innerHTML=done[i]
		document.getElementById("exprs").appendChild(li)
	}
}

function generate(lvl) {
	lvl=99-lvl
	raw="" //stores raw text to be sent to compiler
	html=""
	if (lvl==0) {
		html=bool_(true)+"=="+bool_(true)
		raw="true"
	}
	else if (0<lvl&&lvl<=15) {
		tmp=randarr(starts)
		html+=auto(tmp)
		raw+=tmp

		tmp=randarr(tfs)
		html+=auto(tmp)
		raw+=tmp
	}
	else if (15<lvl&&lvl<30) {
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
	tmp=new Function("return !!"+str)
	return !!tmp()
}

function check(e) {
	console.log(e)
}

window.onload=function () {
	init()
}
