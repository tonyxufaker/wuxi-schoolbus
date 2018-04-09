var Slider = function () {
	return {
		init: function (options) {
			var defaults = {
				speed: 300,
				interval: 3000,
				navigation: false,
				navigationActiveClass: 'active',
				navigationPause: false,
				auto: false,
				loop: true,
				visibleCount: 1,
				prevAfter: function () {},
				prevBefore: function () {},
				prevNextDisabledClass: 'disabled'
			};
			options = $.extend(defaults, options || {});
			var slider = this.slider = options.slider;		
			var sliderWrap = this.sliderWrap = slider.find('.swipe-wrap');
			var sliderItem = this.sliderItem = sliderWrap.find('>div,>li');
			var itemWidth = sliderItem.eq(0).outerWidth() * options.visibleCount;
			var loopCount = Math.ceil(sliderItem.length / options.visibleCount);
			var animateTotalWidth = itemWidth * loopCount;			
			var stop = false;
			var sliding = false;
			var timerId = null;
			var index = 0;
			if (options.navigation) {
				if (options.navList) {
					var navList = options.navList;
				} else {
					var navList = slider.find('.swipe-nav>span');
				}
			}
			sliderWrap.width(animateTotalWidth);
			sliderWrap.css('visibility', 'visible');
			var clear = function () {
				if (timerId) clearTimeout(timerId);
				timerId = null;
			};					
			var go = function () {
				clear();
				if (loopCount > 1) {
					sliding = true;
					var current = sliderWrap.position().left;
					current = current - itemWidth;
					if (Math.abs(current) >= animateTotalWidth) {
						current = 0;
					}
					var _index = current / -itemWidth;
					
					sliderWrap.animate({'left': current + 'px'}, options.speed, function () {
						sliding = false;
						index = _index;
						if (!stop && options.auto) {
							timerId = setTimeout(go, options.interval);
						}
						if (options.navigation) {
							navList.removeClass(options.navigationActiveClass);
							navList.eq(_index).addClass(options.navigationActiveClass);									
						}	
					});
				}
			};
			var goTo = function (_index, func, isPause) {
				clear();
				sliding = true;
				var current = -(itemWidth * _index);
				sliderWrap.stop(true, false).animate({'left': current + 'px'}, options.speed, function () {
					sliding = false;
					index = _index;
					if (!stop && options.auto && !options.navigationPause) {
						timerId = setTimeout(go, options.interval);
					}
					if (options.navigation) {
						navList.removeClass(options.navigationActiveClass);
						navList.eq(_index).addClass(options.navigationActiveClass);									
					}
					if (func && typeof func === 'function') {
						func();
					}
				});						
			};
			
			if (options.prev) {
				if (!options.loop) options.prev.addClass(options.prevNextDisabledClass);	
				options.prev.click(function (e) {
					e.preventDefault();
					var _index = void 0;						
					if (!sliding) {
						if (options.prevBefore && typeof options.nextBefore === 'function') {
							options.nextBefore(index, this, loopCount);
						}
						if (!options.loop && index === 0) return;
						options.next.removeClass(options.prevNextDisabledClass);
						options.prev.removeClass(options.prevNextDisabledClass);								
						if (index === 0) {
							_index = loopCount - 1;
						} else {
							_index = index - 1;
						}
						if (!options.loop && _index === 0) {
							options.next.removeClass(options.prevNextDisabledClass);
							options.prev.addClass(options.prevNextDisabledClass);
						};	
						goTo(_index, Pub.proxy(this, options.prevAfter));
					}		
				});
			}
			if (options.next) {
				if (!options.loop && loopCount === 1) {
					options.next.addClass(options.prevNextDisabledClass);
				}
				options.next.click(function (e) {
					e.preventDefault();
					var _index = void 0;
					if (!sliding) {
						if (options.prevBefore && typeof options.prevBefore === 'function') {
							options.prevBefore(index, this, loopCount);
						}
						if (!options.loop && index === loopCount - 1) return;
						options.next.removeClass(options.prevNextDisabledClass);
						options.prev.removeClass(options.prevNextDisabledClass);									
						if (index === loopCount - 1) {
							_index = 0;
						} else {
							_index = index + 1;
						}
						if (!options.loop && _index === loopCount - 1) {
							options.prev.removeClass(options.prevNextDisabledClass);
							options.next.addClass(options.prevNextDisabledClass);								
						}
						goTo(_index, Pub.proxy(this, options.prevAfter));
					}		
				});					
			}						
			if (options.auto) {
				timerId = setTimeout(go, options.interval);
				sliderItem.hover(function () {
					clear();
					stop = true;
				}, function () {
					stop = false;
					clear();
					timerId = setTimeout(go, options.interval);
				});						
			}
			
			if (options.navigation) {
				navList.mouseenter(function () {
					var $this = $(this);
					if (options.navigationPause) {
						stop = true;
						clear();
					}
					if ($this.hasClass(options.navigationActiveClass)) return;
					var _index = navList.index(this);
					goTo(_index, void 0, options.navigationPause);
					if (options.navCallback && typeof options.navCallback === 'function') {
						options.navCallback.apply(this, [_index]);
					}
					navList.removeClass(options.navigationActiveClass);
					$this.addClass(options.navigationActiveClass);								
				});		
				if (options.navigationPause && options.auto) {			
					navList.mouseleave(function () {
						if (!sliding) {
							clear();
							stop = false;
							timerId = setTimeout(go, options.interval);
						}			
					});
				}
			}					
		}
	}
}