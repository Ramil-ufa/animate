function range(){
	let item = this.parentElement.querySelector('.range__item'),
		 result = this.parentElement.querySelector('.range__result'),
		 min = isNaN(Number(item.getAttribute('data-min'))) ? 0 : Number(item.getAttribute('data-min')),
		 max = isNaN(Number(item.getAttribute('data-max'))) ? 100 : Number(item.getAttribute('data-max')),
		 step = Number(item.getAttribute('data-step')) || 1;

   //Проверяем шаг на Integer
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
	}
	
	let number = isNaN(Number(this.value)) ? min : Number(this.value);
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
	slider(item, min, max, number);
}

function slider(item, min, max, number){
	let line = item.parentElement;
	let right = line.offsetWidth - item.offsetWidth;   
	item.style.left = (number - min) * right / Math.abs(max-min) + 'px';
}
function startMove(event){
		this.ondragstart = function() {
	      return false;
	   };

	   let item = this,
	   	 dataItem = this.getAttribute('data-sign'),
	   	 min = isNaN(Number(this.getAttribute('data-min'))) ? 0 : Number(this.getAttribute('data-min')),
	   	 max = isNaN(Number(this.getAttribute('data-max'))) ? 100 : Number(this.getAttribute('data-max')),
	   	 step = Number(this.getAttribute('data-step')) || 1,
	   	 line = this.parentElement,
	   	 number = this.closest('.filter__range').querySelector('.range__number'),
	   	 result = this.parentElement.querySelector('.range__result'),
	   	 lineLeft = line.getBoundingClientRect().left + pageXOffset;

	   document.addEventListener('mousemove', move);
	   document.addEventListener('mouseup', endMove);

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
	     	number.value = Math.round(Math.round((min + (newLeft / right) * Math.abs(max - min)) / step) * step * 100) / 100;
	     	result.innerHTML = number.value;      
	   }

	   function endMove(){
	   	document.removeEventListener('mousemove', move);
	   	document.removeEventListener('mouseup', endMove);
	   }
}