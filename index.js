let dragging = false;
let TIME_SIZE = 48;

window.onload = function(){
	let dates = [];

	$("#day-input-area").datepicker();
	
	document.onmousedown = function(evt){
	  dragging = true;
	};
	document.onmouseup = function(evt){
	  dragging = false;
	};

 $('#day-confirm-btn').on('click', function() {
 	if ($('#day-input-area').data('datepicker').selectedDates != null) {
 		$('#schedule-field').clear;
	 	switchClass(document.getElementById("step1"), "hidden");
	 	switchClass(document.getElementById("step1"), "is-show");
		switchClass(document.getElementById("step2"), "is-show");
		switchClass(document.getElementById("step2"), "flexbox");
		dates = getData();
		makeScheduler(dates);
 	} else {
 		alert("Invalid input");
 	}
 });

 $('#time-confirm-btn').on('click', function() {
 	let selectedTimes = getSelectedTimes(dates);
 	let result = timeFormatter(selectedTimes);
	switchClass(document.getElementById("step2"), "hidden");
	switchClass(document.getElementById("step2"), "is-show");
 	switchClass(document.getElementById("step3"), "is-show");
 	document.getElementById("result").innerHTML = result;
 });

 $('#reset').on('click', function() {
 		document.getElementById("cover").classList.add('anime5');
    setTimeout(fadeOut, 1500);
    setTimeout(reload, 2500);
 });

};

function fadeOut() {
	let body = document.getElementsByTagName('body')[0];
	body.classList.add('bodyfadeout');
}

function reload() {
	location.reload();
}

function getData() {
	let selecetedDates = $('#day-input-area').data('datepicker').selectedDates;
	let dates = [];

	if (selecetedDates.length == 2) {
		let firstDay = new Date(selecetedDates[0]);
		let endDay = new Date(selecetedDates[1]);
		while(endDay >= firstDay) {
			dates.push(new Date(firstDay));
			firstDay.setDate(firstDay.getDate() + 1);
		}
	} else {
		dates.push(new Date(selecetedDates[0]));
	}
	return dates;
};

function makeScheduler(dates) {
	for (let i = 0; i < dates.length; i++) {
		let div = document.createElement('div');
		div.id = "date" + i;
		div.classList.add('date');
		createString(dateFormat(dates[i]), div);
		createImg("timeline.png", div);
		createTimeField(div);
		document.getElementById('schedule-field').appendChild(div);
	}

}

function createString(str, parent) {
	let p = document.createElement('p');
	p.innerText = str;
	p.classList.add('date-discripton');
	parent.appendChild(p);
}

function createImg(img, parent) {
	let imgEle = document.createElement('img');
	imgEle.src = img;
	parent.appendChild(imgEle);
}

function createTimeField(parent) {
		let field = document.createElement('div');
		field.classList.add('time-block-field');
		for (let i = 0; i < 48; i++) {
			let box = document.createElement('div');
			box.classList.add('time-block');
			box.onclick = function() {
				switchClass(box, "selected");
			};
			box.onmouseover = function() {
				if (dragging) {
					switchClass(box, "selected");
				};
			};
			field.appendChild(box);
		}
		parent.appendChild(field);
}

function getSelectedTimes(dates) {
	let selectedTimes = {};
	for (let i = 0; i < dates.length; i++) {
		selectedTimes[dates[i]] = [];
		let blocks = $("#date" + i + " div.time-block-field div");
		for (let j = 0; j < TIME_SIZE; j++) {
			if (blocks[j].classList.contains("selected")) {
				selectedTimes[dates[i]].push(j);
			}
		}
	}
	return selectedTimes;
}

function timeFormatter(selectedTimes) {
	let str = "";
	let dates = Object.keys(selectedTimes);
	let startFlag = true;
	for (let i = 0; i < dates.length; i++) {
		if (selectedTimes[dates[i]].length > 0) {
			str += dateFormat(new Date(dates[i])) + '\n';
			let times = selectedTimes[dates[i]];
			let lastIndex = times.length - 1;
			for (let j = 1; j < times.length; j++) {
				if (startFlag) {
					str += '\t' + (Math.floor(times[j-1] / 2) + 6);
					str += ":" + times[j-1]  % 2 * 3 + '0';
				}
				if (times[j] - times[j-1] > 1) {
					str += ' - ' + (Math.floor((times[j-1] + 1) / 2) + 6);
					str += ":" + (times[j-1] + 1) % 2 * 3 + '0\n';
					startFlag = true;
				} else {
					startFlag = false;
				}
			}
			if (startFlag) {
				str += '\t' + (Math.floor(times[lastIndex] / 2) + 6);
				str += ":" + times[lastIndex]  % 2 * 3 + '0';
			}
			str += ' - ' + (Math.floor((times[lastIndex] + 1) / 2) + 6);
			str += ":" + (times[lastIndex] + 1) % 2 * 3 + '0\n';
			startFlag = true;
		}
	}
	console.log(str);
	return str;
}

// dateFormat 関数の定義
function dateFormat(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var w = date.getDay();
  //var wNames = ['日', '月', '火', '水', '木', '金', '土'];

  var wNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  m = ('0' + m).slice(-2);
  d = ('0' + d).slice(-2);

  // フォーマット整形済みの文字列を戻り値にする
  //return y + '年' + m + '月' + d + '日 (' + wNames[w] + ')';
  return y + '/' + m + '/' + d + ' (' + wNames[w] + ')';
}

function switchClass(dom, className) {
	if (dom.classList.contains(className)) {
		dom.classList.remove(className);
	} else {
		dom.classList.add(className);
	}
}
