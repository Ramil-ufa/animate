'use strict';

// numbers - массив чисел
// numbersSort - массив чисел во время и после сортировки
// globalFlag - метка, о том что можно продолжать сортировку (переключается между сортировками)
// tempFlag - метка, о том что можно продолжать сортировку (переключается между переходами функциями)
// globalFlag и tempFlag - нужны для остановки и продолжения сортировки
// typeDesign - тип дизайна (1 - книжный, 2 - колонки)
// tree - дерево для бинарной сортировки (сделал глобально, чтобы можно было останавливать процесс сортировки)
// indexTree, indexOrder - индекс в массиве numbersSort (чтобы можно было останавливать процесс сортировки)
// branch - содержит в себе index по которому можно обратиться и высоту (нужен для анимации)

let numbers = [],
    numbersSort = [],
    globalFlag = true,
    tempFlag = true,
    typeDesign = 1,
    timer = 2000,
    tree = {},
    indexTree = 0,
    indexOrder = 0,
    branch = {
		index : 0,
		height : 0,
	 };


startApp();

//инициализация событий: 
//switchSet - ручной ввод/рандомный ввод, filter - открыть/закрыть фильтр, validNumbers - проверка введнных символов
//resetInput - очистить поле ввода, startMove - движение range (range.js), range - провека введеных чисел для range (range.js)
//radioFilter - отрицательный/положительные числа, radioMethod - пузырька/дерево, generate - кнопка генерации чисел, 
//startSorting - кнопка запуска сортировки
function startApp(){
	addEvent('.form__instruction', 'click', createModal);
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



//Переключает между ручным и рандомным вводом
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

//Очистить поле ввода
function resetInput(){
	document.querySelector('.numbers__input').value = '';
	numbers = [];
}

//Проверка на валидность поля
function validNumbers(){
	//Запрещает вводить: 1)символы и др. 2) больше двух '-' подряд 3) больше двух ',' подряд
	this.value = this.value.replace(/[^\d,-]/g, '');
	this.value = this.value.replace(/\-+/g, '-');
	this.value = this.value.replace(/\,+/g, ',');

	//Если первый символ ',' то убирает
	if (this.value[0] === ',') {
		this.value = '';
	}

	//Проверка на ',-' , '-,' (если они первые); 
	let valueLenght = this.value.length;
	if (valueLenght > 1 && this.value[valueLenght - 1] === '-' && this.value[valueLenght - 2] !== ',') {
		this.value = this.value.slice(0, valueLenght - 1); 
		valueLenght--;
	}
	if (valueLenght > 1 && this.value[valueLenght - 1] === ',' && this.value[valueLenght - 2] === '-') {
		this.value = this.value.slice(0, valueLenght - 1); 
		valueLenght--;
	}

	//если введнное число < 1000, то заменяет на -1000 или если введнное число 1000, то заменяет на 1000
	(this.value.split(',').map(num => {
		num = isNaN(Number(num)) ? 0 : Number(num);
		if (num < -1000){
			this.value = this.value.replace(num, '-1000');
		}
		if (num > 1000) {
			this.value = this.value.replace(num, '1000');
		}
	}));
	
	//заполняет массив numbers
	numbers = [];
	numbers = (this.value.split(',').map(num => {
		return num = isNaN(Number(num)) ? 0 : Number(num);
	}));

	//запрещает печатать больше 20 чисел
	if (numbers.length > 20) {
		this.value = this.value.slice(0, valueLenght - 1); 
	}

	//удаляет последний элемент массива
	let lastChar = this.value[valueLenght-1];
	if (typeof(lastChar) === 'undefined' || lastChar === ',' || lastChar === '-') {
		numbers.pop();
	}
}


//Скрыть/показать фильтры
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

//Если метод 1, то открывает выбор дизайна
function radioMethod(){	
	let design = document.querySelector('.form-container__design');
	if (this.value === '1') {
		design.classList.add('design_active');
	}else if (this.value === '2') {
		design.classList.remove('design_active');
	}
}

//Филтр на положительные или отрицательные числа
function radioFilter(){	
	let filter = document.querySelector('.random .filter');
	let rangeList = document.querySelectorAll('.random .filter__range');
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

//генерирует заданное количество рандомных чисел в диапазоне и заносит в numbers
function generate(){
	let listResult = document.querySelectorAll('.random .range__result'),
	    radioValue = document.querySelector('.random .radio__input:checked').value,
	    amount = listResult[2].innerHTML || 10,
	    min = listResult[0].innerHTML || listResult[0].parentElement.querySelector('.range__item').getAttribute('data-min'),
	    max = listResult[1].innerHTML || listResult[1].parentElement.querySelector('.range__item').getAttribute('data-max'),
	    input = document.querySelector('.numbers__input');

	min = isNaN(Number(min)) ? 0 : Number(min);
	max = isNaN(Number(max)) ? 100 : Number(max);


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

//Возвращает число в диапазоне [min, max]
function randomNumber(min,max){
  	return Math.floor(min + Math.random() * (max + 1 - min));
}

/**
 * Устанавливает обработчик на элемент или группу элементов 
 * @param {selector} - селектор для нахождения элемента в DOM
 *	@param {event} - событие
 * @param {act} - действие на выполнение события
 */
function addEvent(selector, event, act){
	document.querySelectorAll(selector).forEach(element => element.addEventListener(event, act));
}

/**
 * Удаляет обработчик на элемент или группу элементов 
 * @param {selector} - селектор для нахождения элемента в DOM
 *	@param {event} - событие
 * @param {act} - действие на выполнение события
 */
function removeEvent(selector, event, act){
	if (document.querySelectorAll(selector).length) {
		document.querySelectorAll(selector).forEach(element => element.removeEventListener(event, act));
	}
}

//По заданным параметрам подключает сортировку
function startSorting(){
	timer = 2000;
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
		document.querySelector('.form').style.display = 'none';
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

//Создает страницу сортировки (книжный дизайн)
function createShelf(dataAct = 'start', dataText = 'Начать'){
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
			<nav class="tree__nav nav">
				<button class="btn nav__button nav__repeat" data-variant="1" style="display: none;">Повторить</button>
				<button class="btn nav__button nav__start" data-act="${dataAct}" data-variant="1">${dataText}</button>
				<button class="btn nav__button nav__back" data-variant="1">Вернуться в меню</button>
				<button class="btn nav__button nav__faster" data-variant="1">Быстрее</button>
				<button class="btn nav__button nav__slower" data-variant="1">Медленнее</button>
			</nav>
		</div>
	`;

	let wrapper = document.querySelector('.wrapper');
	wrapper.style.width = width + 'px';
	wrapper.append(sort);
	eventDefault();
}

//Добавляет обработчки
function eventDefault(){
	addEvent('.nav .nav__start', 'click', relaySorting);
	addEvent('.nav .nav__back', 'click', backMenu);
	addEvent('.nav .nav__faster', 'click', fastSorting);
	addEvent('.nav .nav__slower', 'click', slowerSorting);
	addEvent('.nav .nav__repeat', 'click', repeat);
}

//Выбор между (начать/продолжить) и остановкой сортировки в зависимости от метода сортировки
function relaySorting(){
	let variant = this.getAttribute('data-variant'),
		 dataAct = this.getAttribute('data-act');

	if (dataAct === 'start') {
		this.setAttribute('data-act', 'stop');
		this.innerHTML = 'Остановить';
		tempFlag = true;
		globalFlag = true;
		document.querySelector('.nav .nav__faster').style.display = 'block';
		document.querySelector('.nav .nav__slower').style.display = 'block';
	}else{
		this.setAttribute('data-act', 'start');
		this.innerHTML = 'Продолжить';
		tempFlag = false;
		globalFlag = false;
		document.querySelector('.nav .nav__faster').style.display = 'none';
		document.querySelector('.nav .nav__slower').style.display = 'none';
	}

	if (variant === '1' || variant === '2') {
		if (dataAct === 'start') {
			if (typeDesign === 1) {
				document.querySelector('.sortBook__move').classList.add('sortBook__move_active');
			}else if (typeDesign === 2){
				document.querySelector('.sortDiagram__container_begin').style.display = 'block';
				document.querySelector('.sortDiagram__container').classList.add('sortDiagram__container_active');
			}
			step(bubble);
		}
	}else if (variant === '3' && dataAct === 'start'){
		starTree();
	}
	
}

//Удаляет страницу сортировки и возвращает форму
function backMenu(){
	let variant = this.getAttribute('data-variant');
	removeEvent('.nav .nav__start', 'click', relaySorting);
	removeEvent('.nav .nav__back', 'click', backMenu);
	removeEvent('.nav .nav__faster', 'click', fastSorting);
	removeEvent('.nav .nav__slower', 'click', slowerSorting);
	removeEvent('.nav .nav__repeat', 'click', repeat);
	if (variant === '3') {
		removeEvent('.nav .nav__increase', 'click', increaseTree);
		removeEvent('.nav .nav__reduce', 'click', reduceTree);
	}

	globalFlag = false;
	document.querySelector('.sort').remove();
	document.querySelector('.wrapper').setAttribute('style', '');
	document.querySelector('.form').style.display = 'block';
}

//Уменьшает время задержки 
function fastSorting(){
	this.classList.add('nav__button_grey');
	removeEvent('.nav .nav__faster', 'click', fastSorting);
	setTimeout(() => {
		if (timer > 250) {
			this.classList.remove('nav__button_grey');
			addEvent('.nav .nav__faster', 'click', fastSorting);
		}		
	}, timer);
	timer /= 2;
	let slower = this.parentElement.querySelector('.nav__slower').classList;
	if (slower.contains('nav__button_grey')) {
		slower.remove('nav__button_grey');
		addEvent('.nav .nav__slower', 'click', slowerSorting);
	}
}
//Увеличивает время задержки 
function slowerSorting(){
	this.classList.add('nav__button_grey');
	removeEvent('.nav .nav__slower', 'click', slowerSorting);
	setTimeout(() => {
		if (timer < 10000) {
			this.classList.remove('nav__button_grey');
			addEvent('.nav .nav__slower', 'click', slowerSorting);
		}
	}, timer);
	timer *= 2;
	let fast = this.parentElement.querySelector('.nav__faster').classList;
	if (fast.contains('nav__button_grey')) {
		fast.remove('nav__button_grey');
		addEvent('.nav .nav__faster', 'click', fastSorting);
	}
}

//Повторяет пройденную сортировку (возращает значение в первоначальный вид и запускает заново)
function repeat(){
	timer = 2000;
	numbersSort = [];
	numbersSort = numbers.slice();
	document.querySelector('.sort').remove();
	let variant = this.getAttribute('data-variant');

	if (variant === '3') {
		indexTree = 0;
		indexOrder = 0;
		let width = Number(this.getAttribute('data-width'));
		createTree(width, 'stop', 'Остановить');
		document.querySelector('.nav .nav__faster').style.display = 'block';
		document.querySelector('.nav .nav__slower').style.display = 'block';
		starTree();
	}else{
		tempFlag = true;
		globalFlag = true;
		if (variant === '1') {
			createShelf('stop', 'Остановить');
			document.querySelector('.sortBook__move').classList.add('sortBook__move_active');
		}else if (variant === '2') {
			createDiagram('stop', 'Остановить');
			document.querySelector('.sortDiagram__container_begin').style.display = 'block';
			document.querySelector('.sortDiagram__container').classList.add('sortDiagram__container_active');
		}
		document.querySelector('.nav .nav__faster').style.display = 'block';
		document.querySelector('.nav .nav__slower').style.display = 'block';
		step(bubble); 
	}
}

//Удаляет ненужные компоненты после сортировки
function endSorting(variant){
	removeEvent('.nav .nav__start', 'click', relaySorting);
	removeEvent('.nav .nav__faster', 'click', fastSorting);
	removeEvent('.nav .nav__slower', 'click', slowerSorting);
	document.querySelector('.nav .nav__start').remove();
	document.querySelector('.nav .nav__faster').remove();
	document.querySelector('.nav .nav__slower').remove();
	if (variant === 1 || variant === 2) {
		document.querySelector('.nav .nav__repeat').style.display = 'block';
	}else if (variant === 3){
		document.querySelector('.sort .tree__scale_none').classList.remove('tree__scale_none');
	}
}

//Создает страницу сортировки (дизайн гисторамма)
function createDiagram(dataAct = 'start', dataText = 'Начать'){
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
			<nav class="tree__nav nav">
				<button class="btn nav__button nav__repeat" data-variant="2" style="display: none;">Повторить</button>
				<button class="btn nav__button nav__start" data-act="${dataAct}" data-variant="2">${dataText}</button>
				<button class="btn nav__button nav__back" data-variant="2">Вернуться в меню</button>
				<button class="btn nav__button nav__faster" data-variant="2">Быстрее</button>
				<button class="btn nav__button nav__slower" data-variant="2">Медленнее</button>
			</nav>
		</div>
	`;

	let wrapper = document.querySelector('.wrapper');
	wrapper.style.width = width + 'px';
	wrapper.append(sort);
	eventDefault();
}

//Пузырьковая сортировка
function bubble(){
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
	 endSorting(1);
}


/**
 * Меняет элементы местами при пузырьковой сортировки + добавляет эффекты смены элементов
 * @param {one} - index - первого элемента
 *	@param {two} - index - второго элемента
 */
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
	//Переход на следующий шаг
	step(bubble);
}


/**
 * Вызывает шаг с задержкой timer
 * @param {func} - вызов функции после задержки
*/

function step(func){
	if (tempFlag === true && globalFlag === true) {
		setTimeout(func, timer);
	}
	if (globalFlag === false) {
		endSorting(3);
	}
}

/**
 * Создает страницу сортировки бинарным деревом
 * @param {width} - ширина элемента, в котором будут отображаться элементы
 * @param {dataAct,dataText} - В зависимости как был вызван метод createTree, то кнопка nav__start может иметь значения начать или остановить
*/
function createTree(width = window.innerWidth, dataAct = 'start', dataText = 'Начать'){
	numbersSort = numbers;
	let sort = document.createElement('div');
	sort.className = 'sort sort_minWidth';
	sort.style.width = '100%';
	let itemsBegin = '';
	let itemsEnd = '';
	let minWidth = 60*numbersSort.length;
	for (let i = 0; i < numbersSort.length; i++){
		itemsBegin += `<span class="tree__number tree_flex">${numbersSort[i]}</span>`;
		itemsEnd += `<span class="tree__number tree_flex"></span>`;
	}
	sort.innerHTML = ` 
		<div class="sortTree tree tree_flex">
			<div class="tree__begin tree_flex">
				${itemsBegin}
			</div>	
			<div class="tree-container" style="width: ${width-80}px; min-width: ${minWidth-80}px">
			</div>
			<div class="tree_end tree_flex">
				${itemsEnd}
			</div>
			<nav class="tree__nav nav">
				<button class="btn nav__button nav__start" data-act="${dataAct}" data-variant="3">${dataText}</button>
				<button class="btn nav__button nav__back" data-variant="3">Вернуться в меню</button>
				<button class="btn nav__button nav__faster" data-variant="3">Быстрее</button>
				<button class="btn nav__button nav__slower" data-variant="3">Медленнее</button>
			</nav>
			<nav class="tree__scale nav tree__scale_none">
				<button class="btn nav__button nav__repeat" data-variant="3" data-width="${width}">Повторить</button>
				<button class="btn nav__button nav__increase" data-width="${width}">Увеличить</button>
				<button class="btn nav__button nav__reduce" data-width="${width}">Уменьшить</button>
			</nav>
		</div>
	`;
	let wrapper = document.querySelector('.wrapper');
	wrapper.style.width = width + 'px';
	wrapper.style.minWidth  = minWidth + 'px';
	wrapper.append(sort);
	eventDefault();
	//Добавляет действия при маштабировании
	//Так как мы не знаем, как будут располагаться элементы в дереве, то решил сделать кнопку увеличение и уменьшение масштаба
	//Мы может определить максимальный уровень вложности, но даже при уровне вложности = 6, ширина экрана будет 2560px, что совсем не очень смотриться, 
	//но скорее всего на 2560px (6 уровень) будет лежать всего один элемент, поэтому первоначально выводить такой размер не логично
	//поэтому реализована функция увеличение ширины экрана
	addEvent('.nav .nav__increase', 'click', increaseTree);
	addEvent('.nav .nav__reduce', 'click', reduceTree);
	tree = {};
	indexTree = 0;
	indexOrder = 0;
}


//Заново создает дерево в увеличенном экране
function increaseTree(){
	timer = 0;
	indexTree = 0;
	indexOrder = 0;
	numbersSort = numbers;
	let width = Number(this.getAttribute('data-width'));
	document.querySelector('.sort').remove();
	createTree(width+500);
	starTree();
}

//Заново создает дерево в уменьшенном экране
function reduceTree(){
	timer = 0;
	indexTree = 0;
	indexOrder = 0;
	numbersSort = numbers;
	let width = Number(this.getAttribute('data-width'));
	document.querySelector('.sort').remove();
	createTree(width-500);
	starTree();
}

//Создает первоначальное дерево с первым элементом
function starTree(){
	//Если мы останавливали сортировку, то пропускаем первый шаг
	if (indexTree === 0) {
		document.querySelectorAll('.tree__begin .tree__number')[0].classList.add('tree__number_gray');
		tree = {
			value : numbersSort[0],
			id : Math.random().toString(32).slice(2),
			position : ''
		};
		//Создает узел
		createKnot('', tree.value, tree.id);
	}
	//Вызывает задержку при создании дерева
	starTreeTime();
}

function starTreeTime(){
	let begin = document.querySelectorAll('.tree .tree__number');
	setTimeout(() => {
		if (globalFlag === false) {
			return;
		}
		indexTree++;
		if (indexTree >= numbersSort.length) {
			numbersSort = [];
			//Если дерево построено, то вызывает рекурсивный обход дерева для сортировки
			treeOrder(tree);
			//Вызывает задержку при занесении значения в упорядочный массив
			orderAnimate();
			return;
		}
		begin[indexTree].classList.add('tree__number_gray');
		//Заносит новый элемент в дерево
		buildTree(numbersSort[indexTree], tree);
		starTreeTime();
	}, timer);
}

/**
 * Заносит новый элемент в объект рекурсивным способом
 * @param {num} - число, которое нужно занести
 * @param {obj} - объект или часть объекта в которое занесется число num, когда дойдет до нужной позиции
 * @description {obj.value} - значение в узле дерева
 * @description {obj.id} - id по которому можно найти этот элемент в DOM
 * @description {obj.posiition} - путь к элементу 
 * @description {obj.left, obj.right} - левые и правые дочерние элементы
*/
function	buildTree(num, obj){
	if (num >= obj.value) {
		if (typeof(obj.right) === 'undefined') {
			obj.right = {
				value : num,
				id : Math.random().toString(32).slice(2),
				position : obj.position +' right',
			};
			createKnot(obj.right.position, obj.right.value, obj.right.id);
		}else{
			obj.right = buildTree(num, obj.right);
		}
	}else if (num < obj.value) {
		if (typeof(obj.left) === 'undefined') {
			obj.left = {
				value : num,
				id : Math.random().toString(32).slice(2),
				position : obj.position + ' left',
			};
			createKnot(obj.left.position, obj.left.value, obj.left.id);
		}else{
			obj.left = buildTree(num, obj.left);
		}
	}
	return obj;
}

/**
 * Отрисовывает узел в DOM
 * @param {position} - путь к элементу
 * @param {num} - значение элемента
 * @param {id} - data-id элемента
*/
function createKnot(position, num, id){
	let container = document.querySelector('.tree-container');
	let positionItems = position.split(' ');
	//Определние положения узла, который строим
	let knot = {
		top : (positionItems.length-1) * 40,
		left : 50,
	};
	//Определние прошлого узла
	let lastKnot = {
		top : (positionItems.length-2) * 40,
		left : 50,
	};
	let delta = 50;

	for (let i = 1; i < positionItems.length; i++){
		if (positionItems[i] === 'left') {
			knot.left -= delta/2;
		}else if(positionItems[i] === 'right'){
			knot.left += delta/2;
		}
		delta = delta/2;
		if (i !== positionItems.length - 1) {
			lastKnot.left = knot.left;
		}
	}
	//Если высота элемента больше, чем высота контейнера, то увеличивает контейнер (Единственный минус: сбиваются положения веток)
	if (document.querySelector('.tree-container').offsetHeight - knot.top < 50) {
		document.querySelector('.tree-container').style.height = document.querySelector('.tree-container').offsetHeight + 50 + 'px';
	}

	let knotHtml = `<div data-id="${id}" class="tree-container__knot" style="left:${knot.left}%; top:${knot.top/container.offsetHeight * 100}%;">${num}</div>`;
	container.innerHTML += knotHtml;
	if (position !== '') {
		//Если позиция элемента не первое, то отрисовывает линию между узлом1 и узлом2
		renderBranch(lastKnot.top, lastKnot.left, knot.top, knot.left);
	}
}	

/**
 * Отрисовывает ветку в DOM
 * @param {lastTop,lastLeft} - позиция первого узла
 * @param {top,left} - позиция второго узла
*/
function renderBranch(lastTop,lastLeft,top,left){
	let container = document.querySelector('.tree-container');
	let widthContainer = container.offsetWidth;
	//Перевод в px
	lastLeft = lastLeft*widthContainer / 100;
	left = left*widthContainer / 100;
	//Длина ветки, катета1 и катета2 для определние угла
	let height = Math.sqrt(Math.pow(lastTop - top, 2) + Math.pow(lastLeft - left, 2)) - 20;
	let cathet1 = top - lastTop;
	let cathet2 = lastLeft - left;
	let deg = Math.atan(cathet1/cathet2)*180/Math.PI;

	if (deg >= 0) {
		deg = 90-deg;
		lastLeft -= 10;
	}else{
		deg = -90-deg;
		lastLeft += 10;
	}

	lastTop += 25;
	//Переводит в проценты, для того, чтобы положение начало ветки оставалась неизменной, если будет изменяться высота контейнера
	lastLeft = lastLeft/widthContainer * 100;
	height = height/container.offsetHeight * 100;
	lastTop = lastTop/container.offsetHeight * 100;
	branch.height = height;

	let branchHtml = `<div data-branch="${branch.index}" class="tree-container__branch" style="left:${lastLeft}%; top:${lastTop}%; height:0px; transform:rotate(${deg}deg);"></div>`;
	container.innerHTML += branchHtml;
	
	//Вставка длины ветки через некоторое время, чтобы была анимация высоты
	setTimeout(() => {
		document.querySelector(`.sort .tree-container [data-branch="${branch.index}"]`).style.height = branch.height + '%';
		branch.index++;
	}, timer/5);
}

//Обходит дерево и заносит в numbersSort id элементов в упордоченном состоянии
function treeOrder(obj){
	if (typeof(obj) === 'undefined') {
		return;
	}
	treeOrder(obj.left);
	numbersSort.push(obj.id);
	treeOrder(obj.right);
}

//Создает анимацию обхода дерева
function orderAnimate(){
	let container = document.querySelector('.tree-container'),
		 treeEnd = document.querySelectorAll('.tree_end .tree__number');
	orderAnimateTime(container, treeEnd);
}

//Заносит значение элемента в нижнюю строку в упорядоченном виде 
function orderAnimateTime(container, treeEnd){
	setTimeout(() => {
		if (globalFlag === false) {
			return;
		}
		document.querySelectorAll('.tree-container__knot_active').forEach(knot => knot.classList.remove('tree-container__knot_active'));
		if (indexOrder >= numbersSort.length) {
			endSorting(3);
			return;
		}else{
			let knot = container.querySelector(`[data-id="${numbersSort[indexOrder]}`);
			knot.classList.add('tree-container__knot_active');
			treeEnd[indexOrder].innerText = knot.innerText;
			indexOrder++;
			orderAnimateTime(container, treeEnd);
		}
	}, timer);
}

//Создает модальное окно инструкции
function createModal(){
	let modal = document.createElement('div');
	modal.className = 'modal';
	modal.innerHTML = ` 
      <button class="modal__close">
      	<svg class="modal__close_icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g><line class="cls-1" x1="7" x2="25" y1="7" y2="25"/><line class="cls-1" x1="7" x2="25" y1="25" y2="7"/></g></svg>
      </button>
      <div class="modal-content">
       	<div class="instruction">
       		<div class="instruction__header">Сортировка чисел</div>
       		<div class="instruction__text">Числа можно задать двумя вариантами <span class="instruction_uppercase">рандомно</span> и <span class="instruction_uppercase">вручную</span>.</div>
       		<div class="instruction__text">Если вы выбрали ВРУЧНУЮ: введите числа от -1000 до 1000 через запятую без пробелов. Максимальное количество чисел 20. Можно очистить поле ввода.
   			Если вы выбрали РАНДОМНО, то числа сгенерируются от -1000 до 1000.</div>
   			<div class="instruction__text"></div>

   			<ol class="instruction__ol">
   				<span class="instruction__ol_title">Если вы выбрали РАНДОМНО, то числа сгенерируются от -1000 до 1000. Можно настроить фильтры:</span> 
               <li class="instruction__li">Все числа</li>
               <li class="instruction__li">Только отрицательные</li>
               <li class="instruction__li">Только положительные</li>
             </ol>
             <div class="instruction__text">Также можно задавать количество чисел, максимально 20.
   			Представлены два метода анимации сортировки</div>
   			<ol class="instruction__ol">
   				<span class="instruction__ol_title">Представлены два метода анимации сортировки:</span> 
               <li class="instruction__li">
               	<span class="instruction__li_title">Сортировка пузырьком</span>
               	<span class="instruction__li_text">Алгоритм состоит из повторяющихся проходов по сортируемому массиву. За каждый проход элементы последовательно сравниваются попарно и, если порядок в паре неверный, выполняется обмен элементов. Проходы по массиву повторяются N-1 раз или до тех пор, пока на очередном проходе не окажется, что обмены больше не нужны, что означает — массив отсортирован. При каждом проходе алгоритма по внутреннему циклу, очередной наибольший элемент массива ставится на своё место в конце массива рядом с предыдущим «наибольшим элементом», а наименьший элемент перемещается на одну позицию к началу массива («всплывает» до нужной позиции, как пузырёк в воде — отсюда и название алгоритма).</span>
            	</li>
               <li class="instruction__li">
               	<span class="instruction__li_title">Сортировка бинарным деревом</span>
               	<span class="instruction__li_text">Универсальный алгоритм сортировки, заключающийся в построении двоичного дерева поиска по ключам массива (списка), с последующей сборкой результирующего массива путём обхода узлов построенного дерева в необходимом порядке следования ключей. Данная сортировка является оптимальной при получении данных путём непосредственного чтения из потока (например, файла, сокета или консоли).</span>
               	<div class="instruction__imgContainer">
               		<img class="instruction__img" src="img/binary_search.png" alt="Пример двоичного дерева">
               	</div>
               </li>	
               
            </ol>
            <div class="instruction__text">Время шага по умолчанию 2 секунды. Во время сортировки время задержки можно уменьшить или увеличить. Минимальная задержка 500 мс. Максимальная – 16 с. Сортировку можно <span class="instruction_uppercase">остановить</span> и <span class="instruction_uppercase">продолжить</span>. Закончить сортировку можно досрочно и выйти на главный экран.</div>
            <div class="instruction__text">После сортировки можно <span class="instruction_uppercase">повторить</span> сортировку с данными числами или <span class="instruction_uppercase">выйти</span> на данный экран.</div>
            <div class="instruction__text">После сортировки бинарным деревом, если узлы налезают друг на друга можно увеличить масштаб экрана или уменьшить. При этом если нажать на кнопку <span class="instruction_uppercase">повторить</span>, масштаб экрана сохраняется. Масштаб экрана уменьшается/увеличивается на 500 пикселей.</div>
       	</div>
      </div>
	`;
	document.querySelector('body').append(modal);
	let html = document.getElementsByTagName('html')[0],
 		 WidthBefore = html.clientWidth;
 	html.classList.add('html_overflow');
 	let WidthAfter = html.clientWidth;
 	html.style.marginRight = `${WidthAfter-WidthBefore}px`;
 	addEvent('.modal', 'click', removeModal);
}

//Удаляет модальное окно
function removeModal(event){
	if (event.target.classList.contains('modal') || event.target.closest('.modal__close')) {
		removeEvent('.modal', 'click', removeModal);
		let html = document.getElementsByTagName('html')[0];
	   html.classList.remove('html_overflow');
	   html.style.marginRight = '0px'; 	
	   document.querySelector('.modal').remove();
	}
}
