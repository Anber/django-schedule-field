if (!Array.prototype.map)
{
	Array.prototype.map = function(fun /*, thisp*/)
	{
		var len = this.length;
		if (typeof fun != "function")
			throw new TypeError();

		var res = new Array(len);
		var thisp = arguments[1];
		for (var i = 0; i < len; i++)
		{
			if (i in this)
				res[i] = fun.call(thisp, this[i], i, this);
		}

		return res;
	};
}

Array.prototype.max = function() {
	var max = this[0];
	var len = this.length;
	for (var i = 1; i < len; i++) if (this[i] > max) max = this[i];
	return max;
};

Array.prototype.min = function() {
	var min = this[0];
	var len = this.length;
	for (var i = 1; i < len; i++) if (this[i] < min) min = this[i];
	return min;
};

(function($) {
	$.fn.schedule = function(options) {
		var defaults = {
			'days': ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
			'serializer': function(val) {
				var res = [];
				val.map(function(el, i) {
					res.push(el.day+'_'+el.hour);
				});
				return res.join(',');
			},
			'deserializer': function(val) {
				var res = [];
				if (!val) return res;
				val.split(',').map(function(el, i) {
					var item = el.split('_');
					res.push({ 'day': item[0], 'hour': item[1] });
				});
				return res;
			}
		};
		var opts = $.extend(defaults, options);

		this.map(function(i, el) {
			var field = $(el);
			// Значение
			var val = function() {
				var val = [];
				$('.work', hours).map(function(i, el) {
					val.push({
						'day': parseInt($(el).attr('data-day')),
						'hour': parseInt($(el).attr('data-hour'))
					});
				});
				return val;
			}

			// Сериализатор и десериализатор
			var serializer = opts['serializer'];
			var deserializer = opts['deserializer'];

			// Сохраняет значение в поле
			var setValue = function() {
				$(field).val(serializer(val()));
				$(field).change();
			}

			// Выгружает значение из поля
			var getValue = function() {
				$('.hover', hours).removeClass('hover work');
				var marked = deserializer($(field).val());
				marked.map(function(el, i) {
					hours_index[el.day + '_' + el.hour].addClass('work');
				});
			}

			// Закрытие контекстного меню
			var close_context_menu = function() {
				context_menu.fadeOut(200);
				$('.hover', hours).removeClass('hover');
			};

			// Пометить часы как рабочие
			var mark_as_work = function() {
				$('.hover', hours).addClass('work');
				close_context_menu();
				setValue();
			};

			// Пометить часы как нерабочие
			var mark_as_off = function() {
				$('.hover', hours).removeClass('work');
				close_context_menu();
				setValue();
			};

			// Инвертировать
			var invert = function() {
				$('.hover', hours).toggleClass('work');
				close_context_menu();
				setValue();
			}

			// Скрываем поле ввода
			field.hide();

			// Создаём wrapper для всего виджета
			var wrapper = $('<div></div>').addClass('schedule-widget');
			field.before(wrapper);

			// Создаём контекстное меню
			var context_menu = $('<div></div>').addClass('schedule-context-menu').hide();
			context_menu.append($('<a href="javascript:void(0);">Рабочее время</a>').addClass('button').click(mark_as_work));
			context_menu.append($('<a href="javascript:void(0);">Нерабочее время</a>').addClass('button').click(mark_as_off));
			context_menu.append($('<a href="javascript:void(0);">Инвертировать</a>').addClass('button').click(invert));
			context_menu.append($('<a href="javascript:void(0);">Отмена</a>').addClass('button').click(close_context_menu));
			$('body').append(context_menu);

			// Верхняя левая ячейка
			wrapper.append($('<div></div>').addClass('cell blank'));

			// Строка со списком часов
			for (var h = 0; h < 24; h++) {
				wrapper.append($('<div>' + h + '</div>').addClass('cell header').attr('data-hour', h));
			}

			// Wrapper для сетки
			var hours = $('<div></div>').addClass('hours');
			wrapper.append(hours);

			// Индекс
			var hours_index = {};

			// Строим сетку
			opts['days'].map(function(day, i) {
				for (var h = 0; h < 24; h++) {
					hours_index[i+'_'+h] = $('<div></div>').addClass('cell hour').attr('data-day', i).attr('data-hour', h)
					hours.append(hours_index[i+'_'+h]);
				}
			});

			// Столбик с названиями дней недели
			opts['days'].map(function(day, i) {
				wrapper.append($('<div>' + day + '</div>').addClass('cell header').attr('data-day', i));
			});

			// Инициализация переменных
			var mousedown = false;
			var prev_cell = null;
			var start_cell = null;
			var end_cell = null;

			// Блокируем выделение
			$(hours).bind('selectstart', function() {
				return false;
			});

			// Нажали кнопку мышки
			$(hours).mousedown(function(ev) {
				mousedown = true;
				start_cell = end_cell = prev_cell = ev.target;
				$('.hover', hours).removeClass('hover');
				$(prev_cell).addClass('hover');
				return false;
			});

			// Перемещаем мышку
			$(hours).mousemove(function(ev) {
				if (!mousedown || prev_cell == ev.target) return true;
				end_cell = prev_cell = ev.target;

				var days_val = [
					parseInt($(start_cell).attr('data-day')),
					parseInt($(end_cell).attr('data-day'))
				];
				var hours_val = [
					parseInt($(start_cell).attr('data-hour')),
					parseInt($(end_cell).attr('data-hour'))
				];

				$('.hover', hours).removeClass('hover');
				for (var d = days_val.min(); d <= days_val.max(); d++) {
					for (var h = hours_val.min(); h <= hours_val.max(); h++) {
						hours_index[d+'_'+h].addClass('hover');
					}
				}
				return false;
			});

			// Отпустили кнопку мышки
			$('body').mouseup(function(ev) {
				if (!mousedown) return true;
				mousedown = false;
				start_cell = end_cell = prev_cell = null;
				context_menu.css({ top: ev.pageY, left: ev.pageX }).fadeIn(200);
				return false;
			});

			// Отрисовываем содержимое поля в сетку
			getValue();
		});
	};
})(jQuery);

$(function() {
	$('[data-widget=schedule]').schedule();
});
