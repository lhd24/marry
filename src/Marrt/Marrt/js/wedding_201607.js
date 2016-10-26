/**
 * qyPoster - v3.4.0 - 2015-05-14
 *
 *
 * Copyright (c) 2015
 * Licensed MIT <>
 */
var Cookie = {};
Cookie.set = function(name,value,exptime,path,domain){
    var exp  = new Date();
    exp.setTime(exp.getTime() + exptime*1000);
	if(!path) path='/';
	cookiestr = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	cookiestr+=';path='+path;
	if(domain) cookiestr+=';domain='+domain;
    document.cookie = cookiestr;
}
Cookie.get = function(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
     if(arr != null) return unescape(arr[2]); return null;
}
var id_user=Cookie.get('wp_visitor');
if (!id_user){
	id_user=Cookie.get('PHPSESSIDB');
	Cookie.set('wp_visitor',id_user,8640000);
}
var zan_msg={'successmsg':'点赞成功！','haszanmsg':'您已经赞过了，亲！','errmsg':'非法操作','erroruid':'操作失败，请刷新重试'}
function showCheckMessage(msg, error) {
	if (error) {
		$('.u-note-error').html(msg);
		$(".u-note-error").addClass("on");
		$(".u-note-sucess").removeClass("on");
		setTimeout(function(){
			$(".u-note").removeClass("on");
		},2000);
	} else {
		$(".u-note-sucess").html(msg).addClass("on");
		$(".u-note-error").removeClass("on");
		setTimeout(function(){
			$(".u-note").removeClass("on");
		},2000);
	}
}
function mobilecheck() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(navigator.userAgent) || screen.width < 500
}
function isWeixin() {
	var a = navigator.userAgent.toLowerCase();
	return "micromessenger" == a.match(/MicroMessenger/i) ? !0 : !1
}
function isAndroid() {
	var a = navigator.userAgent,
		b = (navigator.appVersion, a.indexOf("Android") > -1 || a.indexOf("Linux") > -1);
	return b
}
function countCharacters(a) {
	for (var b = 0, c = 0; c < a.length; c++) {
		var d = a.charCodeAt(c);
		d >= 1 && 126 >= d || d >= 65376 && 65439 >= d ? b++ : b += 2
	}
	return b
}
function playVideo(a) {
	if (a) {
		if (a.bgAudio){
			var b = $("#media"),
				c = $("#audio_btn"),
				d = $("#yinfu"),
				e = "1" == a.bgAudio.type ? a.bgAudio.url : PREFIX_FILE_HOST + a.bgAudio.url;
			b.attr("src", e), c.addClass("video_exist"), b.bind("canplay", function() {
				b.get(0).play()
			}).bind("play", function() {
				c.addClass("play_yinfu").removeClass("off"), d.addClass("rotate")
			}).bind("pause", function() {
				c.addClass("off").removeClass("play_yinfu"), d.removeClass("rotate")
			}), c.show().click(function() {
				$(this).hasClass("off") ? (b.get(0).play(), utilSound.pause()) : b.get(0).pause()
			})
		}
		if (a.mvSrc){
			var mvbtn=$('#video_btn,#video_side'),video_show_iframe=$('#video_show_iframe');
			mvbtn.attr('rel',a.mvSrc).show().click(function(){
				var e=$(this);
				$('#video_iframe_area iframe').attr('src',e.attr('rel'));
				$('#video_show_iframe').show();
				e.hide();
				b.get(0).pause()
			});
			video_show_iframe.find('b').click(function(){
				$('#video_show_iframe iframe').attr('src','');
				video_show_iframe.hide();
				$('#video_iframe_area').html('<iframe frameborder="0" width="100%" height="100%" scrolling="no" ></iframe>');
				$('#video_btn,#video_side').show();
				b.get(0).play()
			});
		}
		if (a.zanInfo.setting){
			var zan=$('#zan_icon,#side_zan_icon'),zan_num=$('#zan_icon span'),zan_dza=$('#zan_style_02'),side_dza=$('#side_like_d');
			zan_num.html(a.zanInfo.data[0]);
			zan_dza.html(a.zanInfo.data[0]+1);
			side_dza.html(a.zanInfo.data[0]+1);
			for (var msgk in zan_msg){
				if (a.zanInfo.setting[msgk]){
					zan_msg[msgk]=a.zanInfo.setting[msgk];
				}
			}
			if (a.zanInfo.setting.icon_sta==1){
				zan.addClass('zan_0'+a.zanInfo.setting.icon_pos);
				zan.show();//.css(a.zanInfo.setting.css)
			}else{
				zan.addClass('zan_00');
			}
		}
	}
}
function show_add(i){
	var zan=$(i);
	var x=1;
	$.ajax({
		type:'post',
		url:'/ajxzqj/'+mainid+'.html',
		dataType:'json',
		data:{'uid':id_user},
		success:function(d){
			if (d.msg=='ok'){
				show_oper(zan,1,d.num);
				show_oper($('.zan_icon_p'),3,d.num);
				//showCheckMessage(zan_msg.successmsg);
				$('#zan_style_02').show().addClass('zan_dianzhan').delay(2000).fadeOut();
			}else if(d.msg=='has_zan'){
				showCheckMessage(zan_msg.haszanmsg);
			}else if(d.msg=='error_uid'){
				showCheckMessage(zan_msg.erroruid);
			}else{
				showCheckMessage(d);
			}
		}
	});
}
function show_side(i){
	var zan=$(i);
	var x=1;
	$.ajax({
		type:'post',
		url:'/ajxzqj/'+mainid+'.html',
		dataType:'json',
		data:{'uid':id_user},
		success:function(d){
			if (d.msg=='ok'){
				//show_oper(zan,1,d.num);
				show_oper($('.zan_icon_p'),3,d.num);
				$('#side_like').show();
			}else if(d.msg=='has_zan'){
				showCheckMessage(zan_msg.haszanmsg);
			}else if(d.msg=='error_uid'){
				showCheckMessage(zan_msg.erroruid);
			}else{
				showCheckMessage(d);
			}
		}
	});
}
//$('#zan_style_02').fadeIn(500);
//$('#zan_style_02').delay(2000).fadeOut(1000);
function show_oper(zan,sta,now){
	zan.find('span').html(now);
	if (sta==1){
		var e=zan.find('b.addone');
		e.show().addClass('animated-z fadeOutUp');
		setTimeout(function(){
			e.hide().removeClass('animated-z fadeOutUp');
		},900);
	}else if(sta==2){
		var e=zan.find('b.removeone');
		e.show().addClass('animated-z fadeOutDown');
		setTimeout(function(){
			e.hide().removeClass('animated-z fadeOutDown');
		},900);
	}
}
function renderPage(a, b, c) {
	a.templateParser("jsonParser").parse({
		def: c[b - 1],
		appendTo: "#page" + b,
		mode: "view"
	});
	var d, e, f = 1,
		g = $(".z-current").width(),
		h = $(".z-current").height();
	imageWidth = $(".m-img").width();
	imageHeight = $(".m-img").height();
	g / h >= 320 / 520 ? (f = h / 520, d = (g / f - 320) / 2) : (f = g / 320, e = (h / f - 520) / 2);
	e && $(".edit_area").css({marginTop: e});
	if (tplCount == c.length){
		$("#qyMobileViewport").attr("content", "width=320, initial-scale=" + f + ", maximum-scale=" + f + ", user-scalable=no,target-densitydpi=device-dpi");
		320 != clientWidth && clientWidth == document.documentElement.clientWidth || isWeixin() && (navigator.userAgent.indexOf("Android") > -1 || navigator.userAgent.indexOf("Linux") > -1);
		var i = 320 / g,
			j = 520 / h,
			k = Math.max(i, j),size=1/i;
		if (zeroMode==2){
			document.body.style.cssText = document.body.style.cssText + '; -webkit-transform: scale(' + size + '); ';
			//k = k > 1 ? k : 160 * k, k = parseInt(k), $("#qyMobileViewport").attr("content", "width=320, user-scalable=no, target-densitydpi=" + k)
		}
	}
}!
function(a) {
	function b() {
		var a = {};
		this.addInterval = function(b, c) {
			a[b] = c
		}, this.deleteInterval = function(b) {
			a[b] && (clearInterval(a[b]), delete a[b])
		}, this.clearInterval = function() {
			for (var b in a) this.deleteInterval(b)
		};
		var b = [{
			value: 1,
			desc: "轮播",
			name: "slide"
		}, {
			value: 2,
			desc: "下落",
			name: "bars"
		}, {
			value: 3,
			desc: "百页窗",
			name: "blinds"
		}, {
			value: 4,
			desc: "消隐",
			name: "blocks"
		}, {
			value: 5,
			desc: "渐变",
			name: "blocks2"
		}, {
			value: 9,
			desc: "梳理",
			name: "zip"
		}, {
			value: 11,
			desc: "翻转",
			name: "bars3d"
		}, {
			value: 13,
			desc: "立方体",
			name: "cube"
		}, {
			value: 14,
			desc: "棋盘",
			name: "tiles3d"
		}, {
			value: 16,
			desc: "飞出",
			name: "explode"
		}, {
			value: 17,
			desc: "闪出",
			name: "flash"
		}];
		this.getPicStyle = function(a) {
			if (void 0 === a) return b;
			for (var c = 0; c < b.length; c++) if (a == b[c].value) return b[c]
		}
	}
	a.utilPictures = new b
}(window), function(a) {
	function b() {
		var a = {
			CLICK: {
				name: "click",
				value: 1
			}
		},
			b = {
				SHOW: {
					name: "show",
					value: 1
				}
			};
		this.getSendType = function(b) {
			if (void 0 === b) return a;
			for (var c in a) if (b === a[c].value) return a[c];
			return null
		}, this.getHandleType = function(a) {
			if (void 0 === a) return b;
			for (var c in b) if (a === b[c].value) return b[c];
			return null
		}
	}
	a.utilTrigger = new b
}(window), function(a) {
	function b() {
		function a() {
			b || (b = new Audio)
		}
		var b, c;
		this.play = function(d) {
			a();
			var e = d.substr(d.lastIndexOf("/") + 1),
				f = b.src.substr(d.lastIndexOf("/") + 1);
			e == f && c ? (b.pause(), c = !1) : e != f || c ? (b.src = d, b.play(), c = !0) : (b.play(), c = !0)
		}, this.pause = function() {
			b && (b.pause(), c = !1)
		}
	}
	a.utilSound = new b
}(window), function(a) {
	function b(a) {
		function b(a, b, c) {
			return a[b] || (a[b] = c())
		}
		var c = b(a, "qyPoster", Object);
		return b(c, "templateParser", function() {
			var a = {};
			return function(c, d) {
				if ("hasOwnProperty" === c) throw new Error("hasOwnProperty is not a valid name");
				return d && a.hasOwnProperty(c) && (a[c] = null), b(a, c, d)
			}
		})
	}
	function c() {
		templateParser = b(a)
	}
	var d = a.qyPoster || (a.qyPoster = {});
	c(d)
}(window, document), function(a) {
	function b(a, b, c, d) {
		var e = {},
			f = a / b,
			g = c / d;
		return f > g ? (e.width = c, e.height = c / f) : (e.height = d, e.width = d * f), e
	}
	function c(a, b) {
		if (b.trigger) {
			var c = $(a);
			b.trigger.sends && b.trigger.sends.length && $.each(b.trigger.sends, function(a, b) {
				c.bind(utilTrigger.getSendType(b.type).name, function() {
					$.each(b.handles, function(a, b) {
						var c = utilTrigger.getHandleType(b.type).name;
						$.each(b.ids, function(a, b) {
							var d = $("#inside_" + b);
							d.trigger(c)
						})
					})
				})
			}), b.trigger.receives && b.trigger.receives.length && b.trigger.receives[0].ids.length && $.each(b.trigger.receives, function(a, b) {
				var d = utilTrigger.getHandleType(b.type).name;
				"show" == d && c.hide(), c.bind(d, function() {
					"show" == d && $(this).show()
				})
			})
		}
	}
	function d(a, b) {
		if (b.sound) {
			var c = $(a);
			c.click(function() {
				utilSound.play(PREFIX_FILE_HOST + b.sound.src);
				var a = $("#media");
				a.length && $("#media").get(0).pause()
			})
		}
	}
	var e = a.templateParser("jsonParser", function() {
		function a(a) {
			return function(b, c) {
				a[b] = c
			}
		}
		function b(a, b) {
			var c = k[("" + a.type).charAt(0)]?k[("" + a.type).charAt(0)](a):false;
			if (c) {
				var d = $('<li comp-drag comp-rotate class="comp-resize comp-rotate inside" id="inside_' + c.id + '" num="' + a.num + '" ctype="' + a.type + '"></li>');
				3 != ("" + a.type).charAt(0) && 1 != ("" + a.type).charAt(0) && d.attr("comp-resize", ""), "p" == ("" + a.type).charAt(0) && d.removeAttr("comp-rotate"), 1 == ("" + a.type).charAt(0) && d.removeAttr("comp-drag"), 2 == ("" + a.type).charAt(0) && d.addClass("wsite-text"), 4 == ("" + a.type).charAt(0) && (a.properties.imgStyle && $(c).css(a.properties.imgStyle), d.addClass("wsite-image")), 5 == ("" + a.type).charAt(0) && d.addClass("wsite-input"), 6 == ("" + a.type).charAt(0) && d.addClass("wsite-button"), 8 == ("" + a.type).charAt(0) && d.addClass("wsite-button"), "v" == ("" + a.type).charAt(0) && d.addClass("wsite-video"), "7" == ("" + a.type).charAt(0) && d.addClass("wsite-map"), d.mouseenter(function() {
					$(this).addClass("inside-hover")
				}), d.mouseleave(function() {
					$(this).removeClass("inside-hover")
				});
				var e = $('<div class="element-box">').append($('<div class="element-box-contents">').append(c));
				if (d.append(e), 5 != ("" + a.type).charAt(0) && 6 != ("" + a.type).charAt(0) || "edit" != b || $(c).before($('<div class="element" style="position: absolute; height: 100%; width: 100%;">')), a.css) {
					var f = 320 - parseInt(a.css.left);
					d.css({
						width: f
					}), d.css({
						width: a.css.width,
						height: a.css.height,
						left: a.css.left,
						top: a.css.top,
						zIndex: a.css.zIndex,
						bottom: a.css.bottom,
						transform: a.css.transform
					}), e.css(a.css).css({
						width: "100%",
						height: "100%",
						transform: "none"
					}), e.children(".element-box-contents").css({
						width: "100%",
						height: "100%",
						borderRadius:a.css.borderRadius
					}), 4 != ("" + a.type).charAt(0) && "p" != ("" + a.type).charAt(0) && $(c).css({
						width: a.css.width,
						height: a.css.height
					})
				}
				return d
			}
		}
		function e(a) {
			for (var b = 0; b < a.length - 1; b++) for (var c = b + 1; c < a.length; c++) if (parseInt(a[b].css.zIndex, 10) > parseInt(a[c].css.zIndex, 10)) {
				var d = a[b];
				a[b] = a[c], a[c] = d
			}
			for (var e = 0; e < a.length; e++) a[e].css.zIndex = e + 1 + "";
			return a
		}
		function f(a, f, g) {
			f = f.find(".edit_area");//edit by zero 2016/3/11
			var h, i = a.elements;
			if (i) for (i = e(i), h = 0; h < i.length; h++) if (3 == i[h].type) {
				var j = k[("" + i[h].type).charAt(0)](i[h]);
				"edit" == g && l[("" + i[h].type).charAt(0)] && l[("" + i[h].type).charAt(0)](j, i[h])
			} else {
				var o = b(i[h], g);
				if (!o) continue;
				f.append(o);
				for (var p = 0; p < n.length; p++) n[p](o, i[h], g);
				m[("" + i[h].type).charAt(0)] && (m[("" + i[h].type).charAt(0)](o, i[h]), "edit" != g && (c(o, i[h]), d(o, i[h]))), "edit" == g && l[("" + i[h].type).charAt(0)] && l[("" + i[h].type).charAt(0)](o, i[h])
			}
		}
		function g() {
			return l
		}
		function h() {
			return k
		}
		function i(a) {
			n.push(a)
		}
		function j() {
			return n
		}
		var k = {},
			l = {},
			m = {},
			n = [],
			o = containerWidth = 320,
			p = containerHeight = 520,
			q = 1,
			r = 1,
			s = {
				getComponents: h,
				getEventHandlers: g,
				addComponent: a(k),
				bindEditEvent: a(l),
				bindAfterRenderEvent: a(m),
				addInterceptor: i,
				getInterceptors: j,
				wrapComp: b,
				mode: "view",
				parse: function(a) {
					var b = $('<div class="edit_wrapper"><ul id="edit_area' + a.def.id + '" comp-droppable paste-element class="edit_area weebly-content-area weebly-area-active"></div>'),
						c = this.mode = a.mode;
					this.def = a.def, "view" == c && tplCount++;
					var d = $(a.appendTo);
					return containerWidth = d.width(), containerHeight = d.height(), q = o / containerWidth, r = p / containerHeight, f(a.def, b.appendTo($(a.appendTo)), c)
				}
			};
		return s
	});
	e.addInterceptor(function(a, b, c) {
		qyCommon.animation(a, b, c)
	}), e.addComponent("1", function(a) {
		var b = document.createElement("div");
		if (b.id = a.id, b.setAttribute("class", "element comp_title"), a.content && (b.textContent = a.content), a.css) {
			var c, d = a.css;
			for (c in d) b.style[c] = d[c]
		}
		if (a.properties.labels) for (var e = a.properties.labels, f = 0; f < e.length; f++) $('<a class = "label_content" style = "display: inline-block;">').appendTo($(b)).html(e[f].title).css(e[f].color).css("width", 100 / e.length + "%");
		return b
	}), e.addComponent("2", function(a) {
		var b = document.createElement("div");
		return b.id = a.id, b.setAttribute("ctype", a.type), b.setAttribute("class", "element comp_paragraph editable-text"), a.content && (b.innerHTML = a.content), b.style.cursor = "default", b
	}), e.addComponent("3", function(a) {
		var b = $("#nr .edit_area")[0];
		"view" == e.mode && (b = document.getElementById("edit_area" + e.def.id)), b = $(b).parent()[0];
		var c, d = new Image;
		switch (a.properties.ami){
			case '1':
				var bgarea = $('<div class="wrapper_bg whole" style="width:100%;height:100%;"></div>');
				break;
			case '2':
				var bgarea = $('<div class="wrapper_bg scalebg" style="width:100%;height:100%;"></div>');
				break;
			default:
				var bgarea = $('<div class="wrapper_bg" style="width:100%;height:100%;"></div>');
				break;
		}
		bgarea.prependTo(b), 
		bgarea=bgarea.get(0);
		return a.properties.imgSrc && (c = a.properties.imgSrc, /^http.*/.test(c) ? (d.src = c, bgarea.style.backgroundImage = "url(" + c + ")") : (d.src = PREFIX_FILE_HOST + c, bgarea.style.backgroundImage = "url(" + PREFIX_FILE_HOST + c + ")"), bgarea.style.backgroundOrigin = "element content-box", bgarea.style.backgroundSize = "cover", bgarea.style.backgroundPosition = "50% 50%"), a.properties.bgColor && (bgarea.style.backgroundColor = a.properties.bgColor),b
	}), e.addComponent("4", function(a) {
		var b = document.createElement("img");
		b.id = a.id, b.setAttribute("ctype", a.type), b.setAttribute("class", "element comp_image editable-image"), b.src = /^http.*/.test(a.properties.src) ? a.properties.src : PREFIX_FILE_HOST + a.properties.src;
		if (a.properties.url){
			urlstr=a.properties.url;
			if (isNaN(urlstr)){
				if (urlstr.indexOf('javascript:')==0){
				}else if(urlstr.indexOf('wxmusic:')==0){
				}else{
					var url_linka=document.createElement('a');
					url_linka.setAttribute('href',urlstr);
					url_linka.appendChild(b);
					b=url_linka;
				}
			}
		}
		return b;
	}),e.addComponent("h", function(b) {
		var c, d;
		if (b.properties.src) return c = document.createElementNS(eqxiuSvg.NAMESPACE, "svg"), c.setAttribute("class", "element svg-element"), $.ajax({
			type: "GET",
			url: PREFIX_FILE_HOST + b.properties.src,
			dataType: "xml",
			success: function(d) {
				var e = d.getElementsByTagName("svg"),
					f = parseFloat($(e).attr("width")),
					g = parseFloat($(e).attr("height")),
					h = $(e).find("[fill], [style*='fill']"),
					i = b.properties.items ? b.properties.items : [];
				if (b.properties.items) if (h.length == i.length) for (var j = 0; j < i.length; j++) h.eq(j).css({
					fill: i[j].fill
				});
				else $.each(h, function(b, c) {
					var d = "",
						e = $(c).attr("style");
					if (e) {
						for (var f = e.split(";"), g = 0, j = f.length; j > g; g++) if (f[g].indexOf("fill:") >= 0) {
							d = f[g].split(":")[1];
							break
						}
					} else d = $(c).attr("fill");
					d.indexOf("rgba") >= 0 && (d = a.getRGB(d)), d = d.replace(/\s*/g, "");
					for (var k = 0; k < i.length; k++) {
						var l = i[k].svgFill;
						if (l && (l = l.replace(/\s*/g, ""), l.indexOf("rgba") >= 0 && (l = a.getRGB(l)), d == l)) {
							"" != i[k].fill ? h.eq(b).css({
								fill: i[k].fill
							}) : h.eq(b).css({
								fill: "none"
							});
							break
						}
					}
				});
				else {
					var k = [],
						l = {};
					$.each(h, function(a, b) {
						var c = $(b).attr("style");
						if (c) {
							for (var d = c.split(";"), e = 0, f = d.length; f > e; e++) if (d[e].indexOf("fill:") >= 0) {
								k.push(d[e].split(":")[1]);
								break
							}
						} else k.push($(b).attr("fill"))
					});
					for (var m = 0; m < k.length; m++) l[k[m]] || (l[k[m]] = 1, "none" != k[m] ? i.push({
						fill: k[m],
						svgFill: k[m]
					}) : i.push({
						fill: "",
						svgFill: "none"
					}));
					b.properties.items = i
				}
				viewBoxVal = "0 0 " + f + " " + g;
				var n = c.parentNode;
				n.removeChild(c), c = e[0], n.appendChild(c), c.setAttribute("viewBox", viewBoxVal), c.setAttribute("preserveAspectRatio", "none"), c.setAttribute("width", "100%"), c.setAttribute("height", "100%"), c.id = b.id, c.setAttribute("class", "element svg-element")
			}
		}), c;
		if (b.properties.type.indexOf("symbol") < 0) {
			var c = document.createElementNS(eqxiuSvg.NAMESPACE, "svg");
			return c.id = b.id, c.setAttribute("class", "element svg-element"), c.setAttribute("xmlns", eqxiuSvg.NAMESPACE), c.setAttribute("version", "1.1"), c.setAttribute("width", "100%"), c.setAttribute("height", "100%"), c.setAttribute("preserveAspectRatio", "none"), d = eqxiuSvg.ShapeFromType(b.properties.type), d.setAttribute("fill", "#555"), c.appendChild(d), s = eqxiuSvg.boundingBox(d), viewBox = [Math.round(s.x) || 0, Math.round(s.y) || 0, Math.round(s.width) || 32, Math.round(s.height) || 32].join(" "), c.setAttribute("viewBox", viewBox), c
		}
		return c = document.createElement("div"), d = eqxiuSvg.ShapeFromType(b.properties.type, 100, 100, b.id, b.css.color), c = '<svg id="' + b.id + '" class="element svg-element" ctype="' + b.type + '" xmlns="' + eqxiuSvg.NAMESPACE + '" version="1.1" width="100%" height="100%" preserveAspectRatio="xMidYMid" viewBox="' + b.properties.viewBox + '">' + d + "</svg>"
	}), e.addComponent("v", function(a) {
		var b = document.createElement("a");
		return b.setAttribute("class", "element video_area"), b.id = a.id, b.setAttribute("ctype", a.type), a.properties.src && b.setAttribute("videourl", a.properties.src), b
	}), e.addComponent("5", function(a) {
		var b = document.createElement("textarea");
		return b.id = a.id, b.setAttribute("ctype", a.type), b.setAttribute("class", "element comp_input editable-text"), a.properties.required && b.setAttribute("required", a.properties.required), a.properties.placeholder && b.setAttribute("placeholder", a.properties.placeholder), b.setAttribute("name", "eq[f_" + a.id + "]"), b.style.width = "100%", b
	}), e.addComponent("p", function(a) {
		if (a.properties && a.properties.children) {
			var c = 320,
				d = a.css.width || c - parseInt(a.css.left),
				e = a.css.height || d / 2;
			a.css.width = a.css.width || d, a.css.height = a.css.height || e;
			var f = $('<div id="' + a.id + '" class="slider element" ctype="' + a.type + '"></div>');
			return a.properties.bgColor && f.css("backgroundColor", a.properties.bgColor), $.each(a.properties.children, function(a, c) {
				var g = b(c.width, c.height, d, e),
					h = $('<img src="' +(c.src.indexOf(':')?c.src:PREFIX_FILE_HOST+c.src) + '">');
				h.css({
					margin: (e - g.height) / 2 + "px " + (d - g.width) / 2 + "px",
					width: g.width,
					height: g.height
				}), f.append(h)
			}), utilPictures.deleteInterval(a.id), f.get(0)
		}
	}), e.addComponent("6", function(a) {
		var b = document.createElement("button");
		if (b.id = a.id, b.setAttribute("ctype", a.type), b.setAttribute("class", "element comp_button editable-text"), a.properties.title) {
			var c = a.properties.title.replace(/ /g, "&nbsp;");
			b.innerHTML = c
		}
		return b.style.width = "100%", b
	}), e.addComponent("8", function(a) {
		var b = document.createElement("a");
		if (b.id = a.id, b.setAttribute("ctype", a.type), b.setAttribute("class", "element comp_anchor editable-text"), a.properties.title) {
			var c = a.properties.title.replace(/ /g, "&nbsp;");
			$(b).html(c), "view" == e.mode && $(b).attr("href", "tel:" + a.properties.number)
		}
		return b.style.cursor = "default", b.style.width = "100%", b
	}), e.addComponent("7", function(a) {
		var b = document.createElement("a");
		a.properties.m=a.properties.m?a.properties.m:'导航位置';
		a.properties.m=encodeURIComponent(a.properties.m);
		var url='http://api.map.baidu.com/marker?location='+a.properties.y+','+a.properties.x+'&title='+a.properties.m+'&content='+a.properties.m+'&output=html';
		return b.setAttribute("class", "element map_area"), b.id = a.id, b.setAttribute("ctype", a.type), a.properties.x && b.setAttribute("mapurl", url), b
	}), e.bindAfterRenderEvent("1", function(a, b) {
		if (a = $("div", a)[0], "view" == e.mode && 1 == b.type) {
			var c = b.properties.labels;
			for (key in c)!
			function(b) {
				$($(a).find(".label_content")[b]).on("click", function() {
					pageScroll(c[b])
				})
			}(key)
		}
	}), e.bindAfterRenderEvent("8", function(a, b) {
		a = $("a", a)[0];
		var c = {
			id: b.sceneId,
			num: b.properties.number
		};
	}),e.bindAfterRenderEvent("h", function(a, b) {
		"view" == e.mode && b.properties.url && $(a).click(function(a) {
			var c = b.properties.url;
			isNaN(c) ? a.open(c) : pageScroll(c)
		})
	}), e.bindAfterRenderEvent("4", function(a, b) {
		"view" == e.mode && b.properties.url && $(a).click(function() {
			{
				var urlstr = b.properties.url;
				if (isNaN(urlstr)){
					if (urlstr.indexOf('javascript:')==0){
						eval(urlstr.substring(11))
					}else if(urlstr.indexOf('wxmusic:')==0){
						var serverId=urlstr.substring(10);
						if (serverId.length>5){
							wx.downloadVoice({
								serverId:serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
								isShowProgressTips: 0, // 默认为1，显示进度提示
								success: function (res) {
									var localId = res.localId; // 返回音频的本地ID
									wx.playVoice({
										localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
									});
								}
							});
						}
					}else if(urlstr.indexOf('iframe:')==0){
						urlstr='<iframe src="http:'+urlstr.substring(7)+'" width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>';
						$(a).hide(), $("#audio_btn").hasClass("video_exist") && ($("#audio_btn").hide()), utilSound.pause(), $('<div class="video_mask page_effect lock" id="mask_' + b.id + '"></div>').appendTo($(a).closest(".m-img")), $('<a class = "close_mask" id="close_' + b.id + '"></a>').appendTo($(a).closest(".m-img")),$('#side_rt').hide(), $(urlstr).appendTo($("#mask_" + b.id)).attr("style", "position: absolute;top:0;").attr("width", "100%"), $("#close_" + b.id).bind("click", function() {
							$(a).show(),$('#side_rt').show(), $("#mask_" + b.id).remove(), $("#close_" + b.id).remove(), $("#audio_btn").hasClass("video_exist") && $("#audio_btn").show()
						});
					}else{

						window.open(urlstr);
					}
				}else{
					qy7192.pageScroll(urlstr);
				}
			}
		})
	}), e.bindAfterRenderEvent("5", function(a, b) {
		var c = mobilecheck();
		"view" == e.mode && c && parseFloat(b.css.top) >= 280 && ($(a).find("textarea").focus(function() {
			$(a).closest(".edit_area").css({
				top: "-150px"
			})
		}), $(a).find("textarea").blur(function() {
			$(a).closest(".edit_area").css({
				top: 0
			})
		}))
	}), e.bindAfterRenderEvent("v", function(a, b) {
		"view" == e.mode && $(a).click(function() {
			$(a).hide(), $("#audio_btn").hasClass("video_exist") && ($("#audio_btn").hide(), $("#media")[0].pause()), utilSound.pause(), $('<div class="video_mask page_effect lock" id="mask_' + b.id + '"></div>').appendTo($(a).closest(".m-img")), $('<a class = "close_mask" id="close_' + b.id + '"></a>').appendTo($(a).closest(".m-img")),$('#side_rt').hide(), $(b.properties.src).appendTo($("#mask_" + b.id)).attr("style", "position: absolute;top:0; min-height: 45%; max-height: 100%; top: 20%;").attr("width", "100%").removeAttr("height"), $("#close_" + b.id).bind("click", function() {
				$(a).show(),$('#side_rt').show(), $("#mask_" + b.id).remove(), $("#close_" + b.id).remove(), $("#audio_btn").hasClass("video_exist") && $("#audio_btn").show(function() {
					$(this).hasClass("off") || $("#media")[0].play()
				})
			})
		})
	}), e.bindAfterRenderEvent("2", function(a) {
		for (var b = $(a).find("a[data]"), c = 0; c < b.length; c++) if (b[c] && "view" == e.mode) {
			$(b[c]).css("cursor", "pointer");
			var d = $(b[c]).attr("data");
			!
			function(a) {
				$(b[c]).click(function() {
					qy7192.pageScroll(a)
				})
			}(d)
		}
	}), e.bindAfterRenderEvent("6", function(a) {
		if (a = $("button", a)[0], "view" == e.mode) {
			var b = function(b, c) {
					var d = !0,
						e = $(a).parents("#nr"),
						f = {};
					$("textarea", e).each(function() {
						if (d) {
							if ("required" == $(this).attr("required") && "" == $(this).val().trim()) return showCheckMessage($(this).attr("placeholder") + "为必填项"), void(d = !1);
							if ("502" == $(this).attr("ctype") && "" !== $(this).val().trim()) {
								var a = new RegExp(/(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/g);
								if (!a.test($(this).val())) return showCheckMessage("手机号码格式错误"), void(d = !1)
							}
							if ("503" == $(this).attr("ctype") && "" !== $(this).val().trim()) {
								var b = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/g);
								if (!b.test($(this).val())) return showCheckMessage("邮箱格式错误"), void(d = !1)
							}
							f[$(this).attr("name")] = $(this).val()
						}
					}), d && $.ajax({
						cache: !0,
						type: "POST",
						url: PREFIX_S1_URL + "/ajax/" + c+".html",
						data: $.param(f),
						async: !1,
						error: function() {
							showCheckMessage("Connection error")
						},
						success: function() {
							$(b).unbind("click").click(function() {
								showCheckMessage("请不要重复提交")
							}), showCheckMessage("谢谢您的参与！")
						}
					})
				},
				c = e.def.sceneId;
			$(a).bind("click", function() {
				b(this, c)
			})
		}
	}), e.bindAfterRenderEvent("7", function(a, b) {
			"view" == e.mode && $(a).click(function() {
				//b.properties.m=encodeURIComponent(b.properties.m);
				var url='http://api.map.baidu.com/marker?location='+b.properties.y+','+b.properties.x+'&title=导航位置&content='+b.properties.m+'&output=html';
				$(a).hide(), $("#map_btn").hasClass("map_exist") && ($("#map_btn").hide()), $('<div class="video_mask page_effect lock" id="mask_' + b.id + '"></div>').appendTo($(a).closest(".m-img")), $('<a class = "close_mask" id="close_' + b.id + '"></a>').appendTo($(a).closest(".m-img")),$('#side_rt').hide(),$('<iframe src="'+url+'" allowtransparency="true" allowfullscreen="true" allowfullscreenInteractive="true" scrolling="no" border="0" frameborder="0" style="width:320px;height:520px;"></iframe>').appendTo($("#mask_" + b.id)).attr("style", "position: absolute;top:0; min-height:100%; max-height: 100%; top:0%;").attr("width", "100%").removeAttr("height"), $("#close_" + b.id).bind("click", function() {
					$(a).show(),$('#side_rt').show(), $("#mask_" + b.id).remove(), $("#close_" + b.id).remove(), $("#map_btn").hasClass("map_exist") && $("#map_btn").show()
				})
			});
	}), e.bindAfterRenderEvent("p", function(a, b) {
		$(a).closest(".page_tpl_container ").length || ($(a).children(".element-box").css("overflow", "visible"), utilPictures.deleteInterval(b.id), new flux.slider("#" + b.id, {
			autoplay: b.properties.autoPlay,
			delay: b.properties.interval,
			pagination: !1,
			transitions: [utilPictures.getPicStyle(b.properties.picStyle).name],
			width: b.css.width,
			height: b.css.height,
			bgColor: b.properties.bgColor,
			onStartEnd: function(a) {
				utilPictures.addInterval(b.id, a)
			}
		}))
	})
}(window.qyPoster),function() {
		window.eqxiuSvg = {
			NAMESPACE: "http://www.w3.org/2000/svg",
			SYMBOLS: {},
			boundingBox: function(a) {
				var b, c = a.parentNode,
					d = document.createElementNS(eqxiuSvg.NAMESPACE, "svg");
				return d.setAttribute("width", "0"), d.setAttribute("height", "0"), d.setAttribute("style", "visibility: hidden; position: absolute; left: 0; top: 0;"), d.appendChild(a), document.body.appendChild(d), b = a.getBBox(), c ? c.appendChild(a) : d.removeChild(a), document.body.removeChild(d), b
			},
			pointsToPolygon: function(a) {
				for (var b = []; a.length >= 2;) b.push(a.shift() + "," + a.shift());
				return b.join(" ")
			},
			symbol: function(a, b, c) {
				var d = c ? c : "#555",
					e = eqxiuSvg.SYMBOLS[a],
					f = '<g fill="' + d + '" id="path_' + b + '">' + e + "</g>";
				return f
			},
			ShapeFromType: function(a, b, c, d, e) {
				return b || (b = 64), c || (c = 64), /symbols\-/.test(a) ? eqxiuSvg.symbol(a.replace(/^symbols\-/, ""), d, e) : "rect" == a ? eqxiuSvg.rect(b, c) : "circle" == a ? eqxiuSvg.ellipse(b, c) : "diamond" == a ? eqxiuSvg.polygon(b, c, 4) : "octagon" == a ? eqxiuSvg.polygon(b, c, 8) : "triangle-up" == a ? eqxiuSvg.triangleUp(b, c) : "triangle-down" == a ? eqxiuSvg.triangleDown(b, c) : "triangle-left" == a ? eqxiuSvg.triangleLeft(b, c) : "triangle-right" == a ? eqxiuSvg.triangleRight(b, c) : "arrow-up" == a ? eqxiuSvg.arrowUp(b, c) : "arrow-down" == a ? eqxiuSvg.arrowDown(b, c) : "arrow-left" == a ? eqxiuSvg.arrowLeft(b, c) : "arrow-right" == a ? eqxiuSvg.arrowRight(b, c) : void 0
			},
			rect: function(a, b) {
				var c = document.createElementNS(eqxiuSvg.NAMESPACE, "rect");
				return c.setAttribute("width", a), c.setAttribute("height", b), c
			},
			ellipse: function(a, b) {
				var c = document.createElementNS(eqxiuSvg.NAMESPACE, "ellipse");
				return c.setAttribute("rx", a / 2), c.setAttribute("ry", b / 2), c.setAttribute("cx", a / 2), c.setAttribute("cy", b / 2), c
			},
			triangleUp: function(a, b) {
				var c = document.createElementNS(eqxiuSvg.NAMESPACE, "polygon");
				return c.setAttribute("points", eqxiuSvg.pointsToPolygon([a / 2, 0, a, b, 0, b])), c
			},
			triangleDown: function(a, b) {
				var c = document.createElementNS(eqxiuSvg.NAMESPACE, "polygon");
				return c.setAttribute("points", eqxiuSvg.pointsToPolygon([0, 0, a, 0, a / 2, b])), c
			},
			triangleLeft: function(a, b) {
				var c = document.createElementNS(eqxiuSvg.NAMESPACE, "polygon");
				return c.setAttribute("points", eqxiuSvg.pointsToPolygon([0, b / 2, a, 0, a, b])), c
			},
			triangleRight: function(a, b) {
				var c = document.createElementNS(eqxiuSvg.NAMESPACE, "polygon");
				return c.setAttribute("points", eqxiuSvg.pointsToPolygon([a, b / 2, 0, b, 0, 0])), c
			},
			arrowUp: function(a, b) {
				var c = document.createElementNS(eqxiuSvg.NAMESPACE, "polygon");
				return c.setAttribute("points", eqxiuSvg.pointsToPolygon([.5 * a, 0, a, .5 * b, .7 * a, .5 * b, .7 * a, b, .3 * a, b, .3 * a, .5 * b, 0, .5 * b, .5 * a, 0])), c
			},
			arrowDown: function(a, b) {
				var c = document.createElementNS(eqxiuSvg.NAMESPACE, "polygon");
				return c.setAttribute("points", eqxiuSvg.pointsToPolygon([.5 * a, b, a, .5 * b, .7 * a, .5 * b, .7 * a, 0, .3 * a, 0, .3 * a, .5 * b, 0, .5 * b, .5 * a, b])), c
			},
			arrowLeft: function(a, b) {
				var c = document.createElementNS(eqxiuSvg.NAMESPACE, "polygon");
				return c.setAttribute("points", eqxiuSvg.pointsToPolygon([a, .3 * b, .5 * a, .3 * b, .5 * a, 0, 0, .5 * b, .5 * a, b, .5 * a, .7 * b, a, .7 * b, a, .3 * b])), c
			},
			arrowRight: function(a, b) {
				var c = document.createElementNS(eqxiuSvg.NAMESPACE, "polygon");
				return c.setAttribute("points", eqxiuSvg.pointsToPolygon([0, .3 * b, .5 * a, .3 * b, .5 * a, 0, a, .5 * b, .5 * a, b, .5 * a, .7 * b, 0, .7 * b])), c
			},
			polygon: function(a, b, c) {
				var d = document.createElementNS(eqxiuSvg.NAMESPACE, "polygon"),
					e = [];
				if (3 === c) e = [a / 2, 0, a, b, 0, b];
				else if (c > 3) for (var f = a / 2, g = b / 2, h = 0; c > h; h++) {
					var i = f + f * Math.cos(2 * Math.PI * h / c),
						j = g + g * Math.sin(2 * Math.PI * h / c);
					i = Math.round(10 * i) / 10, j = Math.round(10 * j) / 10, e.push(i), e.push(j)
				}
				return d.setAttribute("points", eqxiuSvg.pointsToPolygon(e)), d
			}
		}
	}(), function() {
		window.eqxiuSvg.SYMBOLS = {
			bolt: '<path d="M32 0l-24 16 6 4-14 12 24-12-6-4z"></path>',
			camera: '<path d="M16 20c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4-2.209 0-4-1.791-4-4zM28 8l-3.289-6.643c-0.27-0.789-1.016-1.357-1.899-1.357h-5.492c-0.893 0-1.646 0.582-1.904 1.385l-3.412 6.615h-8.004c-2.209 0-4 1.791-4 4v20h32v-20c0-2.209-1.789-4-4-4zM6 16c-1.105 0-2-0.895-2-2s0.895-2 2-2 2 0.895 2 2-0.895 2-2 2zM20 28c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"></path>',
			"checkmark-circle": '<path d="M16 0c-8.836 0-16 7.164-16 16s7.164 16 16 16 16-7.164 16-16-7.164-16-16-16zM13.52 23.383l-7.362-7.363 2.828-2.828 4.533 4.535 9.617-9.617 2.828 2.828-12.444 12.445z"></path>',
			clock: '<path d="M16 4c6.617 0 12 5.383 12 12s-5.383 12-12 12-12-5.383-12-12 5.383-12 12-12zM16 0c-8.836 0-16 7.164-16 16s7.164 16 16 16 16-7.164 16-16-7.164-16-16-16v0zM21.422 18.578l-3.422-3.426v-7.152h-4.023v7.992c0 0.602 0.277 1.121 0.695 1.492l3.922 3.922 2.828-2.828z"></path>',
			cloud: '<path d="M24 10c-0.379 0-0.738 0.061-1.102 0.111-1.394-2.465-3.972-4.111-6.898-4.111-2.988 0-5.566 1.666-6.941 4.1-0.352-0.047-0.704-0.1-1.059-0.1-4.41 0-8 3.588-8 8 0 4.414 3.59 8 8 8h16c4.41 0 8-3.586 8-8 0-4.412-3.59-8-8-8zM24 22h-16c-2.207 0-4-1.797-4-4 0-2.193 1.941-3.885 4.004-3.945 0.008 0.943 0.172 1.869 0.5 2.744l3.746-1.402c-0.168-0.444-0.25-0.915-0.25-1.397 0-2.205 1.793-4 4-4 1.293 0 2.465 0.641 3.199 1.639-1.929 1.461-3.199 3.756-3.199 6.361h4c0-2.205 1.793-4 4-4s4 1.795 4 4c0 2.203-1.793 4-4 4z"></path>',
			cog: '<path d="M32 17.969v-4l-4.781-1.992c-0.133-0.375-0.273-0.738-0.445-1.094l1.93-4.805-2.829-2.828-4.762 1.961c-0.363-0.176-0.734-0.324-1.117-0.461l-2.027-4.75h-4l-1.977 4.734c-0.398 0.141-0.781 0.289-1.16 0.469l-4.754-1.91-2.828 2.828 1.938 4.711c-0.188 0.387-0.34 0.781-0.485 1.188l-4.703 2.011v4l4.707 1.961c0.145 0.406 0.301 0.801 0.488 1.188l-1.902 4.742 2.828 2.828 4.723-1.945c0.379 0.18 0.766 0.324 1.164 0.461l2.023 4.734h4l1.98-4.758c0.379-0.141 0.754-0.289 1.113-0.461l4.797 1.922 2.828-2.828-1.969-4.773c0.168-0.359 0.305-0.723 0.438-1.094l4.782-2.039zM15.969 22c-3.312 0-6-2.688-6-6s2.688-6 6-6 6 2.688 6 6-2.688 6-6 6z"></path>',
			denied: '<path d="M16 0c-8.836 0-16 7.164-16 16s7.164 16 16 16 16-7.164 16-16-7.164-16-16-16zM16 4c2.59 0 4.973 0.844 6.934 2.242l-16.696 16.688c-1.398-1.961-2.238-4.344-2.238-6.93 0-6.617 5.383-12 12-12zM16 28c-2.59 0-4.973-0.844-6.934-2.242l16.696-16.688c1.398 1.961 2.238 4.344 2.238 6.93 0 6.617-5.383 12-12 12z"></path>',
			earth: '<path d="M27.314 4.686c3.022 3.022 4.686 7.040 4.686 11.314s-1.664 8.292-4.686 11.314c-3.022 3.022-7.040 4.686-11.314 4.686s-8.292-1.664-11.314-4.686c-3.022-3.022-4.686-7.040-4.686-11.314s1.664-8.292 4.686-11.314c3.022-3.022 7.040-4.686 11.314-4.686s8.292 1.664 11.314 4.686zM25.899 25.9c1.971-1.971 3.281-4.425 3.821-7.096-0.421 0.62-0.824 0.85-1.073-0.538-0.257-2.262-2.335-0.817-3.641-1.621-1.375 0.927-4.466-1.802-3.941 1.276 0.81 1.388 4.375-1.858 2.598 1.079-1.134 2.050-4.145 6.592-3.753 8.946 0.049 3.43-3.504 0.715-4.729-0.422-0.824-2.279-0.281-6.262-2.434-7.378-2.338-0.102-4.344-0.314-5.25-2.927-0.545-1.87 0.58-4.653 2.584-5.083 2.933-1.843 3.98 2.158 6.731 2.232 0.854-0.894 3.182-1.178 3.375-2.18-1.805-0.318 2.29-1.517-0.173-2.199-1.358 0.16-2.234 1.409-1.512 2.467-2.632 0.614-2.717-3.809-5.247-2.414-0.064 2.206-4.132 0.715-1.407 0.268 0.936-0.409-1.527-1.594-0.196-1.379 0.654-0.036 2.854-0.807 2.259-1.325 1.225-0.761 2.255 1.822 3.454-0.059 0.866-1.446-0.363-1.713-1.448-0.98-0.612-0.685 1.080-2.165 2.573-2.804 0.497-0.213 0.973-0.329 1.336-0.296 0.752 0.868 2.142 1.019 2.215-0.104-1.862-0.892-3.915-1.363-6.040-1.363-3.051 0-5.952 0.969-8.353 2.762 0.645 0.296 1.012 0.664 0.39 1.134-0.483 1.439-2.443 3.371-4.163 3.098-0.893 1.54-1.482 3.238-1.733 5.017 1.441 0.477 1.773 1.42 1.464 1.736-0.734 0.64-1.185 1.548-1.418 2.541 0.469 2.87 1.818 5.515 3.915 7.612 2.644 2.644 6.16 4.1 9.899 4.1s7.255-1.456 9.899-4.1z"></path>',
			eye: '<path d="M16 4c-8.836 0-16 11.844-16 11.844s7.164 12.156 16 12.156 16-12.156 16-12.156-7.164-11.844-16-11.844zM16 24c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zM12 16c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4-2.209 0-4-1.791-4-4z"></path>',
			facebook: '<path d="M17.996 32h-5.996v-16h-4v-5.514l4-0.002-0.007-3.248c0-4.498 1.22-7.236 6.519-7.236h4.412v5.515h-2.757c-2.064 0-2.163 0.771-2.163 2.209l-0.008 2.76h4.959l-0.584 5.514-4.37 0.002-0.004 16z"></path>',
			fork: '<path d="M20 0v3.875c0 1.602-0.625 3.109-1.754 4.238l-11.316 11.254c-1.789 1.785-2.774 4.129-2.883 6.633h-4.047l6 6 6-6h-3.957c0.105-1.438 0.684-2.773 1.711-3.805l11.316-11.25c1.891-1.89 2.93-4.398 2.93-7.070v-3.875h-4zM23.953 26c-0.109-2.504-1.098-4.848-2.887-6.641l-2.23-2.215-2.836 2.821 2.242 2.23c1.031 1.027 1.609 2.367 1.715 3.805h-3.957l6 6 6-6h-4.047z"></path>',
			globe: '<path d="M15 2c-8.284 0-15 6.716-15 15s6.716 15 15 15c8.284 0 15-6.716 15-15s-6.716-15-15-15zM23.487 22c0.268-1.264 0.437-2.606 0.492-4h3.983c-0.104 1.381-0.426 2.722-0.959 4h-3.516zM6.513 12c-0.268 1.264-0.437 2.606-0.492 4h-3.983c0.104-1.381 0.426-2.722 0.959-4h3.516zM21.439 12c0.3 1.28 0.481 2.62 0.54 4h-5.979v-4h5.439zM16 10v-5.854c0.456 0.133 0.908 0.355 1.351 0.668 0.831 0.586 1.625 1.488 2.298 2.609 0.465 0.775 0.867 1.638 1.203 2.578h-4.852zM10.351 7.422c0.673-1.121 1.467-2.023 2.298-2.609 0.443-0.313 0.895-0.535 1.351-0.668v5.854h-4.852c0.336-0.94 0.738-1.803 1.203-2.578zM14 12v4h-5.979c0.059-1.38 0.24-2.72 0.54-4h5.439zM2.997 22c-0.533-1.278-0.854-2.619-0.959-4h3.983c0.055 1.394 0.224 2.736 0.492 4h-3.516zM8.021 18h5.979v4h-5.439c-0.3-1.28-0.481-2.62-0.54-4zM14 24v5.854c-0.456-0.133-0.908-0.355-1.351-0.668-0.831-0.586-1.625-1.488-2.298-2.609-0.465-0.775-0.867-1.638-1.203-2.578h4.852zM19.649 26.578c-0.673 1.121-1.467 2.023-2.298 2.609-0.443 0.312-0.895 0.535-1.351 0.668v-5.854h4.852c-0.336 0.94-0.738 1.802-1.203 2.578zM16 22v-4h5.979c-0.059 1.38-0.24 2.72-0.54 4h-5.439zM23.98 16c-0.055-1.394-0.224-2.736-0.492-4h3.516c0.533 1.278 0.855 2.619 0.959 4h-3.983zM25.958 10h-2.997c-0.582-1.836-1.387-3.447-2.354-4.732 1.329 0.636 2.533 1.488 3.585 2.54 0.671 0.671 1.261 1.404 1.766 2.192zM5.808 7.808c1.052-1.052 2.256-1.904 3.585-2.54-0.967 1.285-1.771 2.896-2.354 4.732h-2.997c0.504-0.788 1.094-1.521 1.766-2.192zM4.042 24h2.997c0.583 1.836 1.387 3.447 2.354 4.732-1.329-0.636-2.533-1.488-3.585-2.54-0.671-0.671-1.261-1.404-1.766-2.192zM24.192 26.192c-1.052 1.052-2.256 1.904-3.585 2.54 0.967-1.285 1.771-2.896 2.354-4.732h2.997c-0.504 0.788-1.094 1.521-1.766 2.192z"></path>',
			happy: '<path d="M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13zM16 18.711c3.623 0 7.070-0.963 10-2.654-0.455 5.576-4.785 9.942-10 9.942-5.215 0-9.544-4.371-10-9.947 2.93 1.691 6.377 2.658 10 2.658zM8 11c0-1.657 0.895-3 2-3s2 1.343 2 3c0 1.657-0.895 3-2 3-1.105 0-2-1.343-2-3zM20 11c0-1.657 0.895-3 2-3s2 1.343 2 3c0 1.657-0.895 3-2 3-1.105 0-2-1.343-2-3z"></path>',
			"heart-fill": '<path d="M16 5.844c-1.613-2.266-4.129-3.844-7.113-3.844-4.903 0-8.887 3.992-8.887 8.891v0.734l16.008 18.375 15.992-18.375v-0.734c0-4.899-3.984-8.891-8.887-8.891-2.984 0-5.5 1.578-7.113 3.844z"></path>',
			"heart-stroke": '<path d="M23.113 6c2.457 0 4.492 1.82 4.836 4.188l-11.945 13.718-11.953-13.718c0.344-2.368 2.379-4.188 4.836-4.188 2.016 0 3.855 2.164 3.855 2.164l3.258 3.461 3.258-3.461c0 0 1.84-2.164 3.855-2.164zM23.113 2c-2.984 0-5.5 1.578-7.113 3.844-1.613-2.266-4.129-3.844-7.113-3.844-4.903 0-8.887 3.992-8.887 8.891v0.734l16.008 18.375 15.992-18.375v-0.734c0-4.899-3.984-8.891-8.887-8.891v0z"></path>',
			home: '<path d="M16 0l-16 16h4v16h24v-16h4l-16-16zM24 28h-6v-6h-4v6h-6v-14.344l8-5.656 8 5.656v14.344z"></path>',
			iphone: '<path d="M16 0h-8c-4.418 0-8 3.582-8 8v16c0 4.418 3.582 8 8 8h8c4.418 0 8-3.582 8-8v-16c0-4.418-3.582-8-8-8zM12 30.062c-1.139 0-2.062-0.922-2.062-2.062s0.924-2.062 2.062-2.062 2.062 0.922 2.062 2.062-0.923 2.062-2.062 2.062zM20 24h-16v-16c0-2.203 1.795-4 4-4h8c2.203 0 4 1.797 4 4v16z"></path>',
			lock: '<path d="M14 0c-5.508 0-9.996 4.484-9.996 10v2h-4.004v14c0 3.309 2.691 6 6 6h12c3.309 0 6-2.691 6-6v-16c0-5.516-4.488-10-10-10zM11.996 24c-1.101 0-1.996-0.895-1.996-2s0.895-2 1.996-2c1.105 0 2 0.895 2 2s-0.894 2-2 2zM20 12h-11.996v-2c0-3.309 2.691-6 5.996-6 3.309 0 6 2.691 6 6v2z"></path>',
			mail: '<path d="M15.996 15.457l16.004-7.539v-3.918h-32v3.906zM16.004 19.879l-16.004-7.559v15.68h32v-15.656z"></path>',
			"minus-circle": '<path d="M16 0c-8.836 0-16 7.164-16 16s7.164 16 16 16 16-7.164 16-16-7.164-16-16-16zM24 18h-16v-4h16v4z"></path>',
			moon: '<path d="M24.633 22.184c-8.188 0-14.82-6.637-14.82-14.82 0-2.695 0.773-5.188 2.031-7.363-6.824 1.968-11.844 8.187-11.844 15.644 0 9.031 7.32 16.355 16.352 16.355 7.457 0 13.68-5.023 15.648-11.844-2.18 1.254-4.672 2.028-7.367 2.028z"></path>',
			paperclip: '<path d="M17.293 15.292l-2.829-2.829-4 4c-1.953 1.953-1.953 5.119 0 7.071 1.953 1.953 5.118 1.953 7.071 0l10.122-9.879c3.123-3.124 3.123-8.188 0-11.313-3.125-3.124-8.19-3.124-11.313 0l-11.121 10.88c-4.296 4.295-4.296 11.26 0 15.557 4.296 4.296 11.261 4.296 15.556 0l6-6-2.829-2.829-5.999 6c-2.733 2.732-7.166 2.732-9.9 0-2.733-2.732-2.733-7.166 0-9.899l11.121-10.881c1.562-1.562 4.095-1.562 5.656 0 1.563 1.563 1.563 4.097 0 5.657l-10.121 9.879c-0.391 0.391-1.023 0.391-1.414 0s-0.391-1.023 0-1.414l4-4z"></path>',
			pin: '<path d="M17.070 2.93c-3.906-3.906-10.234-3.906-14.141 0-3.906 3.904-3.906 10.238 0 14.14 0.001 0 7.071 6.93 7.071 14.93 0-8 7.070-14.93 7.070-14.93 3.907-3.902 3.907-10.236 0-14.14zM10 14c-2.211 0-4-1.789-4-4s1.789-4 4-4 4 1.789 4 4-1.789 4-4 4z"></path>',
			"plus-circle": '<path d="M16 0c-8.836 0-16 7.164-16 16s7.164 16 16 16 16-7.164 16-16-7.164-16-16-16zM24 18h-6v6h-4v-6h-6v-4h6v-6h4v6h6v4z"></path>',
			rain: '<path d="M23.998 6c-0.375 0-0.733 0.061-1.103 0.111-1.389-2.465-3.969-4.111-6.895-4.111-2.987 0-5.565 1.666-6.94 4.1-0.353-0.047-0.705-0.1-1.060-0.1-4.41 0-8 3.588-8 8s3.59 8 8 8h15.998c4.414 0 8-3.588 8-8s-3.586-8-8-8zM23.998 18h-15.998c-2.207 0-4-1.795-4-4 0-2.193 1.941-3.885 4.004-3.945 0.009 0.943 0.172 1.869 0.5 2.744l3.746-1.402c-0.168-0.444-0.25-0.915-0.25-1.397 0-2.205 1.793-4 4-4 1.293 0 2.465 0.641 3.199 1.639-1.928 1.461-3.199 3.756-3.199 6.361h4c0-2.205 1.795-4 3.998-4 2.211 0 4 1.795 4 4s-1.789 4-4 4zM3.281 29.438c-0.75 0.75-1.969 0.75-2.719 0s-0.75-1.969 0-2.719 5.438-2.719 5.438-2.719-1.969 4.688-2.719 5.438zM11.285 29.438c-0.75 0.75-1.965 0.75-2.719 0-0.75-0.75-0.75-1.969 0-2.719 0.754-0.75 5.438-2.719 5.438-2.719s-1.965 4.688-2.719 5.438zM19.28 29.438c-0.75 0.75-1.969 0.75-2.719 0s-0.75-1.969 0-2.719 5.437-2.719 5.437-2.719-1.968 4.688-2.718 5.438z"></path>',
			ribbon: '<path d="M8 20c-1.41 0-2.742-0.289-4-0.736v12.736l4-4 4 4v-12.736c-1.258 0.447-2.59 0.736-4 0.736zM0 8c0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8-4.418 0-8-3.582-8-8z"></path>',
			sad: '<path d="M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13zM8 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM20 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM9.997 24.398l-2.573-1.544c1.749-2.908 4.935-4.855 8.576-4.855 3.641 0 6.827 1.946 8.576 4.855l-2.573 1.544c-1.224-2.036-3.454-3.398-6.003-3.398-2.549 0-4.779 1.362-6.003 3.398z"></path>',
			smiley: '<path d="M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13zM8 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM20 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM22.003 19.602l2.573 1.544c-1.749 2.908-4.935 4.855-8.576 4.855s-6.827-1.946-8.576-4.855l2.573-1.544c1.224 2.036 3.454 3.398 6.003 3.398s4.779-1.362 6.003-3.398z"></path>',
			star: '<path d="M22.137 19.625l9.863-7.625h-12l-4-12-4 12h-12l9.875 7.594-3.875 12.406 10.016-7.68 9.992 7.68z"></path>',
			sun: '<path d="M16.001 8c-4.418 0-8 3.582-8 8s3.582 8 8 8c4.418 0 7.999-3.582 7.999-8s-3.581-8-7.999-8v0zM14 2c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM4 6c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM2 14c1.105 0 2 0.895 2 2 0 1.107-0.895 2-2 2s-2-0.893-2-2c0-1.105 0.895-2 2-2zM4 26c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM14 30c0-1.109 0.895-2 2-2 1.108 0 2 0.891 2 2 0 1.102-0.892 2-2 2-1.105 0-2-0.898-2-2zM24 26c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM30 18c-1.104 0-2-0.896-2-2 0-1.107 0.896-2 2-2s2 0.893 2 2c0 1.104-0.896 2-2 2zM24 6c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2z"></path>',
			"thin-arrow-down": '<path d="M4.586 19.414l10 10c0.781 0.781 2.047 0.781 2.828 0l10-10c0.781-0.781 0.781-2.047 0-2.828s-2.047-0.781-2.828 0l-6.586 6.586v-19.172c0-1.105-0.895-2-2-2s-2 0.895-2 2v19.172l-6.586-6.586c-0.391-0.39-0.902-0.586-1.414-0.586s-1.024 0.195-1.414 0.586c-0.781 0.781-0.781 2.047 0 2.828z"></path>',
			"thin-arrow-down-left": '<path d="M18 28c1.105 0 2-0.895 2-2s-0.895-2-2-2h-7.172l16.586-16.586c0.781-0.781 0.781-2.047 0-2.828-0.391-0.391-0.902-0.586-1.414-0.586s-1.024 0.195-1.414 0.586l-16.586 16.586v-7.172c0-1.105-0.895-2-2-2s-2 0.895-2 2v14h14z"></path>',
			"thin-arrow-down-right": '<path d="M28 14c0-1.105-0.895-2-2-2s-2 0.895-2 2v7.172l-16.586-16.586c-0.781-0.781-2.047-0.781-2.828 0-0.391 0.391-0.586 0.902-0.586 1.414s0.195 1.024 0.586 1.414l16.586 16.586h-7.172c-1.105 0-2 0.895-2 2s0.895 2 2 2h14v-14z"></path>',
			"thin-arrow-left": '<path d="M12.586 4.586l-10 10c-0.781 0.781-0.781 2.047 0 2.828l10 10c0.781 0.781 2.047 0.781 2.828 0s0.781-2.047 0-2.828l-6.586-6.586h19.172c1.105 0 2-0.895 2-2s-0.895-2-2-2h-19.172l6.586-6.586c0.39-0.391 0.586-0.902 0.586-1.414s-0.195-1.024-0.586-1.414c-0.781-0.781-2.047-0.781-2.828 0z"></path>',
			"thin-arrow-right": '<path d="M19.414 27.414l10-10c0.781-0.781 0.781-2.047 0-2.828l-10-10c-0.781-0.781-2.047-0.781-2.828 0s-0.781 2.047 0 2.828l6.586 6.586h-19.172c-1.105 0-2 0.895-2 2s0.895 2 2 2h19.172l-6.586 6.586c-0.39 0.39-0.586 0.902-0.586 1.414s0.195 1.024 0.586 1.414c0.781 0.781 2.047 0.781 2.828 0z"></path>',
			"thin-arrow-up": '<path d="M27.414 12.586l-10-10c-0.781-0.781-2.047-0.781-2.828 0l-10 10c-0.781 0.781-0.781 2.047 0 2.828s2.047 0.781 2.828 0l6.586-6.586v19.172c0 1.105 0.895 2 2 2s2-0.895 2-2v-19.172l6.586 6.586c0.39 0.39 0.902 0.586 1.414 0.586s1.024-0.195 1.414-0.586c0.781-0.781 0.781-2.047 0-2.828z"></path>',
			"thin-arrow-up-left": '<path d="M4 18c0 1.105 0.895 2 2 2s2-0.895 2-2v-7.172l16.586 16.586c0.781 0.781 2.047 0.781 2.828 0 0.391-0.391 0.586-0.902 0.586-1.414s-0.195-1.024-0.586-1.414l-16.586-16.586h7.172c1.105 0 2-0.895 2-2s-0.895-2-2-2h-14v14z"></path>',
			"thin-arrow-up-right": '<path d="M26.001 4c-0 0-0.001 0-0.001 0h-11.999c-1.105 0-2 0.895-2 2s0.895 2 2 2h7.172l-16.586 16.586c-0.781 0.781-0.781 2.047 0 2.828 0.391 0.391 0.902 0.586 1.414 0.586s1.024-0.195 1.414-0.586l16.586-16.586v7.172c0 1.105 0.895 2 2 2s2-0.895 2-2v-14h-1.999z"></path>',
			twitter: '<path d="M32 6.076c-1.177 0.522-2.443 0.875-3.771 1.034 1.355-0.813 2.396-2.099 2.887-3.632-1.269 0.752-2.674 1.299-4.169 1.593-1.198-1.276-2.904-2.073-4.792-2.073-3.626 0-6.565 2.939-6.565 6.565 0 0.515 0.058 1.016 0.17 1.496-5.456-0.274-10.294-2.888-13.532-6.86-0.565 0.97-0.889 2.097-0.889 3.301 0 2.278 1.159 4.287 2.921 5.465-1.076-0.034-2.088-0.329-2.974-0.821-0.001 0.027-0.001 0.055-0.001 0.083 0 3.181 2.263 5.834 5.266 6.437-0.551 0.15-1.131 0.23-1.73 0.23-0.423 0-0.834-0.041-1.235-0.118 0.835 2.608 3.26 4.506 6.133 4.559-2.247 1.761-5.078 2.81-8.154 2.81-0.53 0-1.052-0.031-1.566-0.092 2.905 1.863 6.356 2.95 10.064 2.95 12.076 0 18.679-10.004 18.679-18.68 0-0.285-0.006-0.568-0.019-0.849 1.283-0.926 2.396-2.082 3.276-3.398z"></path>',
			umbrella: '<path d="M16 0c-8.82 0-16 7.178-16 16h4c0-0.826 0.676-1.5 1.5-1.5 0.828 0 1.5 0.674 1.5 1.5h4c0-0.826 0.676-1.5 1.5-1.5 0.828 0 1.5 0.674 1.5 1.5v10c0 1.102-0.895 2-2 2-1.102 0-2-0.898-2-2h-4c0 3.309 2.695 6 6 6 3.312 0 6-2.691 6-6v-10c0-0.826 0.676-1.5 1.5-1.5 0.828 0 1.498 0.674 1.498 1.5h4c0-0.826 0.68-1.5 1.5-1.5 0.828 0 1.5 0.674 1.5 1.5h4c0-8.822-7.172-16-15.998-16z"></path>',
			unlock: '<path d="M14.004 0c-5.516 0-9.996 4.484-9.996 10h3.996c0-3.309 2.688-6 6-6 3.305 0 5.996 2.691 5.996 6v2h-20v14c0 3.309 2.695 6 6 6h12c3.305 0 6-2.691 6-6v-16c0-5.516-4.488-10-9.996-10zM12 24c-1.102 0-2-0.895-2-2s0.898-2 2-2c1.109 0 2 0.895 2 2s-0.891 2-2 2z"></path>',
			user: '<path d="M12 16c-6.625 0-12 5.375-12 12 0 2.211 1.789 4 4 4h16c2.211 0 4-1.789 4-4 0-6.625-5.375-12-12-12zM6 6c0-3.314 2.686-6 6-6s6 2.686 6 6c0 3.314-2.686 6-6 6-3.314 0-6-2.686-6-6z"></path>',
			wondering: '<path d="M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13zM23.304 18.801l0.703 2.399-13.656 4-0.703-2.399zM8 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM20 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2z"></path>',
			"x-circle": '<path d="M16 0c-8.836 0-16 7.164-16 16s7.164 16 16 16 16-7.164 16-16-7.164-16-16-16zM23.914 21.086l-2.828 2.828-5.086-5.086-5.086 5.086-2.828-2.828 5.086-5.086-5.086-5.086 2.828-2.828 5.086 5.086 5.086-5.086 2.828 2.828-5.086 5.086 5.086 5.086z"></path>',
			android: '<path d="M50.143,45.057h-0.241c-2.13,0-3.857-1.735-3.857-3.875V24.713 c0-2.14,1.727-3.875,3.857-3.875h0.241c2.13,0,3.857,1.735,3.857,3.875v16.469C54,43.323,52.273,45.057,50.143,45.057z M39.777,51.112h-2.169v8.961c0,2.14-1.727,3.875-3.857,3.875h-0.241c-2.13,0-3.857-1.735-3.857-3.875v-8.961h-5.304v8.961 c0,2.14-1.727,3.875-3.857,3.875H20.25c-2.13,0-3.857-1.735-3.857-3.875v-8.961h-2.17c-2.663,0-4.821-2.169-4.821-4.844V21.565 h35.196v24.704C44.598,48.944,42.44,51.112,39.777,51.112z M18.451,5.498l-2.777-4.832c-0.1-0.174-0.041-0.396,0.132-0.496 l0.209-0.121c0.173-0.1,0.394-0.041,0.494,0.133l2.802,4.877c2.297-1.091,4.863-1.705,7.573-1.705c2.856,0,5.552,0.681,7.941,1.885 l2.906-5.056c0.1-0.174,0.321-0.233,0.494-0.133l0.209,0.121c0.173,0.1,0.232,0.322,0.132,0.496l-2.889,5.028 c4.989,2.866,8.459,8.094,8.901,14.169H9.191C9.643,13.645,13.271,8.316,18.451,5.498z M35.076,13.572 c0.865,0,1.567-0.705,1.567-1.574c0-0.87-0.702-1.574-1.567-1.574c-0.865,0-1.567,0.705-1.567,1.574 C33.509,12.867,34.21,13.572,35.076,13.572z M18.924,13.572c0.865,0,1.567-0.705,1.567-1.574c0-0.87-0.702-1.574-1.567-1.574 c-0.865,0-1.567,0.705-1.567,1.574C17.357,12.867,18.059,13.572,18.924,13.572z M4.098,45.057H3.857C1.727,45.057,0,43.323,0,41.182 V24.713c0-2.14,1.727-3.875,3.857-3.875h0.241c2.13,0,3.857,1.735,3.857,3.875v16.469C7.955,43.323,6.228,45.057,4.098,45.057z"/>',
			apple: '<path d="M43.061,34.522c0,8.67,8.393,12.374,8.393,12.374 c-2.057,8.63-9.252,15.172-9.252,15.172c-1.613,1.607-4.567,1.852-4.567,1.852c-2.377,0-5.309-1.34-5.309-1.34 c-2.259-1.299-5.426-1.301-5.426-1.301c-2.792,0-5.309,1.261-5.309,1.261C19.334,63.835,16.399,64,16.399,64 c-2.568,0-3.982-1.498-3.982-1.498C-0.546,50.658,0.003,35.271,0.003,35.271c0-19.645,15.576-19.586,15.576-19.586 c3.626,0,4.919,0.827,4.919,0.827c3.866,1.882,5.777,1.892,5.777,1.892c1.5,0,5.816-1.931,5.816-1.931 c2.223-1.052,5.778-1.064,5.778-1.064c8.325,0,11.984,6.424,11.984,6.424C42.702,26.182,43.061,34.522,43.061,34.522z M25.729,14.818C25.729,1.075,38.377,0,38.377,0C38.377,14.797,25.729,14.818,25.729,14.818z"/>',
			baidu: '<path d="M57.549,28.923c-0.219,7.717-6.714,8.677-6.714,8.677 c-8.176-0.648-7.673-8.677-7.673-8.677c-0.795-8.379,5.755-9.641,5.755-9.641C58,19.412,57.549,28.923,57.549,28.923z M37.407,20.246c-5.931,0-5.755-8.677-5.755-8.677c1.708-7.93,7.673-9.641,7.673-9.641c5.472,0.78,6.714,8.677,6.714,8.677 C44.174,21.255,37.407,20.246,37.407,20.246z M37.407,32.779c2.75,3.707,7.673,8.677,7.673,8.677 c7.267,4.21,7.673,10.605,7.673,10.605c0,13.939-14.387,10.605-14.387,10.605c-1.873-0.813-7.673-1.928-7.673-1.928h-4.796 c-2.325,0.456-10.551,1.928-10.551,1.928c-10.734,0-11.51-10.605-11.51-10.605c0-6.349,4.796-9.641,4.796-9.641 c6.151-4.696,9.592-9.641,9.592-9.641c5.137-7.284,9.591-6.749,9.591-6.749C33.569,25.744,37.407,32.779,37.407,32.779z M25.897,35.672H23.02v5.785h-6.714c-5.859,0.902-5.755,8.677-5.755,8.677c-0.551,5.375,5.755,7.713,5.755,7.713h9.591V35.672z M32.611,53.025V41.456h-4.796v12.533c-0.017,2.653,3.837,3.856,3.837,3.856h10.551v-16.39h-4.796v12.533h-2.877 C33.473,53.886,32.611,53.025,32.611,53.025z M17.265,46.277h5.755v7.713h-4.796c0,0-2.647-0.459-2.877-3.856 C15.346,50.133,15.452,46.899,17.265,46.277z M21.101,20.246c-6.799,0-6.714-10.605-6.714-10.605c0-9.31,6.714-9.641,6.714-9.641 c5.997,0,6.714,9.641,6.714,9.641C27.815,19.489,21.101,20.246,21.101,20.246z M6.714,33.743C0.544,33.743,0,24.102,0,24.102 c0-8.281,6.714-9.641,6.714-9.641c6.751,0,7.673,9.641,7.673,9.641C14.387,32.77,6.714,33.743,6.714,33.743z"/>',
			douban: '<path d="M0,64v-5.818h20.945c0,0-4.899-9.901-8.145-11.636l8.145-3.491 c0,0,5.56,12.555,5.818,15.127h13.964c0,0,5.825-11.048,5.818-15.127l6.982,3.491c0,0-3.36,10.254-5.295,11.512 c-0.447,0.029-0.656,0.069-0.523,0.124c0.157,0.065,0.336-0.002,0.523-0.124C51.09,57.875,64,58.182,64,58.182V64H0z M5.818,40.727 v-25.6h52.364v25.6H5.818z M48.873,20.945H15.127v13.964h33.745V20.945z M3.491,0H64v5.818H3.491V0z"/>',
			googleplay: '<path d="M55.532,34.556c-0.828,0.473-5.547,3.122-11.786,6.618 l-8.591-8.715l9.908-9.829c5.385,3.012,9.44,5.281,10.469,5.858C58,29.871,57.958,33.17,55.532,34.556z M3.177,0.02 c0.741-0.078,1.548,0.064,2.355,0.511c1.54,0.853,23.514,13.139,37.89,21.18l-9.536,9.46L3.177,0.02z M1.36,0.75l31.244,31.694 L2.074,62.731C0.89,62.224,0,61.115,0,59.574C0,56.662,0,5.559,0,3.55C0,2.412,0.532,1.401,1.36,0.75z M42.112,42.089 C27.972,50.01,7.556,61.427,5.419,62.575c-0.32,0.172-0.655,0.291-0.993,0.367l29.446-29.212L42.112,42.089z"/>',
			kaixinwang: '<path d="M60.549,30.164c0,0-3.494,8.614-16.984,12.25c0,0-0.502,11.237,0,15.076c0,0,1.59,4.938-4.718,3.769c0,0-6.539-0.588-13.21-9.423c0,0-2.071-1.431-2.831,0c0,0-5.588,5.249-9.436,7.538c0,0-7.049,0.734-7.549-3.769c0,0-2.985-13.205,0.944-21.672c0,0-0.269-2.116-0.944-2.827c0,0-8.864-10.313-4.718-22.615c0,0,1.108-1.884,5.661-0.942c0,0,7.295,4.273,8.492,4.711c0,0,3.262,0.609,3.774-0.942c0,0,7.578-9.802,14.153-11.307c0,0,7.228-0.583,7.549,6.596c0,0,2.168,10.163,1.887,13.192c0,0,1.659,4.159,4.718,3.769c0,0,9.924-0.088,12.266,1.885C59.605,25.453,61.958,26.999,60.549,30.164z M13.371,27.337c0.013-2.519-1.887-2.827-1.887-2.827c-3.341,0-2.831,1.884-2.831,1.884c-0.146,2.405,2.831,2.827,2.831,2.827C13.764,28.831,13.371,27.337,13.371,27.337zM14.314,32.991c-1.477,8.602,6.605,11.307,6.605,11.307c6.04,0.515,11.323-4.711,11.323-4.711c-7.647,2.452-11.323,0.942-11.323,0.942C14.869,38.902,14.314,32.991,14.314,32.991z M36.016,18.857c0,0-3.136-1.152-5.661,0.942c0,0-0.944,0.585-0.944-0.942c0,0-3.121-5.667-7.549-1.885c0,0-6.72,5.505-2.831,13.192c0,0,1.414,3.005,6.605,0.942c0,0,0.403,2.079,1.887,3.769c0,0,4.505,3.149,7.549-3.769C35.073,31.107,38.588,24.505,36.016,18.857z M41.678,33.933c0,0-3.622-0.382-3.774,2.827c0,0-0.038,2.695,2.831,2.827c0,0,2.968-0.587,2.831-2.827C43.565,36.76,43.968,33.933,41.678,33.933zM33.186,28.28c-2.024-0.756-1.887-3.769-1.887-3.769c0.251-1.965,2.831-2.827,2.831-2.827c2.763,0.114,0.944,3.769,0.944,3.769C34.54,29.362,33.186,28.28,33.186,28.28z M23.75,25.453c-2.17-0.976,0-4.711,0-4.711c1.118-2.725,2.831-1.885,2.831-1.885c2.222,0.41,0.944,3.769,0.944,3.769C27.212,24.78,23.75,25.453,23.75,25.453z"/>',
			laiwang: '<path d="M58.659,31.066V36.4h-5.618v-3.138h2.809v-4.707c3.787-6.594,2.185-13.179,2.185-13.179c-4.56-14.795-19.35-10.669-19.35-10.669c-0.413-0.661-4.057-2.51-4.057-2.51C38.404,0.023,43.679,0,43.679,0C59.986,1.348,61.78,14.748,61.78,14.748C64,25.266,58.659,31.066,58.659,31.066z M52.56,29.556c0,6.135-2.082,11.777-5.565,16.263v6.759h-7.79C35.388,54.753,30.98,56,26.28,56C11.766,56,0,44.16,0,29.556C0,14.951,11.766,3.111,26.28,3.111C40.794,3.111,52.56,14.951,52.56,29.556z M26.28,8.4c-11.611,0-21.024,9.472-21.024,21.156c0,11.684,9.413,21.156,21.024,21.156c3.336,0,6.489-0.786,9.291-2.178h7.405v-6.135c2.711-3.562,4.328-8.01,4.328-12.843C47.304,17.872,37.891,8.4,26.28,8.4z M37.411,32.667c-1.708,0-3.092-1.393-3.092-3.111c0-1.718,1.384-3.111,3.092-3.111c1.708,0,3.092,1.393,3.092,3.111C40.502,31.274,39.118,32.667,37.411,32.667z M26.28,32.667c-1.708,0-3.092-1.393-3.092-3.111c0-1.718,1.384-3.111,3.092-3.111c1.708,0,3.092,1.393,3.092,3.111C29.372,31.274,27.988,32.667,26.28,32.667z M15.15,32.667c-1.708,0-3.092-1.393-3.092-3.111c0-1.718,1.384-3.111,3.092-3.111c1.707,0,3.092,1.393,3.092,3.111C18.242,31.274,16.857,32.667,15.15,32.667z"/>',
			logo: '<path d="M148.981,8.452H153v2.684h-5.639c0,0-1.096-0.041-1.558-1.203l-1.246-2.468h-0.592V12h8.754l-1.277,3.455h1.464v5.059c0,0-0.127,1.542-2.305,1.542h-10.686v-2.468h9.191c0,0,0.222-0.072,0.218-0.216v-1.326h-2.617l0.779-3.085h-9.346l-1.215,5.152c0,0-0.526,2.224-2.742,1.944h-2.929v-2.684h1.589c0,0,0.487-0.065,0.592-0.494l0.935-3.918h-3.116V12h8.848V7.465h-0.498l-1.246,2.468c0,0-0.75,1.304-2.835,1.265h-4.175V8.452h3.801c0,0,0.486-0.029,0.685-0.432l0.187-0.555h-4.767v-2.56h8.848V3.918h-8.941V1.141h17.945c0,0,0.244-0.049,0.311-0.37V0.278h3.489v1.635c0,0-0.22,2.005-2.96,2.005h-5.982v0.956H153v2.591h-4.86l0.28,0.679C148.42,8.144,148.619,8.452,148.981,8.452zM132.313,29.738h-2.492c-0.235-1.372-1.34-1.234-1.34-1.234c-1.608,0-1.589,2.19-1.589,2.19c0,2.719,1.62,2.468,1.62,2.468c1.174,0,1.309-1.388,1.309-1.388h2.555c-0.293,3.657-3.832,3.517-3.832,3.517c-4.466,0-4.206-4.566-4.206-4.566c0-4.45,4.112-4.35,4.112-4.35C132.348,26.375,132.313,29.738,132.313,29.738z M124.525,4.997l-1.776-2.221h-10.811l-1.807,2.53c0,0-0.314,0.339-0.748,0.339h-3.147V2.869h1.34c0,0,0.099-0.001,0.187-0.154L109.633,0h15.266l1.9,2.622c0,0,0.13,0.167,0.374,0.154h1.09v2.776h-2.96C125.304,5.553,124.86,5.553,124.525,4.997z M103.807,30.54l3.084,4.535h-3.178l-1.495-2.529l-1.495,2.529H97.67l3.115-4.473l-2.804-4.01h3.084l1.277,2.344l1.277-2.344h2.96L103.807,30.54z M101.47,22.057h-4.735v-2.56h2.679c0.391,0,0.405-0.37,0.405-0.37v-4.35H86.111l-0.81,1.018c-0.476,0.574-1.277,0.494-1.277,0.494h-2.555v-2.931h0.716c0.4,0,0.53-0.247,0.53-0.247l1.277-2.098h-1.651V0.185h20.873v8.823c-0.05,2.132-2.118,2.098-2.118,2.098H88.074l-0.592,0.987h15.92v8.113C103.264,22.144,101.47,22.057,101.47,22.057z M99.258,2.961H85.924v1.45h13.334V2.961z M99.134,8.545c0,0,0.214-0.097,0.218-0.278V7.003H85.924v1.542H99.134z M84.18,18.91l2.337-3.177h4.268l-4.33,5.614c0,0-0.724,0.62-1.62,0.524h-3.458v-2.56h2.305C83.681,19.311,83.961,19.247,84.18,18.91z M87.388,28.751h-4.33v1.049h3.925v2.036h-3.925v1.08h4.455v2.159h-7.01v-8.483h6.885V28.751z M70.627,35.815l-1.776-3.085l1.807-3.054h3.552l1.807,3.085l-1.776,3.054H70.627z M17.197,17.954l1.807-3.054h3.552l1.807,3.085l-1.807,3.054h-3.583L17.197,17.954z M44.8,35.815l-5.016-8.637l3.614-6.108l5.016,8.576h13.677l6.761-11.661L62.06,6.324H48.414l-17.229,29.46l-20.78,0.062L0,17.923L10.375,0.154l20.811-0.031l5.016,8.637L32.619,14.9l-5.047-8.607H13.957L7.103,17.985l6.854,11.661h13.646l17.26-29.491h20.78l10.374,17.83l-10.406,17.83H44.8z M92.28,21.964h-3.521v-2.56h1.433c0.436,0.002,0.654-0.339,0.654-0.339l2.555-3.116h4.362l-4.299,5.553C93.035,21.922,92.28,21.964,92.28,21.964zM92.872,26.375c4.353,0,4.268,4.411,4.268,4.411c0,1.971-0.966,3.023-0.966,3.023l0.997,1.018L95.987,36l-1.122-1.172c-0.421,0.386-1.776,0.463-1.776,0.463c-4.572,0.019-4.393-4.473-4.393-4.473C88.83,26.208,92.872,26.375,92.872,26.375zM92.934,33.162c0,0,0.237-0.016,0.312-0.062l-0.717-0.71l1.184-1.141l0.685,0.709c0,0,0.187-0.29,0.187-1.08c0,0,0.181-2.375-1.682-2.375c0,0-1.651-0.176-1.651,2.406C91.252,30.91,91.207,33.162,92.934,33.162z M110.007,35.074h-2.555v-8.483h2.555V35.074z M111.222,26.591h2.555v5.306c0,1.379,1.34,1.265,1.34,1.265c1.259,0,1.309-1.296,1.309-1.296v-5.275h2.555v5.491c0,3.456-3.77,3.208-3.77,3.208c-4.308,0-3.988-3.27-3.988-3.27V26.591z M128.17,19.28v2.776h-21.746v-2.746h2.15V7.095h3.209V19.28h3.676V4.689h3.583V8.73h8.941v2.961h-8.941v7.589H128.17z M123.06,35.074h-2.43V32.73h2.43V35.074z M137.672,26.375c4.254,0,4.237,4.38,4.237,4.38c0,4.688-4.175,4.535-4.175,4.535c-4.524,0-4.268-4.658-4.268-4.658C133.699,26.191,137.672,26.375,137.672,26.375z M136.021,30.848c0,2.339,1.651,2.314,1.651,2.314c1.762,0,1.682-2.345,1.682-2.345c0.002-2.392-1.651-2.344-1.651-2.344C135.947,28.473,136.021,30.848,136.021,30.848z M148.109,31.589l1.215-4.997h3.645v8.483h-2.43v-5.553l-1.464,5.553h-1.932l-1.464-5.46v5.46h-2.43v-8.483h3.645L148.109,31.589z"/>',
			logo2: '<path d="M23.103,24l2.397-4.216h4.795l2.397,4.108l-2.397,4.216H25.5L23.103,24z M60.154,48l-6.756-11.568l4.795-8.216l6.756,11.46h18.308L92.41,24L83.256,8.324H64.949L41.846,48H13.949L0,24L13.949,0h27.897l6.756,11.568l-4.795,8.216l-6.756-11.46H18.744L9.59,24l9.154,15.676h18.308L60.154,0h27.897L102,24L88.051,48H60.154zM99.494,39.676L102,43.784L99.603,48h-4.904l-2.397-4.216l2.397-4.108H99.494z"/>',
			code: '<path d="M64,64h-7V50h7V64z M50,50v-7h7v7H50z M43,50h-7V36h14v7h-7V50zM64,36v7h-7v-7H64z M36,0h28v28H36V0z M40,24h20V4H40V24z M43,7h14v14H43V7z M0,36h28v28H0V36z M4,40v20h20V40H4z M7,43h14v14H7V43z M0,0h28v28H0V0z M4,24h20V4H4V24z M7,7h14v14H7V7z M50,57v7H36v-7H50z"/>',
			computer: '<path d="M61,44H38.676l6.199,8.769c0,0,1.125,1.64,0,3.231h-9.289h-6.697h-9.733c-1.156-1.591,0-3.231,0-3.231L25.527,44H3c-1.657,0-3-1.343-3-3V3c0-1.657,1.343-3,3-3h58c1.657,0,3,1.343,3,3v38C64,42.657,62.657,44,61,44z M32,42c1.105,0,2-0.895,2-2s-0.895-2-2-2c-1.105,0-2,0.895-2,2S30.895,42,32,42z M60,5H4v31h56V5z"/>',
			dengpao: '<path d="M40,44.969V52c0,3.314-2.686,6-6,6h-1v3.5c0,1.381-1.119,2.5-2.5,2.5h-11c-1.381,0-2.5-1.119-2.5-2.5V58h-1c-3.314,0-6-2.686-6-6v-7.041C3.936,40.403,0,33.171,0,25C0,11.193,11.193,0,25,0s25,11.193,25,25C50,33.173,46.068,40.413,40,44.969z M25,7C15.059,7,7,15.059,7,25c0,0.585,0.033,1.162,0.088,1.733c0.02,0.206,0.056,0.407,0.082,0.611c0.047,0.357,0.095,0.714,0.162,1.064c0.048,0.251,0.11,0.496,0.168,0.743c0.069,0.29,0.139,0.58,0.222,0.864c0.079,0.273,0.168,0.542,0.26,0.809c0.083,0.242,0.17,0.482,0.263,0.719c0.113,0.29,0.232,0.575,0.359,0.858c0.089,0.195,0.183,0.386,0.278,0.577c0.152,0.307,0.307,0.611,0.475,0.907c0.078,0.137,0.163,0.268,0.244,0.402c0.202,0.334,0.406,0.667,0.629,0.987c0.006,0.009,0.014,0.018,0.02,0.027c1.674,2.393,3.914,4.354,6.527,5.699C16.3,41.532,16,42.228,16,43v6c0,1.657,1.343,3,3,3h12c1.657,0,3-1.343,3-3v-6c0-0.772-0.3-1.468-0.778-2c2.998-1.544,5.497-3.904,7.222-6.788c0.062-0.103,0.127-0.203,0.186-0.306c0.177-0.31,0.34-0.629,0.499-0.951c0.09-0.181,0.179-0.361,0.262-0.545c0.13-0.286,0.251-0.577,0.366-0.871c0.093-0.236,0.179-0.474,0.261-0.715c0.091-0.267,0.18-0.535,0.259-0.808c0.084-0.287,0.154-0.578,0.224-0.871c0.058-0.245,0.119-0.487,0.167-0.736c0.068-0.353,0.117-0.712,0.164-1.072c0.026-0.202,0.062-0.401,0.081-0.605C42.967,26.163,43,25.586,43,25C43,15.059,34.941,7,25,7z M28.5,48h-7c-1.381,0-2.5-1.119-2.5-2.5v-1c0-1.381,1.119-2.5,2.5-2.5h7c1.381,0,2.5,1.119,2.5,2.5v1C31,46.881,29.881,48,28.5,48z"/>',
			normaluser: '<path d="M31.5,64C59.433,56.326,63,32.541,63,24.694C63,16.846,60.61,8.58,54.309,0C49.566,1.885,39.207,2.721,31.5,0C23.794,2.721,13.434,1.885,8.692,0C2.39,8.58,0,16.846,0,24.694C0,32.541,3.568,56.326,31.5,64z"/>',
			pad: '<path d="M49,64H3c-1.657,0-3-1.343-3-3V3c0-1.657,1.343-3,3-3h46c1.657,0,3,1.343,3,3v58C52,62.657,50.657,64,49,64z M26,62c1.657,0,3-1.343,3-3s-1.343-3-3-3s-3,1.343-3,3S24.343,62,26,62z M45,6H7v48h38V6z"/>',
			pengyou: '<path d="M52.671,41.29c0,0,3.271,9.101-5.532,11.011c0,0-7.661,1.98-11.065-11.011c0,0-3.688-10.606-3.688-12.846c0,0,11.041-2.228,18.442-1.835c0,0,11.116,0.842,11.065,9.175C61.892,35.785,62.397,43.503,52.671,41.29z M52.671,22.939c-5.253,0.729-21.208,3.67-21.208,3.67V7.34C31.264,1.286,39.762,0,39.762,0c7.386,0.19,6.455,7.34,6.455,7.34c10.325-4.012,11.065,7.34,11.065,7.34C57.501,18.724,52.671,22.939,52.671,22.939z M7.488,28.444c0,0-8.17-0.479-7.377-8.258c0,0-1.714-6.644,8.299-6.423c0,0-3.114-11.531,11.065-11.011c0,0,6.523-0.627,8.299,7.34c0,0,3.449,12.205,2.766,16.516C30.541,26.609,18.663,27.596,7.488,28.444z M31.463,28.444c-0.872,4.484,1.844,12.846,1.844,12.846c3.235,6.336,0.922,11.011,0.922,11.011c-2.931,8.699-11.987,7.34-11.987,7.34c-6.323-1.717-6.455-8.258-6.455-8.258c-5.134-0.13-7.377-1.835-7.377-1.835c-5.279-1.891-2.766-11.011-2.766-11.011C14.528,26.962,31.463,28.444,31.463,28.444z"/>',
			qq: '<path d="M173.94,152.517c0,0-7.239,0.531-15.89-15.949c0,0-7.897,20.246-13.904,24.921c0,0,15.89,5.883,15.89,17.943c0,0-2.979,19.937-36.746,19.937c0,0-22.406,0.632-30.787-13.956h-2.979v-0.309l-2.979,0.309C78.162,200,55.756,199.368,55.756,199.368c-33.767,0-36.746-19.937-36.746-19.937c0-12.06,15.89-17.943,15.89-17.943c-6.007-4.675-13.904-24.921-13.904-24.921c-8.651,16.48-15.89,15.949-15.89,15.949c-17.583-29.635,15.89-60.807,15.89-60.807c-5.712-18.322,5.959-26.915,5.959-26.915C29.54,0.66,89.523,0,89.523,0s59.983,0.66,62.568,64.795c0,0,11.671,8.593,5.959,26.915C158.05,91.709,191.523,122.882,173.94,152.517z"/>',
			qqliulanqi: '<path d="M64,55.332c0,4.57-3.122,8.311-7.081,8.642V64H31.793c-0.02,0-0.039-0.007-0.059-0.007C14.184,63.849,0,49.584,0,32C0,14.327,14.327,0,32,0s32,14.327,32,32c0,5.69-1.492,11.029-4.096,15.66C62.338,49.11,64,51.999,64,55.332z M32,14.222c-9.818,0-17.778,7.959-17.778,17.778c0,7.131,4.208,13.262,10.268,16.092c1.219-2.013,3.562-3.394,6.287-3.394c0.893,0,1.743,0.156,2.533,0.424c1.731-5.002,6.017-8.551,11.047-8.551c1.599,0,3.12,0.368,4.512,1.017c0.583-1.759,0.91-3.634,0.91-5.588C49.778,22.182,41.818,14.222,32,14.222z"/>',
			qqweibo: '<path d="M60.847,26.088c-8.08-2.418-13.422-13.494-13.422-13.494c-2.424,0-2.684-2.699-2.684-2.699c0-3.708,2.684-3.598,2.684-3.598c3.337,0,3.579,3.598,3.579,3.598c0.013,1.683-1.79,2.699-1.79,2.699c2.627,8.909,12.527,11.695,12.527,11.695C64,25.295,60.847,26.088,60.847,26.088z M54.583,16.192c0,0-1.339,0.621-0.895-0.9c0,0,1.906-1.828,1.79-5.398c0,0-0.266-8.096-8.053-8.096c0,0-7.158,0.059-7.158,8.096c0,0,0.001,8.096,7.158,8.096c0,0,1.785,1.974,0,1.799c0,0-8.948-0.952-8.948-9.895c0,0,0.135-9.895,9.843-9.895c0,0,8.948,1.557,8.948,9.895C57.267,9.895,56.836,14.713,54.583,16.192z M17.001,38.682h-3.579c0,0-2.586-0.992-0.895-2.699c0,0,17.896,2.971,17.896-14.393c0,0-0.252-13.494-13.422-13.494c0,0-14.317,1.116-14.317,14.393c0,0,0.037,4.655,1.79,6.297c0,0,0.568,3.071-1.79,0.9c0,0-2.521-3.105-2.684-7.197c0,0,1.061-17.092,17.001-17.092c0,0,16.107,0.699,16.107,16.193C33.108,21.59,32.527,38.682,17.001,38.682z M12.527,24.289c0,0-1.74-4.156,1.79-7.197c0,0,5.442-2.025,8.053,2.699c0,0,1.083,4.133-1.79,6.297c0,0-3.242,1.586-6.264,0c0,0-9.393,9.066-8.948,17.992c0.029,0.574,0,10.795,0,10.795S4.337,58,1.79,55.774V44.08C1.79,44.08,4.022,30.876,12.527,24.289z"/>',
			qqzone: '<path d="M49.096,31.429L51.726,55L32.438,43.651L13.151,55l1.753-22.698L0,19.206h21.918L32.438,0l11.397,19.206H64L49.096,31.429z M47.342,21.825H21.041l15.781,2.619L17.534,41.032h29.808L29.808,37.54L47.342,21.825z"/>',
			renren: '<path d="M26.667,0h12c0,0-5.9,40.406,25.333,51.726L58,63c0,0-20.229-14.581-24-29.179c0,0-12.018,22.795-27.333,28.516L0,54.379C0,54.379,31.489,46.61,26.667,0z"/>',
			sendcompany: '<path d="M56,37L32,13L8,37H0v-6L31,0h2l31,31v6H56z M53,38v26H39V43H25v21H11V38l21-21L53,38z"/>',
			scenegift: '<path d="M34.133,63.954V25.581H64v38.372H34.133z M0,12.791h14.821C8.033,11.603,8,4.996,8,4.996C8.056,0.071,13,0,13,0c9.28-0.03,15.986,11.202,16.888,12.791h4.237C35.125,11.201,42.504-0.046,51,0c0,0,5.046,0.083,5,4.996c0,0,0.061,6.606-6.823,7.794H64v8.527H0V12.791z M53,5.996c0.062-1.888-2-1.999-2-1.999c-8.038-0.049-13,8.993-13,8.993C50.389,13.03,53,5.996,53,5.996z M13,3.997c0,0-1.983,0.024-2,1.999s2.81,6.995,15,6.995C26,12.991,20.979,3.981,13,3.997z M29.867,63.954H0V25.581h29.867V63.954z"/>',
			scenesend: '<path d="M0,24.889L64,0L46.222,64L24.889,46.222l24.889-32l-32,24.889L0,24.889z M10.667,39.111l14.222,10.667L14.222,60.444L10.667,39.111z"/>',
			taobao: '<path d="M48.988,48.946c-4.903,0-7.901-1.579-7.901-1.579l0.79-3.947l7.111,0.789c6.122,0,6.321-5.526,6.321-5.526V14.21c0-7.378-7.901-7.895-7.901-7.895c-6.463,0-15.012,3.158-15.012,3.158l3.16,1.579c0.142,1.015-3.16,4.737-3.16,4.737h20.543v3.947H41.086v3.947h11.852v3.947H41.086v9.473l4.741-2.368l-0.79-3.947l4.741-1.579l3.951,10.263l-5.531,2.368l-1.58-3.947c-5.47,3.996-14.222,4.737-14.222,4.737h-7.111c-4.661,0-5.531-5.526-5.531-5.526v-7.105h7.111v3.158c-0.14,5.157,7.111,4.737,7.111,4.737V27.631H21.333v-3.947h12.642v-3.947h-5.531c-0.316,2.196-3.951,3.158-3.951,3.158s-2.819-0.519-3.16-1.579c2.749-1.888,6.321-9.473,6.321-9.473c-4.473,0.22-8.691,6.316-8.691,6.316l-4.741-3.947C19.296,12.449,22.914,0,22.914,0l7.111,1.579c0.106,1.229-1.58,4.737-1.58,4.737c11.708-3.875,23.704-3.158,23.704-3.158C63.475,4.407,64,15,64,15v21.315C64,49,48.988,48.946,48.988,48.946z M11.062,10.263c-5.479,0-5.531-4.737-5.531-4.737c0-5.404,5.531-4.737,5.531-4.737c5.138,0,5.531,4.737,5.531,4.737C16.593,10.074,11.062,10.263,11.062,10.263z M2.37,18.157l3.951-5.526c11.83,10.053,11.062,12.631,11.062,12.631c-0.264,5.059-9.482,22.105-9.482,22.105L0,41.841L11.852,29.21c1.392-1.303,0-3.947,0-3.947C11.562,22.982,2.37,18.157,2.37,18.157z"/>',
			tieba: '<path d="M64,28.804v33.072H36.267c0,0-0.933,0.052-1.067-2.134V32.005c0,0-1.165-3.201,5.333-3.201V1.067h6.4v4.267H64v6.401H46.933v17.069H64z M42.667,36.272v19.203h13.867V36.272H42.667z M14.933,55.475c0,0-4.911,5.24-12.8,6.401l-1.067-4.267c0,0,8.079-3.243,9.6-7.468V13.869c0,0,0.682-2.067,4.267-2.134c0,0,3.289,0.126,3.2,2.134V46.94c0,0,0.469,6.066,11.733,10.668L28.8,62.943C28.8,62.943,22.857,64,14.933,55.475z M23.467,9.601c0,0,0.113-3.437-8.533-3.201c0,0-8.533,0.099-8.533,3.201V46.94H0V0h29.867v46.94h-6.4V9.601z"/>',
			time: '<path d="M57.094,17.342L39.191,4.248c3.421-4.74,10.201-5.651,15.145-2.035C59.28,5.829,60.514,12.602,57.094,17.342z M56.896,34.986c0.016,15.224-12.23,27.578-27.352,27.594C14.421,62.597,2.149,50.268,2.133,35.044C2.117,19.821,14.363,7.466,29.485,7.45C44.608,7.434,56.88,19.762,56.896,34.986z M29.492,14.27c-10.206,0.011-18.663,7.491-20.294,17.297H8.966v6.895h0.231c1.633,9.824,10.118,17.308,20.339,17.297C39.742,55.75,48.2,48.269,49.83,38.463h0.232v-6.895h-0.23C48.199,21.743,39.713,14.26,29.492,14.27z M14.103,38.463v-6.895H26.09V16.915h6.849v14.653v6.895H26.09H14.103z M4.692,2.213c4.944-3.616,11.724-2.705,15.145,2.035L1.935,17.342C-1.486,12.602-0.251,5.829,4.692,2.213z"/>',
			uc: '<path d="M53.093,32.265c-7.527-5.77-19.034-7.054-19.034-7.054c5.833-1.908,12.021-7.054,12.021-7.054c-0.333-6.053,2.003-8.061,2.003-8.061c1.492,1.376,3.005,6.046,3.005,6.046C64,21.39,61.107,32.265,61.107,32.265H53.093z M26.046,26.219c0,0-16.028,6.346-16.028,20.153c0,0,0.893,11.278,8.172,13.661C12.446,58.893,0,55.07,0,43.35c0-15.233,13.134-18.434,14.025-27.207c0,0-1.021-8.061-7.012-8.061c0,0-4.643,0.683-6.01,2.015c0,0,5.962-10.617,18.032-10.077c0,0,12.937,0.063,14.025,11.084C33.058,11.104,34.791,19.555,26.046,26.219z M18.189,60.034c1.721,0.342,2.848,0.446,2.848,0.446C19.991,60.48,19.048,60.315,18.189,60.034z M16.028,48.388c0,0,0.948-8.061,8.014-8.061c0,0,9.016,0.132,9.016,8.061c0,0-0.119,9.069-8.014,9.069C25.044,57.457,16.028,58.129,16.028,48.388z M20.035,48.388c0,4.649,4.007,5.038,4.007,5.038c4.47,0,5.009-4.031,5.009-4.031c0-4.625-5.009-5.038-5.009-5.038C19.821,44.233,20.035,48.388,20.035,48.388z M37.065,48.388c0,0-0.189-12.092-11.019-12.092c0,0-4.6-1.381-11.019,3.023c0,0,3.518-7.19,12.021-7.054c0,0,15.761,0.647,16.028,17.13c0,0-0.817,6.053-3.005,7.054c0,0,7.737-1.618,10.018,4.031H28.049C28.049,60.48,36.582,59.201,37.065,48.388z M46.081,41.334c0,0-4.805-11.215-21.037-12.092c0,0,8.813-2.856,17.03,1.008l8.014,5.038c0,0,1.677,0.997,5.009,1.008c0,0,6.234,0.472,7.012,4.031c0,0-5.923-1.36-8.014,0C54.095,40.327,50.536,44.644,46.081,41.334z"/>',
			voice: '<path d="M38.246,32.653c0,9.68-7.396,17.645-16.902,18.686v8.482h8.451V64H8.667v-4.18h8.451v-8.482C7.612,50.298,0.216,42.333,0.216,32.653c0-1.815-0.485-2.548,0-4.209h4.111c-0.629,1.624,0.114,2.365,0.114,4.209c0,8.079,6.621,14.629,14.79,14.629S34.02,40.732,34.02,32.653c0-1.843,0.743-2.584,0.114-4.209h4.111C38.731,30.105,38.246,30.838,38.246,32.653z M19.231,42.667h-1.028c-5.393,0-9.764-4.321-9.764-9.651V9.651C8.438,4.321,12.81,0,18.203,0h1.028c5.393,0,9.764,4.321,9.764,9.651v23.365C28.995,38.346,24.623,42.667,19.231,42.667z"/>',
			wechat: '<path d="M171.484,138.214l6.938,21.872l-26.761-14.913c-72.415-0.249-66.407-49.709-66.407-49.709c0-28.146,34.69-40.761,34.69-40.761c75.009-16.33,78.301,42.749,78.301,42.749C198.245,125.746,171.484,138.214,171.484,138.214z M122.245,78.086c-4.418,0-8,3.582-8,8c0,4.418,3.582,8,8,8c4.418,0,8-3.582,8-8C130.245,81.667,126.663,78.086,122.245,78.086z M165.245,78.086c-4.418,0-8,3.582-8,8c0,4.418,3.582,8,8,8c4.418,0,8-3.582,8-8C173.245,81.667,169.663,78.086,165.245,78.086z M90.209,69.616c-17.464,24.322-4.956,47.72-4.956,47.72c-2.767,2.24-7.929,1.988-7.929,1.988H61.466l-36.673,16.901l8.92-25.849C-1.755,92.678,0.015,60.668,0.015,60.668v-2.982C6.983-1.914,70.386,0.024,70.386,0.024c30.227-0.665,46.584,12.924,46.584,12.924c19.951,11.217,24.779,32.808,24.779,32.808C107.066,46.955,90.209,69.616,90.209,69.616z M41.245,30.086c-6.075,0-11,4.925-11,11s4.925,11,11,11s11-4.925,11-11S47.32,30.086,41.245,30.086z M108.245,41.086c0-6.075-4.925-11-11-11c-6.075,0-11,4.925-11,11s4.925,11,11,11C103.32,52.086,108.245,47.161,108.245,41.086z"/>',
			weibo: '<path d="M199.389,65.394c0,0-0.493,9.988-10.011,9.988c0,0-10.252-1.807-7.007-11.985c0,0,11.965-41.924-36.038-47.942c0,0-17.018,5.194-17.018-6.991c0,0,1.506-7.99,8.008-7.99C137.322,0.473,204.096-9.8,199.389,65.394z M143.329,40.425c0,0-8.008,1.063-8.008-6.992c0,0,2.411-5.993,7.007-5.993c0,0,34.003-5.033,30.032,32.96c0,0-1.923,5.993-6.006,5.993c0,0-8.008,0.682-8.008-7.99C158.345,58.403,162.869,40.425,143.329,40.425z M133.318,45.419c0,0,17.018,0.911,17.018,16.979c0,0,0.245,9.102-4.004,12.984c0,0,29.031,6.811,29.031,28.965c0,0-0.251,56.931-91.097,56.931c0,0-84.09,0.922-84.09-52.936c0,0-4.081-25.111,27.029-54.933c31.109-29.822,48.801-30.962,57.061-30.962c0,0,16.017-0.976,16.017,15.98c0,0-0.412,11.219-3.003,14.982C97.28,53.409,116.344,45.419,133.318,45.419z M78.259,71.387c0,0-49.884,3.469-58.062,42.948c0,0-0.603,30.22,52.055,34.958c0,0,54.006,2.183,66.07-36.955C138.324,112.337,151.405,74.021,78.259,71.387z M73.12,142.2c-26.866-0.565-28.931-22.871-28.931-22.871c-1.094-30.22,32.921-32.815,32.921-32.815c31.985-0.314,30.926,25.854,30.926,25.854C106.16,142.199,73.12,142.2,73.12,142.2z M67.135,110.379c0,0-11.971,1.423-11.971,9.944c0,0-1.051,8.95,9.976,8.95c0,0,10.974-1.898,10.974-9.944C76.113,119.328,77.207,110.379,67.135,110.379z M83.097,106.401c0,0-3.99-0.664-3.99,2.983c0,0-0.929,2.983,2.993,2.983c0,0,3.99-0.785,3.99-3.978C86.089,108.39,85.751,106.401,83.097,106.401z"/>',
			windows: '<path d="M28.984,59.594V33.416H63V64L28.984,59.594z M28.984,4.406L63,0v30.584H28.984V4.406z M0,33.416h26.149v25.487L0,55.231V33.416z M0,8.769l26.149-3.672v25.487H0V8.769z"/>',
			yixin: '<path d="M45.364,58.38c4.124,2.52,10.259,2.797,10.259,2.797C44.551,65,36.341,63.943,30.867,61.901C13.807,61.829,0,48.002,0,30.952C0,13.858,13.879,0,31,0s31,13.858,31,30.952C62,42.869,55.251,53.207,45.364,58.38z M31,14.977c-8.837,0-16,7.153-16,15.975c0,5.364,2.656,10.098,6.718,12.996c-3.185,4.404-11.86,5.579-11.86,5.579c19.676,4.767,29.433-4.088,31.788-6.672C44.924,39.93,47,35.688,47,30.952C47,22.129,39.837,14.977,31,14.977z"/>',
			zhifubao: '<path d="M63.021,50L36.949,36.957c-10.737,11.987-22.813,10.87-22.813,10.87c-15.115,0-14.122-11.957-14.122-11.957C-0.088,22.841,15.222,25,15.222,25c8.559,0.109,18.468,3.261,18.468,3.261c3.55-4.164,4.345-9.783,4.345-9.783H10.877v-2.174h13.036V10.87H7.618V8.696h16.295V0h8.691v8.696h16.295v2.174H32.604v5.435h14.122c0.153,3.882-5.432,15.217-5.432,15.217l21.727,6.522V50z M14.136,28.261c0,0-11.95-2.295-11.95,7.609c0,0-1.54,7.609,10.863,7.609c0,0,11.464,0.271,17.381-9.783C30.431,33.696,23.002,28.261,14.136,28.261z"/>'
		}
	}();
var tplCount = 0,
	qyCommon = function() {
		var a = function(a) {
				var b, c, d = parseInt(a.type,10);
				return 0 === d && (b = "fadeIn"), 1 === d && (c = parseInt(a.direction,10), 0 === c && (b = "fadeInLeft"), 1 === c && (b = "fadeInDown"), 2 === c && (b = "fadeInRight"), 3 === c && (b = "fadeInUp")), 6 === d && (b = "wobble"), 5 === d && (b = "rubberBand"), 7 === d && (b = "rotateIn"), 8 === d && (b = "flip"), 9 === d && (b = "swing"), 2 === d && (c = parseInt(a.direction,10), 0 === c && (b = "bounceInLeft"), 1 === c && (b = "bounceInDown"), 2 === c && (b = "bounceInRight"), 3 === c && (b = "bounceInUp")), 3 === d && (b = "bounceIn"), 4 === d && (b = "zoomIn"),41 === d && (b = "zoomInRoll"),51 === d && (b = "filterSepia"),52 === d && (b = "filterGrayScale"),53 === d && (b = "filterBlur"),54 === d && (b = "filterInvert"),55 === d && (b = "filterSaturate"),56 === d && (b = "filterContrast"),57 === d && (b = "filterBrightness"),58 === d && (b = "filterHueRotate"),59 === d && (b = "flash"),61===d&&(b="showWaver"),62===d&&(b="showBreath"),63===d&&(b="showWaver2"), 10 === d && (b = "fadeOut"), 11 === d && (b = "flipOutY"), 12 === d && (b = "rollIn"), 13 === d && (b = "lightSpeedIn"), 14 === d && (b = "bounceOut"), 15 === d && (b = "rollOut"), 16 === d && (b = "lightSpeedOut"), 17 === d && (c = parseInt(a.direction,10), 0 === c && (b = "fadeOutRight"), 1 === c && (b = "fadeOutDown"), 2 === c && (b = "fadeOutLeft"), 3 === c && (b = "fadeOutUp")), 18 === d && (b = "zoomOut"), 19 === d && (c = parseInt(a.direction,10), 0 === c && (b = "bounceOutRight"), 1 === c && (b = "bounceOutDown"), 2 === c && (b = "bounceOutLeft"), 3 === c && (b = "bounceOutUp")), 20 === d && (b = "flipInY"), 21 === d && (b = "tada"), 23 === d && (b = "hinge"), 22 === d && (b = "jello"), 66 === d && (b = "jello2"), 26 === d && (b = "twisterInDown"), 65 === d && (b = "twisterInDown2"), 27 === d && (b = "puffIn"), 28 === d && (b = "puffOut"), 29 === d && (b = "slideDown"),67 === d && (b = "slideUp3"), 68 === d && (b = "flipInY2"), 69 === d && (b = "incline"), 70 === d && (b = "stagger"), 71 === d && (b = "shadow1"),72 === d && (b = "shadow2"),73 === d && (b = "flashx1"),74 === d && (b = "flashx2"),75 === d && (b = "change1"), 76 === d && (b = "entrance"), 77 === d && (b = "flipInx"), 78 === d && (b = "flipInxy"), 79 === d && (b = "diffusion"), 80 === d && (b = "bachelordom01"), 81 === d && (b = "earthquake"),82 === d && (b = "rotate03"),83 === d && (b = "immigration"),84 === d && (b = "immigration2"),85 === d && (b = "towards1"),86 === d && (b = "towards2"),87 === d && (b = "towards3"),88 === d && (b = "shakedong"),89 === d && (b = "Shrinko"),90 === d && (b = "immigration3"),91 === d && (b = "immigration4"),92 === d && (b = "flicker"),93 === d && (b = "searchlight"),94 === d && (b = "rotatea3"),95 === d && (b = "swing2"),96 === d && (b = "vague"), 30 === d && (b = "slideUp"), 64 === d && (b = "slideUp2"), 24 === d && (b = "flipInX"), 25 === d && (b = "flipOutX"), 31 === d && (b = "twisterInUp"), 32 == d && (b = "vanishOut"), 33 == d && (b = "vanishIn"), b
			},
			b = function(a, b, c) {
				function d(a, b, f) {
					if (f.length && e < f.length) {
						a.css("animation", "");
						a.get(0);
						a.css("animation", b[e] + " " + f[e].duration + "s ease " + f[e].delay + "s " + (f[e].countNum ? f[e].countNum : "")), "view" == c ? (f[e].count && e == f.length - 1 && a.css("animation-iteration-count", "infinite"), a.css("animation-fill-mode", "both")) : (a.css("animation-iteration-count", "1"), a.css("animation-fill-mode", "backwards")), f[e].linear && a.css("animation-timing-function", "linear"), a.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
							e++, d(a, b, f)
						})
					}
				}
				var e = 0;
				if (b.properties && b.properties.anim) {
					var f = [];
					b.properties.anim.length ? f = b.properties.anim : f.push(b.properties.anim);
					var g = $(".element-box", a);
					g.attr("element-anim", "");
					for (var h, i = [], j = [], k = 0, l = f.length; l > k; k++) null != f[k].type && -1 != f[k].type && (h = qyCommon.convertType(f[k]), i.push(h), j.push(f[k]));
					b.properties.anim.trigger ? a.click(function() {
						d(g, h, b.properties.anim)
					}) : d(g, i, j)
				}
			},
			c = function(a, b) {
				var c = $(a);
				b.trigger && b.trigger.receives && b.trigger.receives.length && $.each(b.trigger.receives, function(a, d) {
					if (d.ids.length) {
						var e = utilTrigger.getHandleType(d.type).name;
						("show" == e || "randomEvent" == e) && c.hide(), "hide" == e && c.show(), c.bind(e, function() {
							if ("show" == e) $(this).show();
							else if ("hide" == e) $(this).hide();
							else if ("randomEvent" == e) {
								$(this).show();
								var a = Math.floor(Math.random() * b.properties.pics.length);
								$(this).find("img").css({
									display: "none"
								}), $(this).find("img").eq(a).css({
									display: "block"
								})
							}
						})
					}
				})
			},
			d = function() {
				var a, b, c = window.navigator,
					d = ["language", "browserLanguage", "systemLanguage", "userLanguage"];
				if ($.isArray(c.languages)) for (a = 0; a < c.languages.length; a++) if (b = c.languages[a], b && b.length) return b;
				for (a = 0; a < d.length; a++) if (b = c[d[a]], b && b.length) return b;
				return null
			};
		return {
			convertType: a,
			animation: b,
			bindTrigger: c,
			getFirstBrowserLanguage: d
		}
	}();
!
function() {
	window.qy = {}, window.qy.money = {
		config: {
			mode: 3,
			effectCallback: "editMoney",
			imageCallback: "countMoney",
			resources: [{
				url: CLIENT_CDN + "static/js/wp/countMoney.js",
				type: "js"
			}, {
				url: CLIENT_CDN + "images/moneybg.png",
				type: "image"
			}, {
				url: CLIENT_CDN + "images/moremoney.png",
				type: "image"
			}, {
				url: CLIENT_CDN + "images/flymoney.png",
				type: "image"
			}, {
				url: CLIENT_CDN + "images/float.png",
				type: "image"
			}, {
				url: CLIENT_CDN + "images/float2.png",
				type: "image"
			}, {
				url: CLIENT_CDN + "images/float3.png",
				type: "image"
			}]
		}
	}
}(), function(a, b) {
	a.completeEffect = function(a) {
		return a.find(".lock").get(0) ? !1 : !0
	}
}(window, jQuery),function(a, b) {
	function c(a, c) {
		completeEffect(b(".z-current")) && (C = "started", B.length || (B = l.find(".main-page")), c || (z ? (a = event, o = {
			x: a.touches[0].pageX - l.offset().left,
			y: a.touches[0].pageY - l.offset().top
		}) : o = {
			x: a.pageX - l.offset().left,
			y: a.pageY - l.offset().top
		}))
	}
	function d(a, c) {
		if (C = "turning", U.obj.property.autoFlip && U.obj.property.autoFlipTime && k(), c || (z ? (a = event, p = {
			x: a.touches[0].pageX - l.offset().left,
			y: a.touches[0].pageY - l.offset().top
		}) : p = {
			x: a.pageX - l.offset().left,
			y: a.pageY - l.offset().top
		}), q = p.x - o.x, 0 > q) {
			if (v) {
				v = !1, z && n ? t = !0 : o.y >= l.height() / 2 ? r = !0 : o.y < l.height() / 2 && (s = !0), w = b(".z-current").get(0);
				var d = b(w).find(".m-img").attr("id").substring(4);
				if (m = b("#flip" + d), X || (x = b(w).parent(".flip-mask").get(0).nextElementSibling && b(b(w).parent(".flip-mask").get(0).nextElementSibling).find(".main-page").get(0) ? b(b(w).parent(".flip-mask").get(0).nextElementSibling).find(".main-page").get(0) : y ? B.first().get(0) : !1), x) {
					b(x).find(".m-img").attr("id").substring(4);
					b(w).parent(".flip-mask").css({
						zIndex: 100,
						display: "block"
					}), b(x).addClass("z-active").parent(".flip-mask").css({
						zIndex: 99,
						display: "block"
					}), i(x), completeEffect(b(x)) || b("#audio_btn").css("opacity", 0), r ? (b(".z-current").css({
						top: m.height() - l.height() + "px",
						left: "0"
					}), m.css({
						top: "-" + (m.height() - l.height()) + "px"
					}), b(".turning").css({
						transformOrigin: "0% 100% 0px",
						left: l.width() + "px",
						top: l.height() + "px"
					})) : s ? b(".turning").css({
						top: "0",
						left: l.width() + "px",
						transformOrigin: "0% 0% 0px"
					}) : t && (b(".z-current").css({
						top: 0,
						left: b(this).width() - l.width() + "px"
					}), m.css({
						top: 0,
						left: -(m.width() - l.width()) + "px"
					}), b(".turning").css({
						transformOrigin: "0% 100% 0px",
						left: l.width() + "px",
						top: 0
					}))
				}
			}
		} else if (q > 0 && v) {
			v = !1, u = !0, w = b(".z-current").get(0);
			var d = b(w).find(".m-img").attr("id").substr(4);
			m = b("#flip" + d), X || (x = b(w).parent(".flip-mask").get(0).previousElementSibling && b(b(w).parent(".flip-mask").get(0).previousElementSibling).find(".main-page").get(0) ? b(b(w).parent(".flip-mask").get(0).previousElementSibling).find(".main-page").get(0) : y ? B.last().get(0) : !1), x && (i(x), completeEffect(b(x)) || b("#audio_btn").css("opacity", 0), b(w).parent(".flip-mask").css({
				display: "block"
			}), b(x).addClass("z-active").parent(".flip-mask").css({
				zIndex: 99,
				display: "block"
			}), b(".turning").css({
				top: "0",
				left: "0",
				transformOrigin: "0% 0% 0px"
			}))
		}
		x && f(p)
	}
	function e(a, b) {
		if (!x) return C = "feeling", r = !1, s = !1, t = !1, u = !1, void(v = !0);
		C = "leaving";
		var c, d, e, g;
		b ? (c = a.x, d = a.y) : z ? (c = p.x - l.offset().left, d = p.y - l.offset().top) : (c = a.pageX - l.offset().left, d = a.pageY - l.offset().top), r ? (D = 16, e = -l.width(), g = l.height(), A = setInterval(function() {
			c = D >= c - e ? c : c - D, d = D >= g - d ? d : d + D, f({
				x: c,
				y: d
			}), D >= c - e && D >= g - d && (clearInterval(A), h())
		}, 10)) : s ? (D = 16, e = -l.width(), g = 0, A = setInterval(function() {
			c = D >= c - e ? c : c - D, d = D >= d - g ? d : d - D, f({
				x: c,
				y: d
			}), D >= c - e && D >= d - g && (clearInterval(A), h())
		}, 1)) : t ? (D = 5, e = -l.width(), A = setInterval(function() {
			c = D >= c - e ? c : c - D, f({
				x: c,
				y: d
			}), D >= c - e && (clearInterval(A), h())
		}, 1)) : u && (D = 3, e = l.width(), g = 0, A = setInterval(function() {
			c = D >= e - c ? c : c + D, f({
				x: c,
				y: d
			}), D >= e - c && (clearInterval(A), h())
		}, 1))
	}
	function f(a) {
		r || s ? (F = l.width() - a.x, r ? G = Math.abs(l.height() - a.y) : s && (G = a.y), H = G / F, I = G / Math.sqrt(F * F + G * G), J = Math.sqrt(1 - I * I), K = Math.sqrt(F * F + G * G) / 2, L = K * H, M = Math.sqrt(L * L + K * K), N = M / H, E = 180 * Math.atan(H) / Math.PI > 0 ? 180 * Math.atan(H) / Math.PI : 0, O = (l.width() - M) * J, P = (l.width() - M) * I * J, Q = (l.width() - M) * (1 - I * I), O >= 1 && (r ? (E > 1 ? b(".turning").css({
			width: M + "px",
			backgroundColor: "#ff0000",
			background: "-webkit-linear-gradient(" + (180 - E) + "deg, #fff 10%, #d1cfc7 40%, #f2eee2 50%, transparent 50%, transparent 100%)",
			transform: "translateX(-" + (M - 3) + "px) translateY(-" + (N - 3) + "px) rotate(" + 2 * E + "deg) scaleX(-1)"
		}) : g(a), R = "0% 100% 0px", S = "rotate(-" + (90 - E) + "deg) translateY(" + O + "px)", T = "rotate(" + (90 - E) + "deg) translateY(-" + P + "px) translateX(-" + Q + "px)") : s && (E > 1 ? b(".turning").css({
			width: M + "px",
			height: N + "px",
			backgroundColor: "#000",
			background: "-webkit-linear-gradient(-" + (180 - E) + "deg, #fff 10%, #d1cfc7 40%, #f2eee2 50%, transparent 50%, transparent 100%)",
			transform: "translateX(-" + (M - 2) + "px) rotate(-" + 2 * E + "deg) scaleX(-1)"
		}) : g(a), R = "0% 0% 0px", S = "rotate(" + (90 - E) + "deg) translateY(-" + O + "px)", T = "rotate(-" + (90 - E) + "deg) translateY(" + P + "px) translateX(-" + Q + "px)"), m.css({
			zIndex: 100,
			transformOrigin: R,
			transform: S
		}), b(x).parent(".flip-mask").css({
			zIndex: 99,
			display: "block"
		}), b(x).css({
			zIndex: 1e3
		}), b(w).css({
			transformOrigin: R,
			transform: T
		}))) : t ? (b(".turning").css({
			width: (l.width() - a.x) / 2 + "px",
			left: a.x + "px",
			background: "-webkit-linear-gradient(left, #fff 0% , #d1cfc7 15%, #f2eee2 85%, #fff 100%)"
		}), m.css({
			transformOrigin: "0% 50% 0px",
			left: 0,
			transform: "translateX(-" + (m.width() - a.x) + "px)"
		}), b(w).css({
			transformOrigin: "0% 50% 0px",
			transform: "translateX(" + (m.width() - a.x) + "px)"
		})) : u && (m.css({
			zIndex: 100,
			transformOrigin: "0% 50% 0px",
			transform: "translateX(" + a.x + "px)"
		}), b(w).css({
			transformOrigin: "0% 50% 0px",
			transform: "translateX(-" + a.x + "px)"
		}), b(".turning").css({
			width: l.width() - a.x + "px",
			left: -(l.width() - 2 * a.x) + "px",
			background: "-webkit-linear-gradient(left, #fff 0% , #d1cfc7 15%, #f2eee2 85%, #fff 100%)"
		}))
	}
	function g(a) {
		b(".turning").css({
			width: (l.width() - a.x + 6) / 2 + "px",
			top: 0,
			left: a.x + 2 + "px",
			background: "-webkit-linear-gradient(left, #fff 0% , #d1cfc7 10%, #f2eee2 90%, #fff 100%)",
			transform: "",
			border: 0
		})
	}
	function h() {
		var a = U.list;
		U.obj.property.autoFlip && U.obj.property.autoFlipTime && j(), utilSound.pause();
		var c = b("#report0");
		c.length && c.remove(), C = "feeling", r = !1, s = !1, t = !1, u = !1, v = !0, q = 0, b(".flip-mask").css({
			transform: "",
			top: 0,
			left: 0,
			zIndex: 0
		}), b(w).removeClass("z-current").css({
			transform: "",
			top: 0,
			left: 0
		}), b(x).removeClass("z-active").addClass("z-current").css({
			transform: ""
		}), b(".turning").css({
			width: 0,
			top: 0,
			left: 0,
			transform: "",
			background: "none"
		}), w = x;
			var last_id=$('.m-img:last').attr('id');
			var now_id=$('.z-current').find('.m-img:first').attr('id');
			if (now_id==last_id){
				$('#qyit_7192,#qymf_7192').show();
			}else{
				$('#qyit_7192,#qymf_7192').hide();
			}
		var d = b(x).find(".m-img").attr("id").substring(4);
		b("#flip" + d).css({
			zIndex: 100
		}), b("#audio_btn").css("opacity", 1), x = null;
		var e = b(w).find(".m-img").attr("id").substring(4);
		a[e - 1].elements && a[e - 1].elements.length && b.each(a[e - 1].elements, function(a, c) {
			"d" == c.type && eqShow.getShowCount(U.obj.id).then(function(a) {
				var d = eqShow.fixedNum(a);
				b("#" + c.id).find(".counter-number").text(d)
			})
		})
	}
	function i(a) {
		if (a) {
			var c = b(a).find(".m-img").attr("id").substring(4);
			b(a).find("li").each(function(a) {
				for (var d = 0; d < U.list[c - 1].elements.length; d++) U.list[c - 1].elements[d].id == parseInt(b(this).attr("id").substring(7), 10) && eqxCommon.animation(b(this), U.list[c - 1].elements[d], "view")
			})
		}
	}
	function j() {
		Y = setInterval(function() {
			return completeEffect(b(".z-current")) ? void a.turnBookNextPage() : void k()
		}, 1e3 * V)
	}
	function k() {
		clearInterval(Y)
	}
	var l = b("#nr"),
		m = null,
		n = isAndroid(),
		o = {},
		p = {},
		q = 0,
		r = !1,
		s = !1,
		t = !1,
		u = !1,
		v = !0,
		w = null,
		x = null,
		y = !1,
		z = mobilecheck(),
		A = null,
		B = [],
		C = "feeling",
		D = 0,
		E = 0,
		F = 0,
		G = 0,
		H = 0,
		I = 0,
		J = 0,
		K = 0,
		L = 0,
		M = 0,
		N = 0,
		O = 0,
		P = 0,
		Q = 0,
		R = 0,
		S = 0,
		T = 0,
		U = null,
		V = 0,
		W = "",
		X = !1;
	a.turnBook = function(a) {
		U = a, U.obj.property.autoFlip && U.obj.property.autoFlipTime && (V = U.obj.property.autoFlipTime, j()), y = U.obj.property.triggerLoop, b('<div class="turning"></div>').appendTo("#nr"), b(".main-page").css({
			width: b("#nr").width() + "px"
		}), l.on(z ? "touchstart" : "mousedown", function(a) {
			"feeling" == C && (c(a), b(".main-page").css({
				width: l.width() + "px"
			}))
		}).on(z ? "touchmove" : "mousemove", function(a) {
			("started" == C || "turning" == C) && d(a)
		}).on(z ? "touchend" : "mouseup mouseleave", function(a) {
			return X = !1, b(".z-current").get(0) ? 0 == q ? (v = !0, void(C = "feeling")) : void("turning" == C && e(a)) : void 0
		})
	};
	var Y;
	a.turnBookPrePage = function() {
		"turning" != C && "leaving" != C && (o = {
			x: 0,
			y: l.height()
		}, c(o, "mock"), C = "turning", b(".main-page").css({
			width: l.width() + "px"
		}), p = {
			x: 0,
			y: l.height()
		}, u = !0, A = setInterval(function() {
			p.x++, d(p, "mock"), p.x <= 250 && (clearInterval(A), e(p, "mock"))
		}, 1))
	}, a.flipBookScroll = function(a) {
		X = !0;
		var c;
		for (var d = 0, e = U.list.length; e > d; d++) a == U.list[d].id && (c = U.list[d].num);
		c || (c = a), w = b(".z-current").get(0);
		var f = b(w).find(".m-img").attr("id").substring(4),
			g = b(w).parent(".flip-mask").siblings(".flip-mask").find(".main-page").find("#page" + c);
		g && (x = b(g).parent(".main-page").get(0), f > c ? turnBookPrePage() : c > f && turnBookNextPage())
	}, a.turnBookNextPage = function() {
		"turning" != C && "leaving" != C && (o = {
			x: l.width(),
			y: l.height()
		}, c(o, "mock"), C = "turning", b(".main-page").css({
			width: l.width() + "px"
		}), p = {
			x: l.width(),
			y: l.height()
		}, z && n ? t = !0 : r = !0, W = setInterval(function() {
			p.x -= 5, p.y -= 5, d(p, "mock"), p.x <= 200 && (clearInterval(W), e(p, "mock"), y || x || k())
		}, 1))
	}
}(window, jQuery), function() {
	function a(a) {
		resources.loaded = !0, a instanceof Array ? a.forEach(function(a) {
			b(a)
		}) : b(a)
	}
	function b(a) {
		if ("loading" != f[a.url]) {
			if (f[a.url]) return f[a.url];
			if (f[a.url] = !1, "image" == a.type) {
				var b = new Image;
				f[a.url] = "loading", b.onload = function() {
					f[a.url] = b, d() && g.forEach(function(a) {
						a()
					})
				}, b.src = a.url
			} else "js" == a.type && (f[a.url] = "loading", $.getScript(a.url, function() {
				f[a.url] = !0, d() && g.forEach(function(a) {
					a()
				})
			}))
		}
	}
	function c(a) {
		return f[a]
	}
	function d() {
		var a = !0;
		for (var b in f) if (f.hasOwnProperty(b) && (!f[b] || "loading" == f[b])) return !1;
		return a
	}
	function e(a) {
		g.push(a)
	}
	var f = {},
		g = [];
	window.resources = {
		load: a,
		get: c,
		onReady: e,
		isReady: d
	}
}();
var qy7192 = function() {
		function a(a) {
			if ("10" != f._scrollMode) {
				q = !0;
				for (var d, e = 0, g = f._pageData.length; g > e; e++) a == f._pageData[e].id && (d = f._pageData[e].num);
				d || (d = a);
				var h = $(f.$currentPage).find(".m-img").attr("id").substring(4),
					i = $(f.$currentPage).siblings(".main-page").find("#page" + d);
				if (!i) return;
				f.$activePage = $(i).parent(".main-page").get(0), h > d ? b() : d > h && c()
			} else flipBookScroll(a)
		}
		function b() {
			if ("10" != f._scrollMode) {
				var a = 0;
				g();
				var b = setInterval(function() {
					a += 2, "0" == f._scrollMode || "1" == f._scrollMode || "2" == f._scrollMode || "6" == f._scrollMode || "7" == f._scrollMode || "8" == f._scrollMode || "11" == f._scrollMode || "12" == f._scrollMode ? v = a : ("3" == f._scrollMode || "4" == f._scrollMode || "5" == f._scrollMode || "9" == f._scrollMode) && (u = a), h(), a >= 21 && (clearInterval(b), i())
				}, 1)
			} else turnBookPrePage()
		}
		function c() {
			if ("10" != f._scrollMode) {
				l = !1;
				var a = 0;
				g();
				var b = setInterval(function() {
					a -= 2, "0" == f._scrollMode || "1" == f._scrollMode || "2" == f._scrollMode || "6" == f._scrollMode || "7" == f._scrollMode || "8" == f._scrollMode || "11" == f._scrollMode || "12" == f._scrollMode ? v = a : ("3" == f._scrollMode || "4" == f._scrollMode || "5" == f._scrollMode || "9" == f._scrollMode) && (u = a), h(), -21 >= a && (clearInterval(b), i(), p || f.$activePage || clearInterval(n))
				}, 1)
			} else turnBookNextPage()
		}
		function d() {
			n = setInterval(function() {
				"10" != f._scrollMode && c()
			}, m)
		}
		function e() {
			clearInterval(n)
		}
		var f, g, h, i, j, k, l, m, n, o = $(window),
			p = !1,
			q = !1,
			r = mobilecheck(),
			s = 0,
			t = 0,
			u = 0,
			v = 0,
			w = !1,
			x = !1,
			y = !0,
			z = 500,
			A = .4,
			B = function(a, b, c, e) {
				function l(a, b, c) {
					for (var d = ["", "webkit", "moz"], e = 0, f = d.length; f > e; e++) {
						0 != e || mobilecheck() || (b = b.substring(0, 1).toLowerCase() + b.substring(1, b.length));
						var g = c instanceof Array ? c[e] : c,
							h = d[e] + b;
						a[h] = g
					}
				}
				function n(a, b, c) {
					for (var d = ["", "-webkit-", "-moz-"], e = 0; e < d.length; e++) a.css(d[e] + b, c)
				}
				function B() {
					f._isDisableFlipPage = !0;
					var a;
					"0" == b || "1" == b || "2" == b || "6" == b || "9" == b || "11" == b || "12" == b ? (a = v > 0 ? -k : k, n($(f.$activePage), "transform", "translateY(" + a + "px)"), n($(f.$currentPage), "transform", "translateY(0) scale(1)")) : ("3" == b || "5" == b) && (a = u > 0 ? -j : j, n($(f.$activePage), "transform", "translateX(" + a + "px)"), n($(f.$currentPage), "transform", "translateX(0) scale(1)")), setTimeout(function() {
						$(f.$currentPage).attr("style", ""), $(f.$activePage).attr("style", ""), $(f.$activePage).removeClass("z-active z-move"), f._isDisableFlipPage = !1
					}, 500)
				}
				function C() {
					if (Math.abs(v) > Math.abs(u) && completeEffect($(f.$currentPage))) if (v > 0) {
						if (f._isDisableFlipPrevPage) return;
						x || y ? (x = !1, y = !1, U(!0), V(!0, "bottom center", "translateY", k)) : W(!0, "translateY", k, v, f._scrollMode)
					} else if (0 > v) {
						if (f._isDisableFlipNextPage) return;
						!x || y ? (x = !0, y = !1, U(!1), V(!1, "top center", "translateY", k)) : W(!1, "translateY", k, v, f._scrollMode)
					}
				}
				function D() {
					Math.abs(v) > Math.abs(u) && Math.abs(v) > 20 ? (X("translateY", v, k, f._scrollMode), $(document).trigger("flipend")) : (f._isDisableFlipPage = !1, B())
				}
				function E() {
					if (Math.abs(u) > Math.abs(v) && completeEffect($(f.$currentPage))) if (u > 0) {
						if (f._isDisableFlipPrevPage) return;
						x || y ? (x = !1, y = !1, U(!0), V(!0, "center right", "translateX", j)) : W(!0, "translateX", j, u, f._scrollMode)
					} else if (0 > u) {
						if (f._isDisableFlipNextPage) return;
						!x || y ? (x = !0, y = !1, U(!1), V(!1, "center left", "translateX", j)) : W(!1, "translateX", j, u, f._scrollMode)
					}
				}
				function F() {
					Math.abs(u) > Math.abs(v) && Math.abs(u) > 20 ? (X("translateX", u, j, f._scrollMode), $(document).trigger("flipend")) : (f._isDisableFlipPage = !1, B())
				}
				function G() {
					if (Math.abs(u) > Math.abs(v) && completeEffect($(f.$currentPage))) if (u > 0) {
						if (f._isDisableFlipPrevPage) return;
						x || y ? (x = !1, y = !1, U(!0), j = r ? window.innerWidth : $("#nr").width(), V(!0, "", "translateX", j)) : W(!0, "translateX", j, u, f._scrollMode)
					} else if (0 > u) {
						if (f._isDisableFlipNextPage) return;
						!x || y ? (x = !0, y = !1, U(!1), j = r ? window.innerWidth : $("#nr").width(), V(!1, "", "translateX", j)) : W(!1, "translateX", j, u, f._scrollMode)
					}
				}
				function H() {
					Math.abs(u) > Math.abs(v) && Math.abs(u) > 20 ? (X("translateX", u, j, f._scrollMode), $(document).trigger("flipend")) : (f._isDisableFlipPage = !1, B())
				}
				function I() {
					if (Math.abs(v) > Math.abs(u) && completeEffect($(f.$currentPage))) if (v > 0) {
						if (f._isDisableFlipPrevPage) return;
						x || y ? (x = !1, y = !1, U(!0), k = r ? window.innerHeight : $("#nr").height(), V(!0, "", "translateY", k)) : W(!0, "translateY", k, v, f._scrollMode)
					} else if (0 > v) {
						if (f._isDisableFlipNextPage) return;
						!x || y ? (x = !0, y = !1, U(!1), k = r ? window.innerHeight : $("#nr").height(), V(!1, "", "translateY", k)) : W(!1, "translateY", k, v, f._scrollMode)
					}
				}
				function J() {
					Math.abs(v) > Math.abs(u) && Math.abs(v) > 20 ? (X("translateY", v, k, f._scrollMode), $(document).trigger("flipend")) : (f._isDisableFlipPage = !1, B())
				}
				function K() {
					if (Math.abs(v) > Math.abs(u) && completeEffect($(f.$currentPage))) if (v > 0) {
						if (f._isDisableFlipNextPage) return;
						(!x || y) && (x = !0, y = !1, f.$activePage && $(f.$activePage).removeClass("z-move z-active"), U(!0), l(f.$activePage.style, "Transform", "rotateX(90deg) translateY(-" + k / 2 + "px) translateZ(" + k / 2 + "px)"), l(Y.get(0).style, "Perspective", "700px"), l(Y.get(0).style, "TransformStyle", "preserve-3d")), f.$activePage && f.$activePage.classList.contains("main-page") && ($(f.$activePage).addClass("z-active z-move").trigger("active").css("zIndex", 1), l(f.$currentPage.style, "Transform", "rotateX(-" + v / k * 90 + "deg) translateY(" + v / 2 + "px) translateZ(" + v / 2 + "px)"), l(f.$activePage.style, "Transform", "rotateX(" + (90 - v / k * 90) + "deg) translateY(" + (-(k / 2) + v / 2) + "px) translateZ(" + (k / 2 - v / 2) + "px)"))
					} else if (0 > v) {
						if (f._isDisableFlipNextPage) return;
						(!x || y) && (x = !0, y = !1, f.$activePage && $(f.$activePage).removeClass("z-move z-active"), U(!1), l(f.$activePage.style, "Transform", "rotateX(-90deg) translateY(-" + k / 2 + "px) translateZ(-" + k / 2 + "px)"), l(Y.get(0).style, "Perspective", "700px"), l(Y.get(0).style, "TransformStyle", "preserve-3d")), f.$activePage && f.$activePage.classList.contains("main-page") ? ($(f.$activePage).addClass("z-active z-move").trigger("active").css("zIndex", 0), l(f.$currentPage.style, "Transform", "rotateX(" + -v / k * 90 + "deg) translateY(" + v / 2 + "px) translateZ(" + -v / 2 + "px)"), l(f.$activePage.style, "Transform", "rotateX(" + (-90 - v / k * 90) + "deg) translateY(" + (k / 2 + v / 2) + "px) translateZ(" + (k / 2 + v / 2) + "px)")) : (l(f.$currentPage.style, "Transform", "translateX(0px) scale(1)"), f.$activePage = null)
					}
				}
				function L() {
					Math.abs(v) > Math.abs(u) && Math.abs(v) > 20 ? (v > 0 ? l(f.$currentPage.style, "Transform", "rotateX(-90deg) translateY(" + k / 2 + "px) translateZ(" + k / 2 + "px)") : l(f.$currentPage.style, "Transform", "rotateX(90deg) translateY(-" + k / 2 + "px) translateZ(" + k / 2 + "px)"), l(f.$currentPage.style, "zIndex", "0"), l(f.$activePage.style, "Transform", "rotateX(0deg) translateY(0px) translateZ(0px)"), l(f.$activePage.style, "zIndex", "2"), $(document).trigger("flipend")) : (l(f.$currentPage.style, "Transition", "none"), l(f.$activePage.style, "Transition", "none"), f._isDisableFlipPage = !1, B())
				}
				function M() {
					if (Math.abs(v) > Math.abs(u) && completeEffect($(f.$currentPage))) if (v > 0) {
						if (f._isDisableFlipNextPage) return;
						(!x || y) && (x = !0, y = !1, f.$activePage && $(f.$activePage).removeClass("z-move z-active"), U(!0), l(Y.get(0).style, "Perspective", "700px"), l(Y.get(0).style, "TransformStyle", "preserve-3d"), l(f.$activePage.style, "TransformOrigin", "top"), l(f.$activePage.style, "Transform", "rotateX(90deg)")), f.$activePage && f.$activePage.classList.contains("main-page") && ($(f.$activePage).addClass("z-active z-move").trigger("active"), l(f.$activePage.style, "Transform", "rotateX(" + (90 - v / k * 90) + "deg) "))
					} else if (0 > v) {
						if (f._isDisableFlipNextPage) return;
						(!x || y) && (x = !0, y = !1, f.$activePage && $(f.$activePage).removeClass("z-move z-active"), U(!1), l(f.$activePage.style, "TransformOrigin", "bottom"), l(f.$activePage.style, "Transform", "rotateX(-90deg)"), l(Y.get(0).style, "Perspective", "700px"), l(Y.get(0).style, "TransformStyle", "preserve-3d")), f.$activePage && f.$activePage.classList.contains("main-page") ? ($(f.$activePage).addClass("z-active z-move").trigger("active"), l(f.$activePage.style, "Transform", "rotateX(" + (-90 - v / k * 90) + "deg) ")) : (l(f.$currentPage.style, "Transform", "translateX(0px) scale(1)"), f.$activePage = null)
					}
				}
				function N() {
					Math.abs(v) > Math.abs(u) && Math.abs(v) > 20 ? (v > 0 ? l(f.$activePage.style, "Transform", "rotateX(0deg)") : l(f.$activePage.style, "Transform", "rotateX(0deg)"), $(document).trigger("flipend")) : (l(f.$currentPage.style, "Transition", "none"), l(f.$activePage.style, "Transition", "none"), f._isDisableFlipPage = !1, B())
				}
				function O() {
					if (Math.abs(v) > Math.abs(u) && completeEffect($(f.$currentPage))) {
						if (v > 0) {
							if (f._isDisableFlipPrevPage) return;
							(x || y) && (x = !1, y = !1, f.$activePage && (f.$activePage.classList.remove("z-active"), f.$activePage.classList.remove("z-move")), U(!0), f.$activePage.style.zIndex = 2, f.$activePage && f.$activePage.classList.contains("main-page") && (f.$activePage.classList.add("z-active"), f.$activePage.classList.add("z-move")), f.$activePage.style.opacity = 0)
						} else if (0 > v) {
							if (f._isDisableFlipNextPage) return;
							(!x || y) && (x = !0, y = !1, f.$activePage && (f.$activePage.classList.remove("z-active"), f.$activePage.classList.remove("z-move")), U(!1), f.$activePage.style.zIndex = 2, f.$activePage && f.$activePage.classList.contains("main-page") && (f.$activePage.classList.add("z-active"), f.$activePage.classList.add("z-move")), f.$activePage.style.opacity = 0)
						}
						var a = Math.abs(v) / k * 1.3;
						f.$activePage.style.opacity = a.toFixed(1), a.toFixed(3) <= 1 && n($(f.$activePage), "transform", "scale(" + a.toFixed(3) + ")")
					}
				}
				function P() {
					Math.abs(v) > Math.abs(u) && Math.abs(v) > 20 ? (n($(f.$activePage), "transform", "scale(1)"), f.$activePage.style.opacity = 1, $(document).trigger("flipend")) : (l(f.$currentPage.style, "Transition", "none"), l(f.$activePage.style, "Transition", "none"), f._isDisableFlipPage = !1, B())
				}
				function Q() {
					if (Math.abs(u) > Math.abs(v) && completeEffect($(f.$currentPage))) if (u > 0) {
						if (f._isDisableFlipPrevPage) return;
						x || y ? (x = !1, y = !1, f.$activePage && (f.$activePage.classList.remove("z-active"), f.$activePage.classList.remove("z-move")), U(!0), f.$activePage && f.$activePage.classList.contains("main-page") && (f.$activePage.classList.add("z-active"), f.$activePage.classList.add("z-move"), n($(f.$activePage), "Transform", "scale(0.3) translateX(0) translateZ(-" + k + "px) rotateY(45deg)"), f.$activePage.style.zIndex = "0"), l(Y.get(0).style, "Perspective", "1000px"), f.$currentPage.style.zIndex = "100") : f.$activePage && (j / 4 >= u ? n($(f.$currentPage), "Transform", "translateX(" + u + "px)") : n($(f.$currentPage), "Transform", "translateX(" + 1.5 * u + "px) scale(" + ((5 * j / 4 - u) / j).toFixed(3) + ") rotateY(" + u / j * 45 + "deg) translateZ(-" + (u - j / 4) + "px)"))
					} else if (0 > u) {
						if (f._isDisableFlipNextPage) return;
						!x || y ? (x = !0, y = !1, f.$activePage && (f.$activePage.classList.remove("z-active"), f.$activePage.classList.remove("z-move")), U(!1), f.$activePage && f.$activePage.classList.contains("main-page") && (f.$activePage.classList.add("z-active"), f.$activePage.classList.add("z-move"), n($(f.$activePage), "Transform", "scale(0.3) translateX(" + (j + 300) + "px) translateZ(-" + k + "px) rotateY(-45deg)"), f.$activePage.style.zIndex = "0"), l(Y.get(0).style, "Perspective", "1000px"), f.$currentPage.style.zIndex = "100") : f.$activePage && (u >= -j / 4 ? n($(f.$currentPage), "Transform", "translateX(" + u + "px)") : n($(f.$currentPage), "Transform", "translateX(" + 1.5 * u + "px) scale(" + ((5 * j / 4 + u) / j).toFixed(3) + ") rotateY(" + u / j * 45 + "deg) translateZ(" + (u + j / 4) + "px)"), n($(f.$activePage), "Transform", "scale(" + (.3 - (u + j / 4) / j).toFixed(3) + ") translateX(" + (-u - j / 4 + 200) + "px) translateZ(" + (-u - 3 * j / 4) + "px) rotateY(-" + (45 + (u + j / 4) / j * 45) + "deg)"))
					}
				}
				function R() {
					Math.abs(u) > Math.abs(v) && Math.abs(u) > 20 ? (u > 0 ? (f.$currentPage.style.webkitTransformOrigin = "left", f.$currentPage.style.webkitTransform = "translateX(0) translateZ(-" + k + "px) rotateY(0) scale(0.2)", f.$activePage.style.webkitTransform = "translateX(0) translateZ(0) rotateY(0) scale(1)", f.$currentPage.style.zIndex = "0", f.$activePage.style.zIndex = "1") : (f.$currentPage.style.webkitTransformOrigin = "right", f.$currentPage.style.webkitTransform = "translateX(" + j + "px) translateZ(-" + k + "px) rotateY(0) scale(0.2)", f.$activePage.style.webkitTransform = "translateX(0) translateZ(0) rotateY(0) scale(1)", f.$activePage.style.zIndex = "1", f.$currentPage.style.zIndex = "0"), $(document).trigger("flipend")) : (l(f.$currentPage.style, "Transition", "none"), l(f.$activePage.style, "Transition", "none"), f._isDisableFlipPage = !1, B())
				}
				function S() {
					if (Math.abs(v) > Math.abs(u) && completeEffect($(f.$currentPage))) {
						if (v > 0) {
							if (f._isDisableFlipPrevPage) return;
							(x || y) && (x = !1, y = !1, f.$activePage && (f.$activePage.classList.remove("z-active"), f.$activePage.classList.remove("z-move")), U(!0), f.$activePage && f.$activePage.classList.contains("main-page") && ($(f.$activePage).addClass("z-active z-move"), $(f.$activePage).css({
								zIndex: 0,
								opacity: 1
							})), $(f.$currentPage).css({
								opacity: 1
							}), $(f.$activePage).css({
								zIndex: 0,
								opacity: 1
							}), n($(f.$activePage), "transform", "translateY(0)"), n($(f.$currentPage), "transform-origin", "0% 0% 0px"))
						} else if (0 > v) {
							if (f._isDisableFlipNextPage) return;
							(!x || y) && (x = !0, y = !1, f.$activePage && (f.$activePage.classList.remove("z-active"), f.$activePage.classList.remove("z-move")), U(!1), f.$activePage && f.$activePage.classList.contains("main-page") && (f.$activePage.classList.add("z-active"), f.$activePage.classList.add("z-move"), $(f.$activePage).css({
								zIndex: 0,
								opacity: 1
							})), $(f.$currentPage).css({
								opacity: 1
							}), $(f.$activePage).css({
								zIndex: 0,
								opacity: 1
							}), n($(f.$activePage), "transform", "translateY(0)"), n($(f.$currentPage), "transform-origin", "0% 0% 0px"))
						}
						f.$activePage && (n($(f.$currentPage), "transform-origin", "0% 0% 0px"), n($(f.$currentPage), "transform", "rotate(" + Math.abs(v) / k * 90 + "deg)"), f.$currentPage.style.opacity = ((k - Math.abs(v)) / k).toFixed(1))
					}
				}
				function T() {
					Math.abs(v) > Math.abs(u) && Math.abs(v) > 20 ? (n($(f.$currentPage), "transform", "translateY(" + k + "px) rotate(" + Math.abs(v) / k * 90 + "deg)"), $(f.$currentPage).css({
						opacity: .5
					}), $(document).trigger("flipend")) : (l(f.$currentPage.style, "Transition", "none"), l(f.$activePage.style, "Transition", "none"), f._isDisableFlipPage = !1, B())
				}
				function U(a) {
					q || (a ? f.$currentPage.previousElementSibling && f.$currentPage.previousElementSibling.classList.contains("main-page") ? f.$activePage = f.$currentPage.previousElementSibling : p ? f.$activePage = f._$pages.last().get(0) : f.$activePage = !1 : f.$currentPage.nextElementSibling && f.$currentPage.nextElementSibling.classList.contains("main-page") ? f.$activePage = f.$currentPage.nextElementSibling : p ? f.$activePage = f._$pages.first().get(0) : f.$activePage = !1)
				}
				function V(a, b, c, d) {
					if (f.$activePage && (f.$activePage.classList.remove("z-active"), f.$activePage.classList.remove("z-move")), f.$activePage && f.$activePage.classList.contains("main-page")) {
						f.$activePage.classList.add("z-active"), f.$activePage.classList.add("z-move");
						var e = a ? "-" : "";
						f.$activePage.style.webkitTransition = "none", f.$activePage.style.webkitTransform = c + "(" + e + d + "px)", f.$activePage.style.mozTransition = "none", f.$activePage.style.mozTransform = c + "(" + e + d + "px)", f.$activePage.style.transition = "none", f.$activePage.style.transform = c + "(" + e + d + "px)", $(f.$activePage).trigger("active"), b && n($(f.$currentPage), "transform-origin", b)
					} else l(f.$currentPage.style, "Transform", c + "(0px) scale(1)")
				}
				function W(a, b, c, d, e) {
					if (f.$activePage) {
						var g = a ? "-" : "";
						n($(f.$activePage), "transform", b + "(" + g + (c - Math.abs(d)) + "px)"), "1" == e || "3" == e ? n($(f.$currentPage), "transform", "scale(" + ((c - Math.abs(d)) / k).toFixed(3) + ")") : ("5" == e || "11" == e) && n($(f.$currentPage), "transform", b + "(" + d + "px)")
					}
				}
				function X(a, b, c, d) {
					if ("1" == d || "3" == d) n($(f.$currentPage), "transform", "scale(0.2)");
					else if ("5" == d || "11" == d) {
						var e = b > 0 ? "" : "-";
						n($(f.$currentPage), "transform", a + "(" + e + c + "px)")
					} else n($(f.$currentPage), "transform", "scale(1)");
					n($(f.$activePage), "transform", a + "(0px)")
				}
				this._$app = a, this._$pages = this._$app.find(".main-page"), this.$currentPage = this._$pages.eq(0), this.$activePage = null, this._isInitComplete = !1, this._isDisableFlipPage = !1, this._isDisableFlipPrevPage = !1, this._isDisableFlipNextPage = !1, this._scrollMode = b, this._pageData = c, this.pageData = e, b = b, f = this, j = r ? window.innerWidth : a.width(), k = r ? window.innerHeight : a.height();
				var Y = $("#con"),
					Z = !1;
				if (("8" == b || "9" == b) && (A = .7, z = 800), e.obj.property.hasOwnProperty("triggerLoop") || (e.obj.property.triggerLoop = !0), p = e.obj.property.triggerLoop, e.obj.property.autoFlip && (m = 1e3 * e.obj.property.autoFlipTime, d()), c[0].elements && c[0].elements.length) for (var _ = 0; _ < c[0].elements.length; _++) qyCommon.bindTrigger($("#inside_" + c[0].elements[_].id), c[0].elements[_]);
				!
				function() {
					o.on("scroll.elasticity", function(a) {
						a.preventDefault()
					}).on("touchmove.elasticity", function(a) {
						a.preventDefault()
					}), o.delegate("img", "mousemove", function(a) {
						a.preventDefault()
					})
				}(), "10" != b ? f._$app.on("mousedown touchstart", function(a) {
					g(a)
				}).on("mousemove touchmove", function(a) {
					h(a)
				}).on("mouseup touchend mouseleave", function(a) {
					i(a)
				}) : turnBook(e), g = function(a) {
					Z = !1, r && a && (a = event), f._isDisableFlipPage || (f.$currentPage = f._$pages.filter(".z-current").get(0), q || (f.$activePage = null), f.$currentPage && completeEffect($(f.$currentPage)) && (w = !0, x = !1, y = !0, u = 0, v = 0, a && "mousedown" == a.type ? (s = a.pageX, t = a.pageY) : a && "touchstart" == a.type && (s = a.touches[0].pageX, t = a.touches[0].pageY), f.$currentPage.classList.add("z-move"), l(f.$currentPage.style, "Transition", "none"), "12" == b && (f.$currentPage.style.zIndex = 3)))
				}, h = function(a) {
					if (r && a && (a = event), w && f._$pages.length > 1) {
						if (a && "mousemove" == a.type ? (u = a.pageX - s, v = a.pageY - t) : a && "touchmove" == a.type && (u = a.touches[0].pageX - s, v = a.touches[0].pageY - t), !Z && (Math.abs(u) > 20 || Math.abs(v) > 20)) {
							if (f.$activePage) {
								var d = $(f.$activePage).find(".m-img").attr("id").substring(4);
								$(f.$activePage).find("li").each(function(a) {
									for (var b = 0; b < f._pageData[d - 1].elements.length; b++) f._pageData[d - 1].elements[b].id == parseInt($(this).attr("id").substring(7), 10) && (qyCommon.animation($(this), c[d - 1].elements[b], "view"), qyCommon.bindTrigger($(this), c[d - 1].elements[b]))
								})
							}
							Z = !0
						}
						"0" == b || "2" == b || "1" == b ? C() : "4" == b || "3" == b ? E() : "5" == b ? G() : "6" == b ? K() : "7" == b ? M() : "8" == b ? O() : "9" == b ? Q() : "11" == b ? I() : "12" == b && S()
					}
				}, i = function(a) {
					if (w && completeEffect($(f.$currentPage))) if (w = !1, f.$activePage) {
						f._isDisableFlipPage = !0;
						var c;
						c = "6" == b || "7" == b ? "cubic-bezier(0,0,0.99,1)" : "12" == b ? "cubic-bezier(.17,.67,.87,.13)" : "linear", f.$currentPage.style.webkitTransition = "-webkit-transform " + A + "s " + c, f.$activePage.style.webkitTransition = "-webkit-transform " + A + "s " + c, f.$currentPage.style.mozTransition = "-moz-transform " + A + "s " + c, f.$activePage.style.mozTransition = "-moz-transform " + A + "s " + c, f.$currentPage.style.transition = "transform " + A + "s " + c, f.$activePage.style.transition = "transform " + A + "s " + c, "0" == b || "2" == b || "1" == b ? D() : "4" == b || "3" == b ? F() : "5" == b ? H() : "6" == b ? L() : "7" == b ? N() : "8" == b ? P() : "9" == b ? R() : "11" == b ? J() : "12" == b && T()
					} else f.$currentPage.classList.remove("z-move");
					q = !1
				}, $(document).on("flipend", function(a) {					
					f.updateProgress(), completeEffect($(f.$currentPage)) || $("#audio_btn").css("opacity", 0);
					var d = $("#report0"),
						g = $(f.$activePage).find(".m-img").attr("id").substring(4);
					c[g - 1].elements && c[g - 1].elements.length && $.each(c[g - 1].elements, function(a, b) {
						"d" == b.type && eqShow.getShowCount(e.obj.id).then(function(a) {
							var c = eqShow.fixedNum(a);
							$("#" + b.id).find(".counter-number").text(c)
						})
					}), setTimeout(function() {
						l(f.$currentPage.style, "Transition", "none"), $(f.$activePage).removeClass("z-active z-move").addClass("z-current"), $(f.$currentPage).removeClass("z-current z-move"), f._isDisableFlipPage = !1, f.$currentPage = $(f.$activePage).trigger("current"), $(f.$currentPage).trigger("hide"), utilSound.pause(), d.length && d.remove(), ("8" == b || "9" == b || "12" == b) && ($(f.$currentPage).css("z-index", "1"), $(".main-page").attr("style", ""))
						var last_id=$('.m-img:last').attr('id');
						var now_id=$(f.$currentPage).find('.m-img:first').attr('id');
						if (now_id==last_id){
							$('#qyit_7192,#qymf_7192').show();
						}else{
							$('#qyit_7192,#qymf_7192').hide();
						}
					}, z)
				}), $(document).on("startAutoFlip", function(a) {
					e.obj.property.autoFlip && d()
				}), e.obj.property.slideNumber && (this.progress = $('<div class="progress"></div>'), this.progressBar = $("<span></span>"), this.slideNumber = $('<em class="page-tip"></em>'), this.progress.append(this.progressBar).append(this.slideNumber), $("#nr").append(this.progress.css("display", "block"))), this.updateProgress = function() {
					e.obj.property.slideNumber && f.progressBar && setTimeout(function() {
						var a = f.$activePage ? f.$activePage : f.$currentPage,
							b = f._$pages.index(a),
							c = f._$pages.length,
							d = (b + 1) / c,
							e = 100;
						f.slideNumber.text(b + 1 + "/" + c), f.progressBar.css("width", parseFloat(f.progress.width()) * d), $(a).find(".lock").length && (e = 0), f.progress.css("z-index", e)
					}, 100)
				}, this.updateProgress(), setInterval(function() {
					f.updateProgress()
				}, 300)
			};
		return {
			pageScroll: a,
			nextPage: c,
			prePage: b,
			app: B,
			pauseAutoFlip: e
		}
	}();
!
function(a, b) {
	function c(a, c) {
		g(c, a);
	}
	function d(a, b) {
		g(b, a)
	}
	function f(a, b) {
		m = 0, g(b, a)
	}
	function g(c, d) {
		var j=d.obj.pageMode;
		for (var e = [], f = !1, g = {
			bgAudio: d.obj.bgAudio,
			mvSrc:d.obj.mvSrc,
			zanInfo:d.obj.zanSta
		}, h = 1; h <= c.length; h++) if (b('<section class="main-page" rel="'+c[h - 1].timeline+'"><div class="m-img" id="page' + h + '"></div></section>').appendTo("#nr"),(10 == j && ($("#page" + h).parent(".main-page").wrap('<div class="flip-mask" id="flip' + h + '"></div>'))), c.length > 1 && (0 == j || 1 == j || 8 == j ||2 == j ? b('<section class="u-arrow-bottom"><img src="' + CLIENT_CDN + 'images/btn01_arrow.png" /></section>').appendTo("#page" + h) : (3 == j || 4 == j || 5 == j || 9 == j || 10 == j) && b('<section class="u-arrow-right"><img src="' + CLIENT_CDN + 'images/btn01_arrow_right.png" /></section>').appendTo("#page" + h)), 1 == h && (b(".loading").hide(), b(".main-page").eq(0).addClass("z-current")), c[h - 1].properties && !b.isEmptyObject(c[h - 1].properties) ? c[h - 1].properties.image || c[h - 1].properties.scratch ? p.scratch ? addScratchEffect(c, h) : !
		function(a) {
			b.getScript(CLIENT_CDN + "static/js/wp/scratch_effect.js", function() {
				p.scratch = !0, addScratchEffect(g, c, a)
			})
		}(h) : c[h - 1].properties.finger ? (e.push({
			num: h,
			finger: c[h - 1].properties.finger
		}), f || (f = !0, b.getScript(CLIENT_CDN + "static/js/wp/lock_effect_new.js", function() {
			test(g, c, e, b(".m-img").width(), b(".m-img").height())
		}))):c[h - 1].properties.kissmi ? (e.push({
			num: h,
			kissmi: c[h - 1].properties.kissmi
		}), f || (f = !0, b.getScript(CLIENT_CDN + "static/js/wp/lock_kiss_new.js", function() {
			test(g, c, e, b(".m-img").width(), b(".m-img").height())
		}))):c[h - 1].properties.praise ? (e.push({
			num: h,
			praise: c[h - 1].properties.praise
		}), f || (f = !0, b.getScript(CLIENT_CDN + "static/js/wp/lock_template.js", function() {
			test(g, c, e, b(".m-img").width(), b(".m-img").height())
		}))) : c[h - 1].properties.fallingObject ? p.fallingObject ? fallingObject(c, h) : !
		function(a) {
			b.getScript(CLIENT_CDN + "static/js/wp/falling_object.js", function() {
				p.fallingObject = !0, fallingObject(c, a), 1 == a && playVideo(g)
			})
		}(h) : c[h - 1].properties.effect ? !
		function(b) {
			resources.load(a.qy[c[b - 1].properties.effect.name].config.resources), resources.onReady(function() {
				a[c[b - 1].properties.effect.name].doEffect(g, b, c, renderPage)
			})
		}(h) : renderPage(qyPoster, h, c) : (renderPage(qyPoster, h, c), 1 == h && playVideo(g)), h == c.length) {
			{
				qy7192.app(b("#nr"), d.obj.pageMode, c, d);
				var time_go_djs,date_line=0;
				function delayTimeDJS(){
					var timeShow = function(T,e){
						var nowT = Date.parse(new Date())/1000;
						var C = T-nowT;
						if( C >= 0 ){
							var D =Math.floor(C/86400);
							C=(C-D*86400);
							var H = Math.floor(C/3600);
							var M = Math.floor((C-H*3600)/60);
							var S = C-H*3600-M*60;
							if (D>0){
								e.html(D+'天'+H+'小时'+M+'分');
							}else{
								e.html(H+'小时'+M+'分'+S+'秒');
							}
						}else{
							e.html('吉时已到');
							clearInterval(time_go_djs);
						}
					}
					if ($('.djs_item').length,date_line>0){
						$('.djs_item').each(function(i,o){
							var e=$(o);
							timeShow((date_line),e);
						});
					}
				  //计算出相差天数
				}
				if (d.obj.djs){
					date_line=d.obj.djs;
					setTimeout(function(){
						time_go_djs=setInterval(delayTimeDJS,1000);
					},1000);
				}

			}
		}
	}
	var h, i, j, k, l, m, n = !1,
		o = mobilecheck(),
		p = [];
	a.appendLastPage = function(a, b, g, n, o, p) {
		f(a, b)
	}
}(window, jQuery), function(window, $) {
	function bindWeixin() {
		var local=window.location.href;
		wx.config({
			appId: WXI.appId,
			timestamp: WXI.timestamp,
			nonceStr: WXI.nonceStr,
			signature: WXI.signature,
			jsApiList: [
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'onMenuShareQQ',
				'onMenuShareWeibo',
				'playVoice',
				'pauseVoice',
				'stopVoice',
				'onVoicePlayEnd',
				'uploadVoice',
				'downloadVoice'
			]
		});

		wx.ready(function () {
			var shareDataLine = {
				title:WXI.tit,
				link: local,
				imgUrl: WXI.thumb
			}
			var shareData = {
				title:WXI.tit,
				desc: WXI.dsp,
				link:local,
				imgUrl: WXI.thumb
			}
			wx.onMenuShareAppMessage(shareData);
			wx.onMenuShareTimeline(shareDataLine);
			wx.onMenuShareQQ(shareData);
			wx.onMenuShareWeibo(shareData);
			$("#media").get(0).play();
		});
	}
	function getRequestUrl() {
	    return "js/data.json";
		var a;
		return PREFIX_S1_URL + "jsonwedding/" + sceneId+".html?time=" + (new Date).getTime()
	}
	function bindShare(data) {
		return true;
	}
	function parseJson(a) {
		//document.title = a.obj.name, 
		$("#metaDescription").attr("content", a.obj.name + ", " + a.obj.description), $(".scene_title").html(a.obj.name), pageMode = a.obj.pageMode;
		var b = [];
		zeroMode=a.obj.scaleMode,zeroSync=a.obj.pageSync,adSta=a.obj.adSta;
		if (a.obj.cssStr){
			document.getElementsByTagName("style")[0].appendChild(document.createTextNode(a.obj.cssStr));
		}
		return a.obj.bgAudio && (a.obj.bgAudio = JSON.parse(a.obj.bgAudio) || null), b = a.list, b.length <= 0 ? (showCheckMessage("此场景不存在!"), void(window.location.href = "http://wp.7192.com")) : (appendLastPage(a, b, pageMode, preview, param, ad))
	}
	var url, preview, mobileview, pageMode, branchid, ad = 0;
	var sceneId = mainid,
		param = '';
	isWeixin() && bindWeixin();
	var requestUrl = getRequestUrl();
	jQuery.support.cors = !0, $.ajax({
		type: "GET",
		url: requestUrl,
		dataType:'json',
		xhrFields: {
			withCredentials: !0
		},
		crossDomain: !0
	}).done(function(a) {
		parseJson(a)
    });
	var imgUrl, descContent, shareTitle
}(window, jQuery), $(".main").show(), $.easing.jswing = $.easing.swing, $.extend($.easing, {
	def: "easeOutQuad",
	swing: function(a, b, c, d, e) {
		return $.easing[$.easing.def](a, b, c, d, e)
	},
	easeInQuad: function(a, b, c, d, e) {
		return d * (b /= e) * b + c
	},
	easeOutQuad: function(a, b, c, d, e) {
		return -d * (b /= e) * (b - 2) + c
	},
	easeInOutQuad: function(a, b, c, d, e) {
		return (b /= e / 2) < 1 ? d / 2 * b * b + c : -d / 2 * (--b * (b - 2) - 1) + c
	},
	easeInCubic: function(a, b, c, d, e) {
		return d * (b /= e) * b * b + c
	},
	easeOutCubic: function(a, b, c, d, e) {
		return d * ((b = b / e - 1) * b * b + 1) + c
	},
	easeInOutCubic: function(a, b, c, d, e) {
		return (b /= e / 2) < 1 ? d / 2 * b * b * b + c : d / 2 * ((b -= 2) * b * b + 2) + c
	},
	easeInQuart: function(a, b, c, d, e) {
		return d * (b /= e) * b * b * b + c
	},
	easeOutQuart: function(a, b, c, d, e) {
		return -d * ((b = b / e - 1) * b * b * b - 1) + c
	},
	easeInOutQuart: function(a, b, c, d, e) {
		return (b /= e / 2) < 1 ? d / 2 * b * b * b * b + c : -d / 2 * ((b -= 2) * b * b * b - 2) + c
	},
	easeInQuint: function(a, b, c, d, e) {
		return d * (b /= e) * b * b * b * b + c
	},
	easeOutQuint: function(a, b, c, d, e) {
		return d * ((b = b / e - 1) * b * b * b * b + 1) + c
	},
	easeInOutQuint: function(a, b, c, d, e) {
		return (b /= e / 2) < 1 ? d / 2 * b * b * b * b * b + c : d / 2 * ((b -= 2) * b * b * b * b + 2) + c
	},
	easeInSine: function(a, b, c, d, e) {
		return -d * Math.cos(b / e * (Math.PI / 2)) + d + c
	},
	easeOutSine: function(a, b, c, d, e) {
		return d * Math.sin(b / e * (Math.PI / 2)) + c
	},
	easeInOutSine: function(a, b, c, d, e) {
		return -d / 2 * (Math.cos(Math.PI * b / e) - 1) + c
	},
	easeInExpo: function(a, b, c, d, e) {
		return 0 == b ? c : d * Math.pow(2, 10 * (b / e - 1)) + c
	},
	easeOutExpo: function(a, b, c, d, e) {
		return b == e ? c + d : d * (-Math.pow(2, -10 * b / e) + 1) + c
	},
	easeInOutExpo: function(a, b, c, d, e) {
		return 0 == b ? c : b == e ? c + d : (b /= e / 2) < 1 ? d / 2 * Math.pow(2, 10 * (b - 1)) + c : d / 2 * (-Math.pow(2, -10 * --b) + 2) + c
	},
	easeInCirc: function(a, b, c, d, e) {
		return -d * (Math.sqrt(1 - (b /= e) * b) - 1) + c
	},
	easeOutCirc: function(a, b, c, d, e) {
		return d * Math.sqrt(1 - (b = b / e - 1) * b) + c
	},
	easeInOutCirc: function(a, b, c, d, e) {
		return (b /= e / 2) < 1 ? -d / 2 * (Math.sqrt(1 - b * b) - 1) + c : d / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + c
	},
	easeInElastic: function(a, b, c, d, e) {
		var f = 1.70158,
			g = 0,
			h = d;
		if (0 == b) return c;
		if (1 == (b /= e)) return c + d;
		if (g || (g = .3 * e), h < Math.abs(d)) {
			h = d;
			var f = g / 4
		} else var f = g / (2 * Math.PI) * Math.asin(d / h);
		return -(h * Math.pow(2, 10 * (b -= 1)) * Math.sin(2 * (b * e - f) * Math.PI / g)) + c
	},
	easeOutElastic: function(a, b, c, d, e) {
		var f = 1.70158,
			g = 0,
			h = d;
		if (0 == b) return c;
		if (1 == (b /= e)) return c + d;
		if (g || (g = .3 * e), h < Math.abs(d)) {
			h = d;
			var f = g / 4
		} else var f = g / (2 * Math.PI) * Math.asin(d / h);
		return h * Math.pow(2, -10 * b) * Math.sin(2 * (b * e - f) * Math.PI / g) + d + c
	},
	easeInOutElastic: function(a, b, c, d, e) {
		var f = 1.70158,
			g = 0,
			h = d;
		if (0 == b) return c;
		if (2 == (b /= e / 2)) return c + d;
		if (g || (g = .3 * e * 1.5), h < Math.abs(d)) {
			h = d;
			var f = g / 4
		} else var f = g / (2 * Math.PI) * Math.asin(d / h);
		return 1 > b ? -.5 * h * Math.pow(2, 10 * (b -= 1)) * Math.sin(2 * (b * e - f) * Math.PI / g) + c : h * Math.pow(2, -10 * (b -= 1)) * Math.sin(2 * (b * e - f) * Math.PI / g) * .5 + d + c
	},
	easeInBack: function(a, b, c, d, e, f) {
		return void 0 == f && (f = 1.70158), d * (b /= e) * b * ((f + 1) * b - f) + c
	},
	easeOutBack: function(a, b, c, d, e, f) {
		return void 0 == f && (f = 1.70158), d * ((b = b / e - 1) * b * ((f + 1) * b + f) + 1) + c
	},
	easeInOutBack: function(a, b, c, d, e, f) {
		return void 0 == f && (f = 1.70158), (b /= e / 2) < 1 ? d / 2 * b * b * (((f *= 1.525) + 1) * b - f) + c : d / 2 * ((b -= 2) * b * (((f *= 1.525) + 1) * b + f) + 2) + c
	},
	easeInBounce: function(a, b, c, d, e) {
		return d - $.easing.easeOutBounce(a, e - b, 0, d, e) + c
	},
	easeOutBounce: function(a, b, c, d, e) {
		return (b /= e) < 1 / 2.75 ? 7.5625 * d * b * b + c : 2 / 2.75 > b ? d * (7.5625 * (b -= 1.5 / 2.75) * b + .75) + c : 2.5 / 2.75 > b ? d * (7.5625 * (b -= 2.25 / 2.75) * b + .9375) + c : d * (7.5625 * (b -= 2.625 / 2.75) * b + .984375) + c
	},
	easeInOutBounce: function(a, b, c, d, e) {
		return e / 2 > b ? .5 * $.easing.easeInBounce(a, 2 * b, 0, d, e) + c : .5 * $.easing.easeOutBounce(a, 2 * b - e, 0, d, e) + .5 * d + c
	}
});