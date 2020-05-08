'use strict';

let numbers = [-81,27,-54,-27,28,80,56,21];
let numbersSort = [];
let tempFlag = true;
let globalFlag = true;
let typeDesign = 1;

startApp();
function startApp(){
	addEvent('.form-switch button', 'click', switchSet);
	addEvent('.random .random__title_filter', 'click', filter);
	addEvent('.numbers__input', 'input', validNumbers);
	addEvent('.numbers__reset', 'click', resetInput);
	addEvent('.random .range__item', 'mousedown', startMove);
	addEvent('.random .range__number', 'input', range);
	addEvent('.random .radio__input', 'input', radioFilter);
	addEvent('.form-container_method .radio__input', 'input', radioMethod);
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

	(this.value.split(',').map(num => {
		num = isNaN(Number(num)) ? 0 : Number(num);
		if (num < -1000){
			this.value = this.value.replace(num, '-1000');
		}
		if (num > 1000) {
			this.value = this.value.replace(num, '1000');
		}
	}));
	
	numbers = [];
	numbers = (this.value.split(',').map(num => {
		return num = isNaN(Number(num)) ? 0 : Number(num);
	}));

	if (numbers.length > 10) {
		this.value = this.value.slice(0, valueLenght - 1); 
	}

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

function radioMethod(){	
	let design = document.querySelector('.form-container__design');

	if (this.value === '1') {
		design.classList.add('design_active');
	}else if (this.value === '2') {
		design.classList.remove('design_active');
	}
}


function radioFilter(){	
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
	if (document.querySelectorAll(selector).length) {
		document.querySelectorAll(selector).forEach(element => element.removeEventListener(event, act));
	}
}

function startSorting(){
	if (numbers.length < 2) {
		alert('Недостаточно чисел для сортировки');
		return;
	}else{
		let method = document.querySelector('.form-container_method .radio__input:checked');
		if (!method || (method.value !== '1' && method.value !== '2')) {
			alert('Выберите метод сортировки');
			return;
		}
		method = method.value;
		numbersSort = numbers.slice();
		let form = document.querySelector('.form').style.display = 'none';
		if (method === '1') {
			let design = document.querySelector('.form-container__design .radio__input:checked');
			if (!design) {
				design = 1;
			}else{
				design = design.value;
			}
			if (design === '1') {
				typeDesign = 1;
				createShelf();
			}else{
				typeDesign = 2;
				createDiagram();
			}
		}else{
			typeDesign = 3;
			createTree();
		}
	}
}

function createShelf(){
	let sort = document.createElement('div');
	sort.className = 'sort';

	let width = numbersSort.length * 70;
	let books = '';
	for (let i = 0; i < numbersSort.length; i++){
		books += `<div class="book__item" style="left:${i*70}px" data-index="${i}">${numbersSort[i]}</div>`;
	}

	sort.innerHTML = ` 
		<div class="sortBook">
			<div class="sortBook-top"></div>
			<div class="sortBook__container" style="width:${width}px">
				${books}
			</div>
			<div class="sortBook-bottom"></div>
			<div class="sortBook__move">
				<div class="sortBook__container book" style="width:${width}px">
					${books}
				</div>
				<div class="sortBook-bottom"></div>
			</div>
			<button class="btn startBubble" data-act="start">начать</button>
			<button class="btn exit">Выйти</button>
		</div>
	`;

	let wrapper = document.querySelector('.wrapper');
	wrapper.style.width = width + 'px';
	wrapper.append(sort);
	addEvent('.startBubble', 'click', startBubble);
	addEvent('.sort .exit', 'click', exit);
}


function startBubble(){
	if (this.getAttribute('data-act') === 'start') {
		if (typeDesign === 1) {
			document.querySelector('.sortBook__move').classList.add('sortBook__move_active');
		}else if (typeDesign === 2){
			document.querySelector('.sortDiagram__container_begin').style.display = 'block';
			document.querySelector('.sortDiagram__container').classList.add('sortDiagram__container_active');
		}
		document.querySelector('.sort .exit').style.display = 'none';
		this.setAttribute('data-act', 'stop');
		this.innerHTML = 'Остановить';
		tempFlag = true;
		globalFlag = true;
		step(Bubble);
	}else if (this.getAttribute('data-act') === 'stop'){
		this.setAttribute('data-act', 'start');
		this.innerHTML = 'Продолжить';
		document.querySelector('.sort .exit').style.display = 'block';
		document.querySelector('html').scrollTop = document.querySelector('html').scrollHeight;
		tempFlag = false;
		globalFlag = false;

	}else{
		exit();
	}
}

function exit(){
	removeEvent('.startBubble', 'click', startBubble);
	document.querySelector('.sort').remove();
	document.querySelector('.form').style.display = 'block';
}

function createDiagram(){
	let sort = document.createElement('div');
	sort.className = 'sort';

	let min = Math.min.apply(null, numbersSort);
	let step = 250;
	let max = Math.max.apply(null, numbersSort);
	let maxAbs = Math.max.apply(null, numbersSort.map(Math.abs));
	let bottom = 250;

	if (min >= 0) {
		step *= 2;
		bottom = 0;
	}else if (max <= 0){
		step *= 2;
		bottom = 500;
	}


	let width = numbersSort.length * 70;
	let itemsBegin = '';
	let itemsMain = '';
	for (let i = 0; i < numbersSort.length; i++){
		itemsBegin += `<div class="diagram__item ${(numbersSort[i] < 0) ? 'diagram__item_minus' : ''}" style="left:${i*70}px; bottom: ${bottom / 4}px; height:${(Math.abs(numbersSort[i]) / maxAbs * step) / 4}px">${numbersSort[i]}</div>`;
		itemsMain += `<div class="diagram__item ${(numbersSort[i] < 0) ? 'diagram__item_minus' : ''}" style="left:${i*70}px; bottom: ${bottom}px; height:${Math.abs(numbersSort[i]) / maxAbs * step}px" data-index="${i}">${numbersSort[i]}</div>`;
	}

	sort.innerHTML = ` 
		<div class="sortDiagram">
			<div class="sortDiagram__container_begin" style="width:${width}px">
				${itemsBegin}
			</div>
			<div class="sortDiagram__container diagram" style="width:${width}px">
				${itemsMain}
			</div>
			<button class="btn startBubble" data-act="start">начать</button>
			<button class="btn exit">Выйти</button>
		</div>
	`;

	let wrapper = document.querySelector('.wrapper');
	wrapper.style.width = width + 'px';
	wrapper.append(sort);
	addEvent('.startBubble', 'click', startBubble);
	addEvent('.sort .exit', 'click', exit);
}

function createTree(){
	alert('создать дерево');
}

function step(func){
	if (tempFlag === true && globalFlag === true) {
		setTimeout(func, 500);
	}
}


function Bubble(){
	tempFlag = false;
	if (globalFlag === false) {
		return;
	}
	if (typeDesign === 1) {
		document.querySelectorAll('.sort .book .book__item').forEach(book => book.classList.remove('book__item_bottom'));
	}else if (typeDesign === 2) {
		document.querySelectorAll('.sort .diagram .diagram__item').forEach(diagram => diagram.classList.remove('diagram__item_green'));
	}
	
	for (var i = 0; i < numbersSort.length - 1; i++) {
	     for (var j = 0; j < numbersSort.length - 1 - i; j++) {
	         if (numbersSort[j] > numbersSort[j + 1]) {
	             var swap = numbersSort[j];
	             numbersSort[j] = numbersSort[j + 1];
	             numbersSort[j + 1] = swap;
	             change(j,j + 1);
	             return;
	         }
	     }
	 }
	 document.querySelector('.startBubble').setAttribute('data-act', 'back')
	 document.querySelector('.startBubble').innerHTML = 'Вернуться в меню';
}

function change(one,two){
	let element1 = document.querySelector(`.sort .book [data-index="${one}"]`) || document.querySelector(`.sort [data-index="${one}"]`);
	let element2 = document.querySelector(`.sort .book [data-index="${two}"]`) || document.querySelector(`.sort [data-index="${two}"]`);
	let left1 = element1.style.left;
	let left2 = element2.style.left;
	
	if (typeDesign === 1) {
		element1.classList.add('book__item_bottom');
		element2.classList.add('book__item_bottom');
	}else if (typeDesign === 2) {
		element1.classList.add('diagram__item_green');
		element2.classList.add('diagram__item_green');
	}
	
	
	element2.style.left = left1;
	element1.style.left = left2;
	element1.setAttribute('data-index', two);
	element2.setAttribute('data-index', one);
	tempFlag = true;
	step(Bubble)
}
