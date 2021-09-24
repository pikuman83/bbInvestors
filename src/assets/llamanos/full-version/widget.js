/* Zadarma Callme Widget v.2.0.8
 * For this widget version you may use language pack of any version
 */
(function() {
  
 	this.ZadarmaCallmeWidget = function(_objectLink) {
		
		var objectLink = _objectLink;
		
		var callTime = 0;
		
		if(typeof ZadarmaCallmeWidgetLanguagePack == 'undefined'){
			var ZadarmaCallmeWidgetLanguagePack = {};
		}
		
		var configs = {
		  	shape: 'circle', /*circle square*/
			language: 'en', /*en ru pl es ua*/
			dtmf: false, /*true false*/
			dtmf_position: 'top', /*top right left bottom*/
			dtmf_time_to_disappear: 20, /*time in seconds when dtmf popup must disappear. 0 = never*/
			dtmf_auto_show: true, /*true, false*/
			
			//normal state
			color_call: 'rgb(255, 255, 255)',
			color_bg_call: 'rgb(126, 211, 33)',
			color_border_call: 'rgb(191, 233, 144)',
			
			color_connection: 'rgb(255, 255, 255)',
			color_bg_connection: 'rgb(33, 211, 166)',
			color_border_connection: 'rgb(144, 233, 211)',
			
			color_calling: 'rgb(255, 255, 255)',
			color_bg_calling: 'rgb(255, 181, 0)',
			color_border_calling: 'rgb(255, 218, 128)',
			
			color_ended: 'rgb(255, 255, 255)',
			color_bg_ended: 'rgb(164,164,164)',
			color_border_ended: 'rgb(210, 210, 210)',
				
			font: '"Trebuchet MS", "Helvetica CY", sans-serif',
			txt_greeting:'',
			txt_nowebrtc:'',
			widgetId: false, /*integer widgetId*/
			sipId: false, /*integer sipID*/
			domain: false
		};
		
		var AudioContext = window.AudioContext // Default
			|| window.webkitAudioContext // Safari and old versions of Chrome
			|| false; 
		var getConnectionInfoTimeout;
		var connection;
		var attempts = 0;
		var session;
		var audioCtx;
		var webRTCRemoteView;
		var gainNode;
		var sessionWebrtc;
		var webRTCDTMFSender;
		var elementID;
		var current_status = 'call'; /*1. call - default status (waiting a click), 2. connection - connecting to user, 3. calling - user answered, call is in process, 4. ended - call was finished;*/
		var mainDiv;
		var DTMFDiv;
		var DTMFDiv_status = 'off';
		var DTMFNumPad;
		var callEndBtn;
		var done_callme__icon__text;
		var done_callme__caller_timer;
		var callId;
		var playRingTimeout;
		var outgoingRing;//ring
		var buzyRing;
		var busy;
		var busyTimeout;
		var timerTimeout;
		var seconds;
		var minutes;
		var startTime;
		var dtmfTimer;
		var noConnection =  false;
		var setStatusFn = function(){
			setState.call(this);

		};
		
		var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || window.navigator.platform == 'MacIntel';
		
		function setConfigs(user_configs){
			
			for(var i in user_configs){
				el = user_configs[i];
				if(i == 'shape' && el != 'circle'){
					configs[i] = 'square';
				}else if(i == 'dtmf' && el !== true){
					configs[i] = false;
				}else if(i == 'dtmf_position' && el !== 'right' && el !== 'bottom' && el !== 'left'){
					configs[i] = 'top';
				}else if(i == 'dtmf_time_to_disappear' && (el <= 0 || el != parseInt(el, 10))){
					configs[i] = 0;
				}else if(i == 'width'){
					configs[i] = el.toString();
				}else{
					configs[i] = el;
				}
				
				if(configs['language'] == ''){
					configs['language'] = 'en';
				}
			}
		}
		
		function buildOut(){
			//create DOM
			createDOM.call(this);
			//create Events
			createEvents.call(this);
		}
		
		function createEvents(){
			mainDiv.addEventListener('mousedown', setStatusFn, false);
			
			if(DTMFDiv){
				DTMFDiv.addEventListener('click', function(){
					switchDTMF.call(this);
				}, false);
				
			}
			
			callEndBtn.addEventListener('click', function(){
				if(current_status == 'calling'){
					setState.call(this, 'ended');
				}
			}, false);
			
			window.onbeforeunload = function(e) {
			 	terminateCall.call(this);
			};
		}
		
		function switchDTMF(status){
			if(configs.dtmf === false) return;
			if(status && status == 'off'){
				DTMFNumPad.className = DTMFNumPad.className.replace(/ callme-dtmf-numpad--opened/i, '');
				DTMFDiv.className = DTMFDiv.className.replace(/ callme__dtmf-ico--shown/i, '');
				clearTimeout(dtmfTimer);
			}else if(status && status == 'on'){
				if(!DTMFNumPad.className.match(/ callme-dtmf-numpad--opened/i)){
					DTMFNumPad.className += ' callme-dtmf-numpad--opened';
					DTMFDiv.className += ' callme__dtmf-ico--shown';
				}
			}else{
				if(DTMFNumPad.className.match(/ callme-dtmf-numpad--opened/i)){
					DTMFNumPad.className = DTMFNumPad.className.replace(/ callme-dtmf-numpad--opened/i, '');
					DTMFDiv.className = DTMFDiv.className.replace(/ callme__dtmf-ico--shown/i, '');
					clearTimeout(dtmfTimer);
				}else{
					DTMFNumPad.className += ' callme-dtmf-numpad--opened';
					DTMFDiv.className += ' callme__dtmf-ico--shown';
				}
			}
		}
		
		function createDOM(){
			//main container
			mainDiv.style.visibility = 'hidden';
			
			var class_name = "z-callme-widget";
			var arr = mainDiv.className.split(" ");
			if (arr.indexOf(class_name) == -1) {
				mainDiv.className += " " + class_name;
			}
			
			var class_name = "callme--" + configs.shape;
			var arr = mainDiv.className.split(" ");
			if (arr.indexOf(class_name) == -1) {
				mainDiv.className += " " + class_name;
			}

			var class_name = "callme";
			var arr = mainDiv.className.split(" ");
			if (arr.indexOf(class_name) == -1) {
				mainDiv.className += " " + class_name;
			}
			
			var class_name = "callme--default";
			var arr = mainDiv.className.split(" ");
			if (arr.indexOf(class_name) == -1) {
				mainDiv.className += " " + class_name;
			}
			
			if(configs.dtmf){
				var class_name = "callme--dtmf-" + configs.dtmf_position;
				var arr = mainDiv.className.split(" ");
				if (arr.indexOf(class_name) == -1) {
					mainDiv.className += " " + class_name;
				}
			}
			
				//video container
				webRTCRemoteView = document.createElement('audio');
				webRTCRemoteView.setAttribute("playsinline", true);
				webRTCRemoteView.setAttribute("controls", true);
				webRTCRemoteView.id = 'webRTCRemoteView_' + elementID;
				webRTCRemoteView.style.width = '0px';
				webRTCRemoteView.style.display = 'none';
				webRTCRemoteView.style.height = '0px';
				webRTCRemoteView.setAttribute('autoplay', true);
				mainDiv.appendChild(webRTCRemoteView);
				
				outgoingRing = document.createElement('audio');
				outgoingRing.id = 'outgoingRing_' + elementID;
				outgoingRing.setAttribute('src', 'https://my.zadarma.com/assets/out.wav');
				outgoingRing.setAttribute('preload', 'auto');
				mainDiv.appendChild(outgoingRing);
				document.getElementById('outgoingRing_' + elementID).load();	
			
				buzyRing = document.createElement('audio');
				buzyRing.id = 'buzyRing_' + elementID;
				buzyRing.setAttribute('src', 'https://my.zadarma.com/assets/busy.wav');
				buzyRing.setAttribute('preload', 'auto');
				mainDiv.appendChild(buzyRing);
				document.getElementById('buzyRing_' + elementID).load();
			
				var hangUp = document.createElement('audio');
				hangUp.id = 'hangup_' + elementID;
				hangUp.setAttribute('src', 'https://my.zadarma.com/assets/hangup.wav');
				hangUp.setAttribute('preload', 'auto');
				mainDiv.appendChild(hangUp);
				document.getElementById('hangup_' + elementID).load();
			
				//<div class="callme__content">
				var callme__content = document.createElement('div');
				callme__content.className = 'callme__content';
				mainDiv.appendChild(callme__content);

					//<div class="callme__icon">
					var callme__icon = document.createElement('div');
					callme__icon.className = 'callme__icon';
					callme__content.appendChild(callme__icon);
			
						//<div class="default-phone-ico">
						var phone_icon = document.createElement('div');
						phone_icon.className = 'default-phone-ico';
						callme__icon.appendChild(phone_icon);
			
							//<i class="z-icon icon-default-phone-ico"></i>
							var phone_ico = document.createElement('i');
							phone_ico.className = 'z-icon icon-default-phone-ico';
							phone_icon.appendChild(phone_ico);
			
							//<div class="callme__icon__text">Позвонить нам</div>
							var callme__icon__text = document.createElement('div');
							callme__icon__text.className = 'callme__icon__text';
							callme__icon__text.innerHTML = ZadarmaCallmeWidgetLanguagePack.call;
							phone_icon.appendChild(callme__icon__text);	
		
						//<div class="connecting-phone-ico">
						var connecting_phone_icon = document.createElement('div');
						connecting_phone_icon.className = 'connecting-phone-ico';
						callme__icon.appendChild(connecting_phone_icon);
			
							//<i class="z-icon icon-connecting-phone-ico"></i>
							var connecting_phone_ico = document.createElement('i');
							connecting_phone_ico.className = 'z-icon icon-connecting-phone-ico';
							connecting_phone_icon.appendChild(connecting_phone_ico);

							//<div class="callme__icon__text">Соединение...</div>
							var connecting_callme__icon__text = document.createElement('div');
							connecting_callme__icon__text.className = 'callme__icon__text';
							connecting_callme__icon__text.innerHTML = ZadarmaCallmeWidgetLanguagePack.connection;
							connecting_phone_icon.appendChild(connecting_callme__icon__text);	
						
							
						//<div class="done-ico">
						var done_icon = document.createElement('div');
						done_icon.className = 'done-ico';
						callme__icon.appendChild(done_icon);
			
							//<i class="z-icon icon-done-ico"></i>
							var done_phone_ico = document.createElement('i');
							done_phone_ico.className = 'z-icon icon-done-ico';
							done_icon.appendChild(done_phone_ico);

							//<div class="callme__icon__text">Разговор завершен</div>
							done_callme__icon__text = document.createElement('div');
							done_callme__icon__text.className = 'callme__icon__text';
							done_callme__icon__text.innerHTML = ZadarmaCallmeWidgetLanguagePack.ended;
							done_icon.appendChild(done_callme__icon__text);	
						
						//<div class="finish-phone-ico">
						var finish_icon = document.createElement('div');
						finish_icon.className = 'finish-phone-ico';
						callme__icon.appendChild(finish_icon);
						
						if(configs.dtmf === true){
							//<i class="z-icon icon-finish-phone-ico">
							callEndBtn = document.createElement('i');
							callEndBtn.className = 'z-icon icon-finish-phone-ico';
							callEndBtn.title = ZadarmaCallmeWidgetLanguagePack.finishCall;;
							finish_icon.appendChild(callEndBtn);
						}else{
							callEndBtn = document.getElementById(elementID);
							//<i class="z-icon icon-finish-phone-ico">
							var callEndBtn2 = document.createElement('i');
							callEndBtn2.className = 'z-icon icon-finish-phone-ico';
							callEndBtn2.title = ZadarmaCallmeWidgetLanguagePack.finishCall;;
							finish_icon.appendChild(callEndBtn2);
						}
							callEndBtn.style.cursor = 'pointer';
							
							//<div class="z-callme-timer">00:00</div>
							done_callme__caller_timer = document.createElement('div');
							done_callme__caller_timer.className = 'z-callme-timer';
							done_callme__caller_timer.innerHTML = '00:00';
							finish_icon.appendChild(done_callme__caller_timer);	
							
			
							if(configs.dtmf === true){
								//<div class="callme__dtmf">
								DTMFDiv = document.createElement('div');
								DTMFDiv.className = 'callme__dtmf-ico';
								DTMFDiv.title = ZadarmaCallmeWidgetLanguagePack.dtmf;	

									//<i class="z-icon icon-dtmf-phone-ico">
									var dtmf_phone_ico = document.createElement('i');
									dtmf_phone_ico.className = 'z-icon icon-dtmf-phone-ico';
									DTMFDiv.appendChild(dtmf_phone_ico);
								if(configs.shape=='circle'){
									mainDiv.appendChild(DTMFDiv);
								}else{
									finish_icon.appendChild(DTMFDiv);	
								}
								
								
								
								//<div class="callme-dtmf-numpad">
								DTMFNumPad = document.createElement('div');
								DTMFNumPad.className = 'callme-dtmf-numpad';
								mainDiv.appendChild(DTMFNumPad);
								
									//<div class="callme-dtmf-numpad__description">
									var DTMFNumPadDescr = document.createElement('div');
									DTMFNumPadDescr.className = 'callme-dtmf-numpad__description';
									DTMFNumPadDescr.innerHTML = ZadarmaCallmeWidgetLanguagePack.dtmf;
									DTMFNumPad.appendChild(DTMFNumPadDescr);

									//<ul class="dtmf-numpad">
									var DTMFNumPadUl = document.createElement('ul');
									DTMFNumPadUl.className = 'dtmf-numpad';
									DTMFNumPad.appendChild(DTMFNumPadUl);
								
										//<li data-value="1" class="dtmf-numpad__item">1</li>
										var DTMFli = Array();
										var j;
										for(var i = 0; i<=9; i+=1){
											j = i + 1; if(j == 10) j = 0;
											DTMFli[i] = document.createElement('li');
											DTMFli[i].id = 'DTMF' + j + 'BTN' + elementID;
											DTMFli[i].className = 'dtmf-numpad__item';
											DTMFli[i].setAttribute("data-value", j);
											DTMFli[i].innerHTML = j;
											DTMFNumPadUl.appendChild(DTMFli[i]);
										}
								var DTMF1 = document.createElement('audio');
								DTMF1.id = 'DTMF1' + elementID;
								DTMF1.setAttribute('src', 'https://my.zadarma.com/assets/dtmf-1.wav');
								DTMF1.setAttribute('preload', 'auto');
								mainDiv.appendChild(DTMF1);
								document.getElementById('DTMF1' + elementID).load();
								document.getElementById('DTMF1BTN' + elementID).addEventListener('click', function(){
									document.getElementById('DTMF1' + elementID).play();
									webRTCDTMFSender.insertDTMF(1);
								}, false);
								
								var DTMF2 = document.createElement('audio');
								DTMF2.id = 'DTMF2' + elementID;
								DTMF2.setAttribute('src', 'https://my.zadarma.com/assets/dtmf-2.wav');
								DTMF2.setAttribute('preload', 'auto');
								mainDiv.appendChild(DTMF2);
								document.getElementById('DTMF2' + elementID).load();
								document.getElementById('DTMF2BTN' + elementID).addEventListener('click', function(){
									document.getElementById('DTMF2' + elementID).play();
									webRTCDTMFSender.insertDTMF(2);
								}, false);
								
								var DTMF3 = document.createElement('audio');
								DTMF3.id = 'DTMF3' + elementID;
								DTMF3.setAttribute('src', 'https://my.zadarma.com/assets/dtmf-3.wav');
								DTMF3.setAttribute('preload', 'auto');
								mainDiv.appendChild(DTMF3);
								document.getElementById('DTMF3' + elementID).load();
								document.getElementById('DTMF3BTN' + elementID).addEventListener('click', function(){
									document.getElementById('DTMF3' + elementID).play();
									webRTCDTMFSender.insertDTMF(3);
								}, false);
								
								var DTMF4 = document.createElement('audio');
								DTMF4.id = 'DTMF4' + elementID;
								DTMF4.setAttribute('src', 'https://my.zadarma.com/assets/dtmf-4.wav');
								DTMF4.setAttribute('preload', 'auto');
								mainDiv.appendChild(DTMF4);
								document.getElementById('DTMF4' + elementID).load();
								document.getElementById('DTMF4BTN' + elementID).addEventListener('click', function(){
									document.getElementById('DTMF4' + elementID).play();
									webRTCDTMFSender.insertDTMF(4);
								}, false);
								
								var DTMF5 = document.createElement('audio');
								DTMF5.id = 'DTMF5' + elementID;
								DTMF5.setAttribute('src', 'https://my.zadarma.com/assets/dtmf-5.wav');
								DTMF5.setAttribute('preload', 'auto');
								mainDiv.appendChild(DTMF5);
								document.getElementById('DTMF5' + elementID).load();
								document.getElementById('DTMF5BTN' + elementID).addEventListener('click', function(){
									document.getElementById('DTMF5' + elementID).play();
									webRTCDTMFSender.insertDTMF(5);
								}, false);
								
								var DTMF6 = document.createElement('audio');
								DTMF6.id = 'DTMF6' + elementID;
								DTMF6.setAttribute('src', 'https://my.zadarma.com/assets/dtmf-6.wav');
								DTMF6.setAttribute('preload', 'auto');
								mainDiv.appendChild(DTMF6);
								document.getElementById('DTMF6' + elementID).load();
								document.getElementById('DTMF6BTN' + elementID).addEventListener('click', function(){
									document.getElementById('DTMF6' + elementID).play();
									webRTCDTMFSender.insertDTMF(6);
								}, false);
								
								var DTMF7 = document.createElement('audio');
								DTMF7.id = 'DTMF7' + elementID;
								DTMF7.setAttribute('src', 'https://my.zadarma.com/assets/dtmf-7.wav');
								DTMF7.setAttribute('preload', 'auto');
								mainDiv.appendChild(DTMF7);
								document.getElementById('DTMF7' + elementID).load();
								document.getElementById('DTMF7BTN' + elementID).addEventListener('click', function(){
									document.getElementById('DTMF7' + elementID).play();
									webRTCDTMFSender.insertDTMF(7);
								}, false);
								
								var DTMF8 = document.createElement('audio');
								DTMF8.id = 'DTMF8' + elementID;
								DTMF8.setAttribute('src', 'https://my.zadarma.com/assets/dtmf-8.wav');
								DTMF8.setAttribute('preload', 'auto');
								mainDiv.appendChild(DTMF8);
								document.getElementById('DTMF8' + elementID).load();
								document.getElementById('DTMF8BTN' + elementID).addEventListener('click', function(){
									document.getElementById('DTMF8' + elementID).play();
									webRTCDTMFSender.insertDTMF(8);
								}, false);
								
								var DTMF9 = document.createElement('audio');
								DTMF9.id = 'DTMF9' + elementID;
								DTMF9.setAttribute('src', 'https://my.zadarma.com/assets/dtmf-9.wav');
								DTMF9.setAttribute('preload', 'auto');
								mainDiv.appendChild(DTMF9);
								document.getElementById('DTMF9' + elementID).load();
								document.getElementById('DTMF9BTN' + elementID).addEventListener('click', function(){
									document.getElementById('DTMF9' + elementID).play();
									webRTCDTMFSender.insertDTMF(9);
								}, false);
								
								var DTMF0 = document.createElement('audio');
								DTMF0.id = 'DTMF0' + elementID;
								DTMF0.setAttribute('src', 'https://my.zadarma.com/assets/dtmf-0.wav');
								DTMF0.setAttribute('preload', 'auto');
								mainDiv.appendChild(DTMF0);
								document.getElementById('DTMF0' + elementID).load();
								document.getElementById('DTMF0BTN' + elementID).addEventListener('click', function(){
									document.getElementById('DTMF0' + elementID).play();
									webRTCDTMFSender.insertDTMF(0);
								}, false);
							}
			var class_name = "callme--shown";
			var arr = mainDiv.className.split(" ");
			if (arr.indexOf(class_name) == -1) {
				mainDiv.className += " " + class_name;
			}
			
			var max_width = 0;
			for(var i in callme__icon.children){
				if(max_width < parseInt(callme__icon.children[i].offsetWidth, 10)){
					max_width = parseInt(callme__icon.children[i].offsetWidth, 10);
				}
			}
			max_width = parseInt(max_width, 10) + 20
			callme__icon.style.width = max_width + 'px';
			
			var rgb = [];
			//hover call
			
			configs.color_bg_call.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			}); 
			configs.color_bg_call_hover = 'rgb(' + (Math.floor(rgb[0] * 0.85)) + ', ' + (Math.floor(rgb[1] * 0.85)) + ', ' + (Math.floor(rgb[2] * 0.85)) + ')';
			configs.color_call_hover = configs.color_call;
			configs.color_border_call.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			});
			configs.color_border_call_hover = 'rgb(' + (Math.floor(rgb[0] * 0.92)) + ', ' + (Math.floor(rgb[1] * 0.92)) + ', ' + (Math.floor(rgb[2] * 0.92)) + ')';

			//active call
			configs.color_bg_call.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			}); 
			configs.color_bg_call_active = 'rgb(' + (Math.floor(rgb[0] * 0.7)) + ', ' + (Math.floor(rgb[1] * 0.7)) + ', ' + (Math.floor(rgb[2] * 0.7)) + ')';
			configs.color_call_active = configs.color_call;
			configs.color_border_call.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			});
			configs.color_border_call_active  = 'rgb(' + (Math.floor(rgb[0] * 0.85)) + ', ' + (Math.floor(rgb[1] * 0.85)) + ', ' + (Math.floor(rgb[2] * 0.85)) + ')';
			
			
			
			//hover connection
			configs.color_bg_connection.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			}); 
			configs.color_bg_connection_hover = 'rgb(' + (Math.floor(rgb[0] * 0.85)) + ', ' + (Math.floor(rgb[1] * 0.85)) + ', ' + (Math.floor(rgb[2] * 0.85)) + ')';
			configs.color_connection_hover = configs.color_connection;
			configs.color_border_connection.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			});
			configs.color_border_connection_hover = 'rgb(' + (Math.floor(rgb[0] * 0.92)) + ', ' + (Math.floor(rgb[1] * 0.92)) + ', ' + (Math.floor(rgb[2] * 0.92)) + ')';

			//active connection
			configs.color_bg_connection.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			}); 
			configs.color_bg_connection_active = 'rgb(' + (Math.floor(rgb[0] * 0.7)) + ', ' + (Math.floor(rgb[1] * 0.7)) + ', ' + (Math.floor(rgb[2] * 0.7)) + ')';
			configs.color_connection_active = configs.color_connection;
			configs.color_border_connection.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			});
			configs.color_border_connection_active  = 'rgb(' + (Math.floor(rgb[0] * 0.85)) + ', ' + (Math.floor(rgb[1] * 0.85)) + ', ' + (Math.floor(rgb[2] * 0.85)) + ')';
			
			
			
			//hover calling
			configs.color_bg_calling.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			}); 
			configs.color_bg_calling_hover = 'rgb(' + (Math.floor(rgb[0] * 0.85)) + ', ' + (Math.floor(rgb[1] * 0.85)) + ', ' + (Math.floor(rgb[2] * 0.85)) + ')';
			configs.color_calling_hover = configs.color_calling;
			configs.color_border_calling.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			});
			configs.color_border_calling_hover = 'rgb(' + (Math.floor(rgb[0] * 0.92)) + ', ' + (Math.floor(rgb[1] * 0.92)) + ', ' + (Math.floor(rgb[2] * 0.92)) + ')';

			//active calling
			configs.color_bg_calling.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			}); 
			configs.color_bg_calling_active = 'rgb(' + (Math.floor(rgb[0] * 0.7)) + ', ' + (Math.floor(rgb[1] * 0.7)) + ', ' + (Math.floor(rgb[2] * 0.7)) + ')';
			configs.color_calling_active = configs.color_calling;
			configs.color_border_calling.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			});
			configs.color_border_calling_active  = 'rgb(' + (Math.floor(rgb[0] * 0.85)) + ', ' + (Math.floor(rgb[1] * 0.85)) + ', ' + (Math.floor(rgb[2] * 0.85)) + ')';
			
			
			
			
			//hover ended
			configs.color_bg_ended.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			}); 
			configs.color_bg_ended_hover = 'rgb(' + (Math.floor(rgb[0] * 0.85)) + ', ' + (Math.floor(rgb[1] * 0.85)) + ', ' + (Math.floor(rgb[2] * 0.85)) + ')';
			configs.color_ended_hover = configs.color_ended;
			configs.color_border_ended.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			});
			configs.color_border_ended_hover = 'rgb(' + (Math.floor(rgb[0] * 0.92)) + ', ' + (Math.floor(rgb[1] * 0.92)) + ', ' + (Math.floor(rgb[2] * 0.92)) + ')';

			//active ended
			configs.color_bg_ended.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			}); 
			configs.color_bg_ended_active = 'rgb(' + (Math.floor(rgb[0] * 0.7)) + ', ' + (Math.floor(rgb[1] * 0.7)) + ', ' + (Math.floor(rgb[2] * 0.7)) + ')';
			configs.color_ended_active = configs.color_ended;
			configs.color_border_ended.split(',').forEach(function(el, i) {
				rgb[i] = parseInt(el.replace(/[^0-9]+/ig, ''), 10);
			});
			configs.color_border_ended_active  = 'rgb(' + (Math.floor(rgb[0] * 0.85)) + ', ' + (Math.floor(rgb[1] * 0.85)) + ', ' + (Math.floor(rgb[2] * 0.85)) + ')';
			
			//add new styles according to configs
			var css = '' +
				//font
				'.z-callme-widget.callme.callme--square .callme__icon__text{' +
					'font-family: ' + configs.font + ';' +
				'}' +
				//default
				'.z-callme-widget.callme.callme--default {cursor:pointer;}' +
				'.z-callme-widget.callme.callme--default .callme__content {' +
					'background: ' + configs.color_bg_call + ';' +
					'box-shadow: 0 0 0 6px ' + configs.color_border_call + ';' +
					
				'}' +
				'.z-callme-widget.callme.callme--default .callme__icon {' +
				  	'color: ' + configs.color_call + ';' +
				'}' +
				//default hover
				'.z-callme-widget.callme.callme--default .callme__content:hover {' +
					'background: ' + configs.color_bg_call_hover + ';' +
					'box-shadow: 0 0 0 6px ' + configs.color_border_call_hover + ';' +
					
				'}' +
				'.z-callme-widget.callme.callme--default .callme__content:hover .callme__icon {' +
				  	'color: ' + configs.color_call_hover + ';' +
				'}' +
				//default active
				'.z-callme-widget.callme.callme--default .callme__content:active {' +
					'background: ' + configs.color_bg_call_active + ';' +
					'box-shadow: 0 0 0 6px ' + configs.color_border_call_active + ';' +
					
				'}' +
				'.z-callme-widget.callme.callme--default .callme__content:active .callme__icon {' +
				  	'color: ' + configs.color_call_active + ';' +
				'}' +
				
				
				//connecting
				'.z-callme-widget.callme.callme--connecting {cursor:pointer;}' +
				'.z-callme-widget.callme.callme--connecting .callme__content {' +
					'background: ' + configs.color_bg_connection + ';' +
					'box-shadow: 0 0 0 6px ' + configs.color_border_connection + ';' +
					
				'}' +
				'.z-callme-widget.callme.callme--connecting .callme__icon {' +
				  	'color: ' + configs.color_connection + ';' +
				'}' +
				//connecting hover
				'.z-callme-widget.callme.callme--connecting .callme__content:hover {' +
					'background: ' + configs.color_bg_connection_hover + ';' +
					'box-shadow: 0 0 0 6px ' + configs.color_border_connection_hover + ';' +
					
				'}' +
				'.z-callme-widget.callme.callme--connecting .callme__content:hover .callme__icon {' +
				  	'color: ' + configs.color_connection_hover + ';' +
				'}' +
				//connecting active
				'.z-callme-widget.callme.callme--connecting .callme__content:active {' +
					'background: ' + configs.color_bg_connection_active + ';' +
					'box-shadow: 0 0 0 6px ' + configs.color_border_connection_active + ';' +
					
				'}' +
				'.z-callme-widget.callme.callme--connecting .callme__content:active .callme__icon {' +
				  	'color: ' + configs.color_connection_active + ';' +
				'}' +
				
				
				//speaking
				'.z-callme-widget.callme.callme--speaking .callme__content {' +
					'background: ' + configs.color_bg_calling + ';' +
					'box-shadow: 0 0 0 6px ' + configs.color_border_calling + ';' +
					
				'}' +
				'.z-callme-widget.callme.callme--speaking .callme__icon {' +
				  	'color: ' + configs.color_calling + ';' +
				'}' +
				( configs.shape == 'circle' ?
				'.z-callme-widget.callme.callme--speaking {cursor:pointer;}' +
				//speaking hover
				'.z-callme-widget.callme.callme--speaking .callme__content:hover {' +
					'background: ' + configs.color_bg_calling_hover + ';' +
					'box-shadow: 0 0 0 6px ' + configs.color_border_calling_hover + ';' +
					
				'}' +
				'.z-callme-widget.callme.callme--speaking .callme__content:hover .callme__icon {' +
				  	'color: ' + configs.color_calling_hover + ';' +
				'}' +
				//speaking active
				'.z-callme-widget.callme.callme--speaking .callme__content:active {' +
					'background: ' + configs.color_bg_calling_active + ';' +
					'box-shadow: 0 0 0 6px ' + configs.color_border_calling_active + ';' +
					
				'}' +
				'.z-callme-widget.callme.callme--speaking .callme__content:active .callme__icon {' +
				  	'color: ' + configs.color_calling_active + ';' +
				'}' : '.z-callme-widget.callme.callme--speaking {pointer:default;}' ) +
				
				
				//finished
				'.z-callme-widget.callme.callme--finished {cursor:pointer;}' +
				'.z-callme-widget.callme.callme--finished .callme__content {' +
					'background: ' + configs.color_bg_ended + ';' +
					'box-shadow: 0 0 0 6px ' + configs.color_border_ended + ';' +
					
				'}' +
				'.z-callme-widget.callme.callme--finished .callme__icon {' +
				  	'color: ' + configs.color_ended + ';' +
				'}' +
				//finished hover
				'.z-callme-widget.callme.callme--finished .callme__content:hover {' +
					'background: ' + configs.color_bg_ended_hover + ';' +
					'box-shadow: 0 0 0 6px ' + configs.color_border_ended_hover + ';' +
					
				'}' +
				'.z-callme-widget.callme.callme--finished .callme__content:hover .callme__icon {' +
				  	'color: ' + configs.color_ended_hover + ';' +
				'}' +
				//finished active
				'.z-callme-widget.callme.callme--finished .callme__content:active {' +
					'background: ' + configs.color_bg_ended_active + ';' +
					'box-shadow: 0 0 0 6px ' + configs.color_border_ended_active + ';' +
					
				'}' +
				'.z-callme-widget.callme.callme--finished .callme__content:active .callme__icon {' +
				  	'color: ' + configs.color_ended_active + ';' +
				'}' +
				
				
					'.z-callme-widget.callme{' +
						'width:auto;' +
					'}' + 
			
				'.z-callme-widget.callme.callme--speaking [class^="icon-"],.z-callme-widget.callme.callme--speaking [class*="icon-"]{ ' +
					'color:' + configs.color_calling +
				'}' +
				'.z-callme-widget.callme.callme--speaking [class^="icon-"]:hover,.z-callme-widget.callme.callme--speaking [class*="icon-"]:hover{ ' +
					'color:' + configs.color_calling_hover +
				'}' +
				'.z-callme-widget.callme.callme--speaking [class^="icon-"]:active,.z-callme-widget.callme.callme--speaking [class*="icon-"]:active{ ' +
					'color:' + configs.color_calling_active +
				'}' + 
				'.icon-finish-phone-ico{cursor:pointer;}';

			
			var style = document.createElement('style');

			style.type = 'text/css';
			if (style.styleSheet){
			  // This is required for IE8 and below.
			  style.styleSheet.cssText = css;
			} else {
			  style.appendChild(document.createTextNode(css));
			}

			mainDiv.appendChild(style);
		}
		
		var streamError = function (error) {
		   console.error(error);
		}
		
		ZadarmaCallmeWidget.prototype.setCallId = function(response){ 
			if(noConnection === true) return;
			callId = response.callId;
			session = connection.call('sip:' + configs.sipId + '@' + configs.domain, {
				'mediaConstraints': { audio: true, video: false },
				'pcConfig': { rtcpMuxPolicy: 'negotiate' },
				'extraHeaders': [ 'callid:' + callId, 'widgetid: ' + configs.widgetId, 'language: ' + (configs.language == 'ua' ? 'ru' : configs.language) ],
			});

			session.connection.addEventListener('addstream', function (e) {
				attachStream(e.stream);
			});
		}
		
		
		function stopCall(){
			
			var MediaStream = window.MediaStream;

			if (typeof MediaStream === 'undefined' && typeof webkitMediaStream !== 'undefined') {
				MediaStream = webkitMediaStream;
			}

			/*global MediaStream:true */
			if (typeof MediaStream !== 'undefined' && !('stop' in MediaStream.prototype)) {
				MediaStream.prototype.stop = function() {
					this.getAudioTracks().forEach(function(track) {
						track.stop();
					});

				};
			}
			setState.call(this, 'ended');
		}
		
		function makeCall(){
			//create callID and make call
			audioCtx = new AudioContext;
			gainNode = audioCtx === false ? false : audioCtx.createGain();
			var script = document.createElement('script');
			script.src = 'https://api.zadarma.com/sys/webrtc/create_callId.php?jsonpCallback=' + objectLink + '.setCallId&widgetId=' + configs.widgetId + '&sipId=' + configs.sipId + '&language=' + configs.language + '&url=' + encodeURI(document.location.href).replace('#', '%23');
			mainDiv.appendChild(script);
		}
		
		function hangupSound(){
			var promise = document.getElementById('hangup_' + elementID).play();
				
			if (promise !== undefined) {
				promise.catch(function error () {
					// Auto-play was prevented
					// Show a UI element to let the user manually start playback
					console.error('User browser disabled autoplaying media - no ringing.');
				}).then(function()  {
					// Auto-play started
					
				});
			}
		}
		
		function ringBuzy(){
			var promise = document.getElementById('buzyRing_' + elementID).play();
				
			if (promise !== undefined) {
				promise.catch(function error () {
					// Auto-play was prevented
					// Show a UI element to let the user manually start playback
					console.error('User browser disabled autoplaying media - no ringing.');
				}).then(function()  {
					// Auto-play started
					
				});
			}
		}
		
		function stopBusy(){
			document.getElementById('buzyRing_' + elementID).pause();
			document.getElementById('buzyRing_' + elementID).currentTime = 0;
		}
		
		function stopRing(){
			clearInterval(playRingTimeout);
			document.getElementById('outgoingRing_' + elementID).pause();
			document.getElementById('outgoingRing_' + elementID).currentTime = 0;
		}
		
		function playRing(){
			clearInterval(playRingTimeout);
			playRingTimeout = setInterval(function(){
				var promise = document.getElementById('outgoingRing_' + elementID).play();

				if (promise !== undefined) {
					promise.catch(function error () {
						// Auto-play was prevented
						// Show a UI element to let the user manually start playback
						console.error('User browser disabled autoplaying media - no ringing.');
					}).then(function()  {
						// Auto-play started

					});
				}
			}, 3000);
		}
		
		function setState(status){
			stopRing.call(this);
			stopBusy.call(this);
			
			if(noConnection === true){ console.error("Wrong parameters of Zadarma callme widget."); return;}
			
			var old_status = current_status;
			if(!status){
				if(current_status == 'call'){
					//get callId
					makeCall.call(this);
					current_status = 'connection';
				}else if(current_status == 'connection'){
					current_status = 'ended';
					busy = 'none';
				}else if(current_status == 'ended'){
					current_status = 'call';
				}
			} else {
				if(status == 'ended'){
					current_status = 'ended';
				}else if(status == 'call'){
					current_status = 'call';
				}else if(status == 'calling'){
					mainDiv.removeEventListener('click', setStatusFn, false);
					current_status = 'calling';
				}
			}
			
			if(current_status == 'calling'){
				mainDiv.removeEventListener('mousedown', setStatusFn, false);
			}else{
				mainDiv.removeEventListener('mousedown', setStatusFn, false);
				mainDiv.addEventListener('mousedown', setStatusFn, false);
			}
			
			if(old_status == current_status) return;
			
			
			
			changeBtnStatus.call(this, old_status);
			
			
		}
		
		function changeBtnStatus(old_status){
			clearTimeout(busyTimeout);
			var newClass = '';
			if(current_status == 'call'){
				newClass = 'callme--default';
			}else if(current_status == 'connection'){
				newClass = 'callme--connecting';
			}else if(current_status == 'calling'){
				beginTimer.call(this);
				newClass = 'callme--speaking';
				
				if(configs.dtmf === true){
					switchDTMF.call(this, 'on');
					if(configs.dtmf_time_to_disappear > 0){
						dtmfTimer = setTimeout(function(){
							switchDTMF.call(this, 'off');
						}, configs.dtmf_time_to_disappear * 1000);
					}
				}
			}else if(current_status == 'ended'){
				newClass = 'callme--finished';
				stopTimer.call(this);
				if(old_status == 'calling' || busy && busy == 'none'){
					done_callme__icon__text.innerHTML = ZadarmaCallmeWidgetLanguagePack.ended;
					hangupSound.call(this);
					terminateCall.call(this);
					
				}else{
					done_callme__icon__text.innerHTML = ZadarmaCallmeWidgetLanguagePack.buzy;
					ringBuzy.call(this);
				}
				switchDTMF.call(this, 'off');
				
			}
		
			if(old_status == 'call'){
				mainDiv.className = mainDiv.className.replace(/callme--default/i, newClass);
			}else if(old_status == 'connection'){
				mainDiv.className = mainDiv.className.replace(/callme--connecting/i, newClass);
			}else if(old_status == 'calling'){
				mainDiv.className = mainDiv.className.replace(/callme--speaking/i, newClass);
			}else if(old_status == 'ended'){
				mainDiv.className = mainDiv.className.replace(/callme--finished/i, newClass);
			}
			
			busyTimeout = setTimeout(function(){busy = '';}, 1000);
		}
		
		function initializeEvents(){
			
			connection.on('connected', function (e)  {
				attempts = 0;
				mainDiv.style.visibility = 'visible';
			});
			connection.on('disconnected', function (e)  {
				var domain = configs.domain;
				attempts += 1;
				connection.stop();
				clearTimeout(getConnectionInfoTimeout);
				if(attempts < 5){
					getConnectionInfoTimeout = setTimeout(function(){
						getConnectionConfiguration.call(this, 1, domain);
					}, 4000);
				}else{
					console.error("Zadarma servers are unable at this moment. Try to connect later.");
				}
			});
			
			
			connection.on("newRTCSession", function(data){
				
				sessionWebrtc = data.session;
				
				sessionWebrtc.on("confirmed",function(e){
					//the call has connected, and audio is playing
					
					setState.call(this, 'calling');
					
					if (sessionWebrtc.connection.getReceivers().length > 0) {
						var track = sessionWebrtc.connection.getReceivers()[0]['track'];
						
						var stream = new MediaStream();
						
						if(track){
							stream.addTrack(track);
							attachStream(stream);
						}
						
					}else if (sessionWebrtc.connection.getRemoteStreams().length > 0) {
						attachStream(sessionWebrtc.connection.getRemoteStreams()[0]);
					}

                    if (sessionWebrtc.connection.getSenders) {
                        webRTCDTMFSender = sessionWebrtc.connection.getSenders()[0].dtmf;
                    } else if(sessionWebrtc.connection.createDTMFSender){
                        webRTCDTMFSender = 
                            sessionWebrtc.connection.createDTMFSender((sessionWebrtc.connection.getSenders()[0]).getAudioTracks()[0]);
                    }
					
					
				});
				
				
				sessionWebrtc.on("progress", function(event){
					var response = event.response;
					if (response.status_code == 183 && audioCtx !== false && navigator.userAgent.search(/Firefox/) == -1) {
						stopRing.call(this);
						
					}else{
						playRing.call(this);
					}
					if(navigator.userAgent.search(/Firefox/) != -1){
						event.response.data = null;
						event.response.body = null;
					}
				});
				
				
				sessionWebrtc.on("ended",function(){
					//the call has ended
					stopCall.call(this);
					
					
				});
				sessionWebrtc.on("failed",function(e){
					// unable to establish the call
					stopCall.call(this);
					
				});
				sessionWebrtc.on('addstream', function(e){
					webRTCRemoteView.srcObject = e.stream;
					
					webRTCRemoteView.onloadedmetadata = function(e) {
						webRTCRemoteView.play();
						//webRTCRemoteView.muted = true;
					}
					
					
				});
				
			});
			
			/**/
		}
		
		function closeWebSocket(){
			
			sessionWebrtc.terminate();
			connection.unregister({all: true});
			configs.domain = null;
			sessionWebrtc = null;
			
		}
		
		function terminateCall(){
			if(sessionWebrtc && sessionWebrtc.status && sessionWebrtc.status != 8){
				sessionWebrtc.terminate();
			}
		}
		
		function beginTimer(){
			startTime = Math.ceil(getCurrentTime.call(this) / 1000);
			
			timerTimeout = setInterval(function(){
				var curT = Math.ceil(getCurrentTime.call(this) / 1000);
				seconds = (curT - startTime) % 60;
				minutes = Math.floor((curT - startTime) / 60);
				done_callme__caller_timer.innerHTML = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
			}, 1000);
		}
		
		function stopTimer(){
			clearInterval(timerTimeout);
			done_callme__caller_timer.innerHTML = '00:00';
		}
		
		function getCurrentTime(){
			
			return +new Date();
		}
		
		function getConnectionConfiguration(reconnect, domain){
			
			var script = document.createElement('script');
			script.src = 'https://api.zadarma.com/sys/webrtc/get_callmebutton_data.php?jsonpCallback=' + objectLink + '.zadarmaCallback&widgetId=' + configs.widgetId + '&sipId=' + configs.sipId + '&language=' + configs.language + (reconnect == 1 ? '&reconnect=1' + (domain ? '&domain=' + domain : '') : '');
			
			mainDiv.appendChild(script);
			
		}
		
		function gotStream(stream){
			//do nothing. debug function
		}
		
		function attachStream(stream) {
			
			webRTCRemoteView.srcObject = stream;
	
			webRTCRemoteView.onloadedmetadata = function(e) {
				webRTCRemoteView.play();
				if(iOS === false){
					webRTCRemoteView.muted = true;
				}
			};
			
			// Create a MediaStreamAudioSourceNode
			// Feed the HTMLMediaElement into it
			if(audioCtx !== false){
				// Create a gainNode
				
				var source = audioCtx.createMediaStreamSource(webRTCRemoteView.srcObject);
				if(iOS === false){
					source.connect(gainNode);
					gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
					gainNode.connect(audioCtx.destination);
				}
			}
		}
		
		function detectIE() {
		  	var ua = window.navigator.userAgent;

		  	var msie = ua.indexOf('MSIE ');
		  	if (msie > 0) {
				// IE 10 or older => return version number
				return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		  	}

		  	var trident = ua.indexOf('Trident/');
		  	if (trident > 0) {
				// IE 11 => return version number
				var rv = ua.indexOf('rv:');
				return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		  	}

		  	var edge = ua.indexOf('Edge/');
		  	if (edge > 0) {
				// Edge (IE 12+) => return version number
				return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		  	}

		  	// other browser
		  	return false;
		}
		
		ZadarmaCallmeWidget.prototype.create = function(_configs, options) {
			
			configs.widgetId = _configs.widgetId;
			configs.sipId = _configs.sipId;
			elementID = _configs.domElement;
			setConfigs.call(this, options);
			mainDiv = document.getElementById(elementID);

			var script = document.createElement('script');
			script.src = 'https://api.zadarma.com/sys/webrtc/check_widget_status.php?jsonpCallback=' + objectLink + '.zadarmaCreate&widgetId=' + configs.widgetId + '&sipId=' + configs.sipId + '&language=' + configs.language;

			mainDiv.appendChild(script);
			
		}
		
		ZadarmaCallmeWidget.prototype.zadarmaCreate = function(response){
			if(typeof ZadarmaCallmeWidgetLanguagePack.call == 'undefined'){
				ZadarmaCallmeWidgetLanguagePack = response.texts;
			}
			console.log(response, ZadarmaCallmeWidgetLanguagePack);
			configs.txt_greeting = response.txt_greeting;
			configs.txt_nowebrtc = response.txt_nowebrtc;
			
			if(detectIE() !== false || !DetectRTC.isWebRTCSupported){
			   mainDiv.innerHTML = configs.txt_nowebrtc;
			   console.error('Zadarma Callme Widget is not supported by your browser');
			} else if(document.location.protocol != 'https:'){
				mainDiv.innerHTML = configs.txt_nowebrtc;
				console.error('You are trying to use Zadarma Callme Widget with http:// protocol site.');
			}else{
				if(configs.txt_greeting != '') ZadarmaCallmeWidgetLanguagePack.call = configs.txt_greeting;
			
				if(response && response.status && response.status == 1){
					mainDiv.style.opacity = 0;
					buildOut.call(this);
					mainDiv.style.opacity = 1;
					getConnectionConfiguration.call(this);
				}else{
					mainDiv.innerHTML = configs.txt_nowebrtc;
					console.error('Zadarma Callme Widget is switched off or not exists');
				}
			}
			
			
		}
		
		ZadarmaCallmeWidget.prototype.zadarmaCallback = function(response){
			if(response && response.domain){
				configs.domain = response.domain;
				configs.username = response.username;
				configs.pass = response.pass;

				JsSIP.C.USER_AGENT = 'Zadarma CallmeButton Widget';

				var socket = new JsSIP.WebSocketInterface('wss://' + configs.domain + ':4443');

				var configuration = {
					sockets  : [ socket ],
					uri      : 'sip:' + configs.username + '@' + response.domain,
					display_name : configs.username,
					password: configs.pass,
					register: false
				};

				connection = new JsSIP.UA(configuration);
				
				connection.start();
				
				initializeEvents.call(this);
				
			}else{
				noConnection = true;
			}
		}
		
  	}
}());