'use strict';

/**
 * Создал небольшую библиотеку для ползунка без использования input type=range
 * В DOM достаточно нанести небольшую html разметку:
 * <div class="range">
		<span class="range__title">Число </span>
		<div class="range__line">
			<div class="range__item" data-step="" data-min="" data-max=""></div>
			<div class="range__result"></div>
		</div>
		<input class="range__number" value="" type="text">
	</div> 
 * Минимальное и максимальное значение ползунка задается data-min и data-max соответственно
 * Шаг задается с помощью data-step (Минимальное значение 0.01 можно и меньше [1])
 * Поле range__number для точного ввода необходимого числа
 * Поле range__result отображает результат (так как range__number поле может быть стерто, то значение нужно получить из range__result)
 * Для инициализации необходимо добавить два обработчика:
 * document.querySelector('.range__item').addEventListener('mousedown', startMove);
 * document.querySelector('.range__item').addEventListener('input', range);
 * Ползунок полностью независим и может применяться на странице сколько угодно
*/


//Двигает ползунок и знасить в range__result и range__number значение
function startMove(event){
	//Отменяет событие на перетаскивание 
	this.ondragstart = function() {
      return false;
   };

   // item - ползунок
   // min, max, step - минимальное, максимальное значение и шаг
   // line  - шкала по которому движется ползунок
   // number - поле ввода
   // result - поле вывода результат
   // lineLeft - положение от левого края 
   let item = this,
   	 min = isNaN(Number(this.getAttribute('data-min'))) ? 0 : Number(this.getAttribute('data-min')),
   	 max = isNaN(Number(this.getAttribute('data-max'))) ? 100 : Number(this.getAttribute('data-max')),
   	 step = Number(this.getAttribute('data-step')) || 1,
   	 line = this.parentElement,
   	 number = this.closest('.filter__range').querySelector('.range__number'),
   	 result = this.parentElement.querySelector('.range__result'),
   	 lineLeft = line.getBoundingClientRect().left + pageXOffset;

  	//Подписка на события двидения мыши и отпускания кнопки мыши 	 
   document.addEventListener('mousemove', move);
   document.addEventListener('mouseup', endMove);

   //Высчитывает координаты от края экрана и заносит в результат и в поле ввода
   function move(event){
   	let right = line.offsetWidth - item.offsetWidth;   
   	let newLeft = event.pageX - lineLeft;
   	   
      if(newLeft < 0) {
      	newLeft = 0;
      }
      if (newLeft > right) {
      	newLeft = right;
      }
      item.style.left = newLeft + 'px';
      //Основная функция, чтобы уменьшить шаг до 0.001, то необходимо заменить 100 на 1000 [1]
      //умножение на 1000 и потом деление нужно, чтобы не был результат 1.000000013
     	number.value = Math.round(Math.round((min + (newLeft / right) * Math.abs(max - min)) / step) * step * 100) / 100;
     	result.innerHTML = number.value;      
   }

   //Удаляет обработчики при отпускании кнопки мыши
   function endMove(){
   	document.removeEventListener('mousemove', move);
   	document.removeEventListener('mouseup', endMove);
   }
}

//Обрабатывает поле ввода range
function range(){
	let item = this.parentElement.querySelector('.range__item'),
		 result = this.parentElement.querySelector('.range__result'),
		 min = isNaN(Number(item.getAttribute('data-min'))) ? 0 : Number(item.getAttribute('data-min')),
		 max = isNaN(Number(item.getAttribute('data-max'))) ? 100 : Number(item.getAttribute('data-max')),
		 step = Number(item.getAttribute('data-step')) || 1;

   //Проверяет шаг на Integer
	if ( (step ^ 0) === step ) {
		this.value = this.value.replace(/[^\d-]/g, '');
	}else{
		this.value = this.value.replace(/[^\d-.]/g, '');
	}
	
	//Удаляет лишние минусы
	if (this.value.lastIndexOf('-') > 0 || (min >= 0 && this.value.lastIndexOf('-') === 0) ) {
		this.value = this.value.slice(0, this.value.lastIndexOf('-')) + this.value.slice(this.value.lastIndexOf('-') + 1);
	}

	//Удаляет лишние 0
	if ((this.value[0] === '0' && this.value[1] !== '.' && this.value.length > 1) || (this.value[0] === '-' && this.value[1] === '0' && this.value[2] !== '.' && this.value.length > 2)) {
		this.value = '0';
	}

	//Удаляет лишние точки
	if (this.value.lastIndexOf('.') !== this.value.indexOf('.') || this.value.indexOf('.') === 0) {
		this.value = this.value.slice(0, this.value.lastIndexOf('.')) + this.value.slice(this.value.lastIndexOf('.') + 1);
	}

	//Удаляет лишние символы после точки
	if (this.value.lastIndexOf('.') !== -1 && this.value.lastIndexOf('.') !== this.value.length - 1) {
		//Если шаг у нас десятичный
		if (step.toString().length === 3) {
			this.value = Number(this.value).toFixed(1);
		}
		//Если шаг у нас сотый
		if (step.toString().length === 4 && this.value.lastIndexOf('.') < this.value.length - 2) {
			this.value = Number(this.value).toFixed(2);
		}
		//Если шаг меньше, то необходимо описать еще условия
	}
	

	let number = isNaN(Number(this.value)) ? min : Number(this.value);
	//Проверяет не выходит ли введенное значение за пределы
	if (number < min) {
		if (min < 0) {
			this.value = min;
		}
		number = min;
	}else if (number > max) {
		this.value = max;
		number = max;
	}
	result.innerHTML = number;
	//Двигает ползунок
	slider(item, min, max, number);
}

/**
 * Двигает ползунок от края
 * @param {item} - ползунок
 * @param {min,max} - минимальное и максимальное значение
 * @param {number} - Введенное число
*/
function slider(item, min, max, number){
	let line = item.parentElement;
	let right = line.offsetWidth - item.offsetWidth;   
	item.style.left = (number - min) * right / Math.abs(max-min) + 'px';
}

