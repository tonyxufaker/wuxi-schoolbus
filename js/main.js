$(function () {
	//首页
	var baseUrl  = $('#base-url').val();
	
	Slider().init({
		slider: $('.index_banner_img'),
		auto: true,
		interval: 5000,
		navigation: true,
		navigationPause: true,
		navList: $('.index_banner_img .nav-box span')
	});
	$('.index_banner_menu li').hover(function () {
		$(this).find('.swipe-img').hide();
		$(this).find('.swipe-text').show();
	}, function () {
		$(this).find('.swipe-text').hide();	
		$(this).find('.swipe-img').show();		
	});
	$('.index_case_con li').hover(function () {
		$(this).find('.index_case_tl').show();
	}, function () {
		$(this).find('.index_case_tl').hide();
	});
	
	//底部
	$("#vote_select_p").change(function () {
		var url = $(this).val();
		if (url != 0) {
			location.href = url;
		}
	});
	
	//服务
	$('.service-banner').each(function () {
		Slider().init({
			slider: $(this),
			auto: true		
		});		
	});
	$('.service-banner .swipe-item').hover(function () {
		$(this).find('.swipe-img').hide();
		$(this).find('.swipe-text').show();
	}, function () {
		$(this).find('.swipe-text').hide();	
		$(this).find('.swipe-img').show();		
	});	
	
        if ($('#flowplayer-box').length) {
	//视频
	flowplayer('flowplayer-box', baseUrl + "/themes/cn/swf/flowplayer-3.2.16.swf", { //modify
		clip: {
			autoPlay: true,
			autoBuffering: true,
			url: $('#video-url').val()
		},
		play: {
			replayLabel: '再次观看'
		},
		onStart: function (clip) {

		},
		onUnload: function () {

		},
		onLoad: function () {     //当播放器载入完成时调用

		},
		onFinish: function () {    //播放完成

		},
		onBeforeFullscreen: function () {},
		onFullscreen: function () {},
		onError:function(status, msg){},
		plugins: {
			controls: {
				bottom: 0,//功能条距底部的距离
				height: 25, //功能条高度
				zIndex: 1,
				play: true, //开始按钮
				volume: true, //音量按钮
				mute: true, //静音按钮
				stop: false,//停止按钮
				fullscreen: true, //全屏按钮
				scrubber: true,//进度条
				time: true, //是否显示时间信息
				autoHide: true, //功能条是否自动隐藏
				//opacity: 0.5, //功能条的透明度
				tooltips: {
					buttons: true,//是否显示
					fullscreen: '全屏',//全屏按钮，鼠标指上时显示的文本
					stop: '停止',
					pause: '暂停',
					play: '开始',
					volume: '音量',
					mute: '静音',
					unmute: '关闭静音',
					next: '下一个',
					previous: '上一个',
					fullscreenExit: '退出全屏'
				}
			}
		}
	});
        }
        //留言
        $('#submit').click(function (e) {
            e.preventDefault();
            var $form = $('#message-form');
            var data = {};
            $form.find('input[name],textarea[name]').each(function () {
                data[$(this).attr('name')] = $(this).val();
            });
            
            $.post('/inter/note', data, function (json) {
               if(json.error == 0){
                   alert('留言成功!');
                $form.find('input[name],textarea[name]').each(function () {
                    $(this).val('');
                });                   
               }
            }, 'json');            
        });
        
	$('.case_list li').hover(function () {
		$(this).find('.case_title').show();
	}, function () {
		$(this).find('.case_title').hide();
	});
    $('.index_case_con li').mouseenter(function(){
        $(this).animate({top:'-25px'},150,function(){
            $(this).animate({top:'-5px'},150,function(){
                $(this).animate({top:'-15px'},100,function(){
                    $(this).animate({top:'-0px'},100);
                });
            });
        });
    });
    $('.case_list li').mouseenter(function(){
        $(this).animate({top:'-25px'},150,function(){
            $(this).animate({top:'-5px'},150,function(){
                $(this).animate({top:'-15px'},100,function(){
                    $(this).animate({top:'-0px'},100);
                });
            });
        });
    });
    $('.index_banner_l a').mouseenter(function(){
        $(this).find('label').hide();
        $(this).find('span').show();
    });
    $('.index_banner_l a').mouseout(function(){
        $(this).find('span').hide();
        $(this).find('label').show();
    });
});

