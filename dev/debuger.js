 var debug = (function(console) {

   var Debug = {};

   // handles the errors and throw that are loadded after;
   Debug.handleErrors = function() {

     window.onerror = function(msg, url, line, col, error) {
       // some compatibility handling
       var extra = {
         col: (!col ? 0 : col),
         error: (!error ? 0 : error)
       };
       var message = {
         msg: msg,
         url: url,
         line: line,
         type: "error"
       };

       for (ex in extra) {
         if (extra[ex]) {
           message[ex] = extra[ex];
         }
       }
       if (!Debug._uiCreated) {

         Debug._storeMessage(message);
       }

       if (Debug._uiCreated) {

         Debug._directWrite(message);
       }

       var suppressErrorAlert = true;
       return suppressErrorAlert;
     };

   };
   // handles the messages storing them before the DOM ready and then writeing them in a on screen "console"

   Debug._stored = [];
   Debug._storeMessage = function(message, callback) {
     Debug._stored.push(message);
     if (!!callback) {
       callback();
     }
   };
   Debug._recursiveText = '';
   Debug._recursiveJump = function(Obj) {
     for (pr in Obj) {
       console.warn(pr);
       if (typeof Obj[pr] === 'object' && !!Obj[pr]) {
         var token_open = ' { ';
         var token_close = ' } ';

         if (Array.isArray(Obj[pr])) {
           token_open = ' [ ';
           token_close = ' ] ';
         }
         Debug._recursiveText += '<span class="message-child" style="margin-left:8px;clear:left;">' + pr + ':' + token_open + '\n';
         Debug._recursiveJump(Obj[pr]);
         Debug._recursiveText += token_close + '\n </span>';
       } else {
         Debug._recursiveText += pr + ':' + Obj[pr] + '\n';
       }

     }
   };
   Debug._writeStorage = function() {
     var Stored = Debug._stored;
     var appendChildTarget = document.querySelector('#debugger_window .messages');

     for (var i = 0; i < Stored.length; i++) {

       var msgContainer = document.createElement('span');
       msgContainer.classList.add('message');

       var icon = document.createElement('div');
       icon.classList.add('icon');
       msgContainer.appendChild(icon);

       for (prop in Stored[i]) {
         if (prop !== 'error') {
           var el = document.createElement('div');
           el.classList.add(prop);
           el.classList.add('message-child');

           if (prop === 'type') {
             msgContainer.classList.add('type-' + Stored[i][prop]);
           } else {
             el.innerHTML = prop + ":" + Stored[i][prop];
           }
           if (Stored[i].type === 'log' && typeof Stored[i][prop] === 'object') {

             // should handle larger depth with a recursive function
             Debug._recursiveText = '{\n';
             var elDepth = document.createElement('div');
             elDepth.classList.add('message-child');

             Debug._recursiveJump(Stored[i][prop]);

             Debug._recursiveText += '}\n';
             elDepth.innerHTML = Debug._recursiveText;
             el.innerHTML = '';
             el.appendChild(elDepth);
           }

           msgContainer.appendChild(el);

         }

       }
       msgContainer.addEventListener('click', function(e) {
         this.classList.toggle('active');
         if (this.classList.contains('active')) {
           this.style.height = ((this.childNodes.length - 1) * 16) + 'px';
         } else {
           this.style.height = 16 + 'px';
         }
       });
       if (appendChildTarget) {
         appendChildTarget.appendChild(msgContainer);
       }

     }
   };
   Debug._directWrite = function(message) {
     Debug._storeMessage(message, Debug._writeStorage);
   };
   Debug._uiCreated = false;
   Debug.createUI = function() {
     document.addEventListener('DOMContentLoaded', function() {

       var head = document.getElementsByTagName('head');
       var body = document.getElementsByTagName('body');

       var container = document.createElement('div');
       container.setAttribute('id', "debugger_window");
       container.innerHTML = '<div class="toggle-btn settings-cog"></div> <div class="messages"></div>';

       var styles = document.createElement('link');
       styles.setAttribute('rel', 'stylesheet');
       styles.setAttribute('href', 'debuger.css');


       head[0].appendChild(styles);
       body[0].appendChild(container);

       Debug._writeStorage();
       var debugger_window_click = document.querySelector('#debugger_window .toggle-btn');

       debugger_window_click.addEventListener('click', function(e) {
         e.preventDefault();
         var messages_window = document.querySelector('#debugger_window .messages');
         messages_window.classList.toggle('active');
       });

       Debug._uiCreated = true;

     });
   };
   // this part handles the activation / deactivation via the search parameter in the url
   Debug.activationCheck = function() {

     var params = window.location.href;
     var isActive = (params.indexOf('activateMobileDebugger=true') !== -1);
     var isInactive = (params.indexOf('activateMobileDebugger=false') !== -1);
     //alert(params)
     if (isActive) {
       localStorage.setItem('JSMobileDebugger', true);
     }
     if (isInactive) {
       localStorage.setItem('JSMobileDebugger', false);
     }
     return (localStorage.getItem('JSMobileDebugger') === "true");
   };
   // this part handles the messages right just log, warn and error from the console object are being handled
   Debug.log = function() {
     var message = {};
     message.type = 'log';
     for (var i = arguments.length - 1; i >= 0; i--) {
       message[i] = arguments[i];
     }
     Debug._directWrite(message);
     // Debug.ogLog.apply( this, arguments )
   };
   Debug.console = function(console) {
     Debug.ogLog = console.log;
     console.log = Debug.log;
   };

   Debug.init = function() {
     if (Debug.activationCheck()) {
       Debug.handleErrors();
       Debug.createUI();
       Debug.console(console);
     }
   };

   return {
     init: Debug.init
   };

 })(console);
 debug.init();
