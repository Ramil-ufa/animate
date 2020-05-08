'use strict';

let numbers = [];

startApp();
function startApp(){
	addEvent('.form-switch button', 'click', switchSet);
	addEvent('.random .random__title_filter', 'click', filter);
	addEvent('.numbers__input', 'input', validNumbers);
	addEvent('.numbers__reset', 'click', resetInput);
	addEvent('.random .range__item', 'mousedown', startMove);
	addEvent('.random .range__number', 'input', range);
	addEvent('.random .radio__input', 'input', radio);
	addEvent('.random .random__generate_button', 'click', generate);
	addEvent('.form__send', 'click', startSorting);
}



function switchSet(event){
	document.querySelectorAll('.form-switch button').forEach(button => button.classList.remove('form-switch__active'));
	if (event.target.getAttribute('data-switch') === '1') {
		document.querySelectorAll('.form-switch button')[0].classList.add('form-switch__active');
		document.querySelectorAll('.form-container__title')[0].innerText = 'Введите числа через запятую';
		document.querySelector('.random').style.display = 'none';
		document.querySelector('.numbers__input').removeAttribute('disabled');
	}else{
		document.querySelectorAll('.form-switch button')[1].classList.add('form-switch__active');
		document.querySelectorAll('.form-container__title')[0].innerText = 'Числа:';
		document.querySelector('.random').style.display = 'block';
		document.querySelector('.numbers__input').setAttribute('disabled', 'disabled');
	}
}

function resetInput(){
	document.querySelector('.numbers__input').value = '';
	numbers = [];
}

function validNumbers(){
	this.value = this.value.replace(/[^\d,-]/g, '');
	this.value = this.value.replace(/\-+/g, '-');
	this.value = this.value.replace(/\,+/g, ',');

	if (this.value[0] === ',') {
		this.value = '';
	}

	let valueLenght = this.value.length;
	if (valueLenght > 1 && this.value[valueLenght - 1] === '-' && this.value[valueLenght - 2] !== ',') {
		this.value = this.value.slice(0, valueLenght - 1); 
		valueLenght--;
	}
	if (valueLenght > 1 && this.value[valueLenght - 1] === ',' && this.value[valueLenght - 2] === '-') {
		this.value = this.value.slice(0, valueLenght - 1); 
		valueLenght--;
	}

	
	numbers = [];
	numbers = (this.value.split(',').map(num => {
		return num = isNaN(Number(num)) ? 0 : Number(num);
	}))

	let lastChar = this.value[valueLenght-1];
	if (typeof(lastChar) === 'undefined' || lastChar === ',' || lastChar === '-') {
		numbers.pop();
	}


}

function filter(){
	let dataActive = this.getAttribute('data-active');
	if (dataActive === 'hidden') {
		this.innerText = 'Скрыть фильтры';
		this.setAttribute('data-active', 'active');
		document.querySelector('.filter').classList.add('filter_active');
		if (document.querySelector('.random .radio__input:checked').value !== '1') {
			document.querySelector('.filter').classList.add('filter_rangeNone');
		}
		
	}else if (dataActive === 'active') {
		this.innerText = 'Открыть фильтры';
		this.setAttribute('data-active', 'hidden');
		document.querySelector('.filter').classList.remove('filter_rangeNone');
		document.querySelector('.filter').classList.remove('filter_active');
	}
}



function radio(){	
	let filter = document.querySelector('.random .filter');
	console.log("filter", filter);
	let rangeList = document.querySelectorAll('.random .filter__range')
	if (this.value === '1') {
		rangeList.forEach(item => item.style.display = 'block');
		filter.classList.remove('filter_rangeNone');
	}else if (this.value === '2') {
		rangeList[0].style.display = 'block';
		rangeList[1].style.display = 'none';
		filter.classList.add('filter_rangeNone');
	}else if (this.value === '3') {
		rangeList[0].style.display = 'none';
		rangeList[1].style.display = 'block';
		filter.classList.add('filter_rangeNone');
	}
}

function generate(){
	let listResult = document.querySelectorAll('.random .range__result'),
	    radioValue = document.querySelector('.random .radio__input:checked').value,
	    amount = listResult[2].innerHTML || 10,
	    min = listResult[0].innerHTML || listResult[0].parentElement.querySelector('.range__item').getAttribute('data-min'),
	    max = listResult[1].innerHTML || listResult[1].parentElement.querySelector('.range__item').getAttribute('data-max'),
	    input = document.querySelector('.numbers__input');

	min = isNaN(Number(min)) ? 0 : Number(min);
	max = isNaN(Number(max)) ? 100 : Number(max);

	console.log(min, max);

	if (radioValue === '2') {
		max = -1;
	}else if (radioValue === '3') {
		min = 1;
	}

	numbers = [];
	for (let i = 0; i < amount; i++){
		numbers.push(randomNumber(min,max));	
	}
	input.value = numbers.join(',');
}


function randomNumber(min,max){
  	return Math.floor(min + Math.random() * (max + 1 - min));
}

/**
 * Устанавливает обработчик на кнопку
 * @param {selector} - селектор для нахождения элемента в DOM
 * @param {act} - действие на нажатие
 */
function addEvent(selector, event, act){
	document.querySelectorAll(selector).forEach(element => element.addEventListener(event, act));
}

/**
 * Удаляет обработчик на кнопку
 * @param {selector} - селектор для нахождения элемента в DOM
 * @param {act} - действие на нажатие
 */
function removeEvent(selector, event, act){
	if (document.querySelectorALL(selector).lenght) {
		document.querySelectorALL(selector).forEach(element => element.removeEventListener(event, act));
	}
}

function startSorting(){
	if (numbers.length < 2) {
		alert('Недостаточно чисел для сортировки')
		return;
	}
}













