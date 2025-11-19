const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL_API = BASE_URL + "/api";
const BROKER_MQTT_URL = import.meta.env.VITE_MQTT_URL;
const BROKER_MQTT_USERNAME = import.meta.env.VITE_MQTT_USERNAME;
const BROKER_MQTT_PASSWORD = import.meta.env.VITE_MQTT_PASSWORD;

const VITE_BROADCASTER = import.meta.env.VITE_BROADCASTER;
const VITE_ECHO_HOST = import.meta.env.VITE_ECHO_HOST;
const VITE_PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER;
const VITE_PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;
const VITE_ECHO_PORT_WSS = import.meta.env.VITE_ECHO_PORT_WSS;
const VITE_ECHO_PORT_WS = import.meta.env.VITE_ECHO_PORT_WS;
const VITE_ECHO_AUTH_ENDPOINT_WS = import.meta.env.VITE_ECHO_AUTH_ENDPOINT_WS;
const VITE_ECHO_AUTH_ENDPOINT_WSS = import.meta.env.VITE_ECHO_AUTH_ENDPOINT_WSS;
const VITE_ECHO_FORCE_TLS = import.meta.env.VITE_ECHO_FORCE_TLS;
const intervalValue = Number(import.meta.env.VITE_INTERVAL_VALUE);

const FormHTML = (container) => {
  let HTML_OUTPUT = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>DragDrop Content</title>`;

  HTML_OUTPUT += `
      <!-- Simple CSS Fallback -->
      <link rel="stylesheet" href="${BASE_URL}/assets/fonts/ds-digital.css" 
            onerror="this.onerror=null;this.href='https://fonts.cdnfonts.com/css/ds-digital'">
      <link rel="stylesheet" href="${BASE_URL}/assets/fonts/azeret-mono.css" 
            onerror="this.onerror=null;this.href='https://fonts.cdnfonts.com/css/azeret-mono'">
      <link rel="stylesheet" href="${BASE_URL}/assets/fonts/noto-serif-toto.css" 
            onerror="this.onerror=null;this.href='https://fonts.cdnfonts.com/css/noto-serif-toto'">
      <link rel="stylesheet" href="${BASE_URL}/assets/fonts/edu-sa-beginner.css" 
            onerror="this.onerror=null;this.href='https://fonts.cdnfonts.com/css/edu-sa-beginner'">
      <link rel="stylesheet" href="${BASE_URL}/assets/css/tailwind.min.css" 
            onerror="this.onerror=null;this.href='https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'">
      <link rel="stylesheet" href="${BASE_URL}/assets/css/toastify.min.css" 
            onerror="this.onerror=null;this.href='https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'">
      
      <!-- Enhanced JS Loading -->
      <script defer>
        window.addEventListener('load', function() {
          function loadScript(localSrc, cdnSrc) {
            return new Promise((resolve) => {
              const s = document.createElement('script');
              s.src = localSrc;
              
              const timeout = setTimeout(() => {
                console.warn('Timeout, trying CDN:', cdnSrc);
                loadFromCDN(cdnSrc).then(resolve);
              }, 5000);
              
              s.onload = () => {
                clearTimeout(timeout);
                console.log('✅ Loaded:', localSrc);
                resolve();
              };
              
              s.onerror = () => {
                clearTimeout(timeout);
                loadFromCDN(cdnSrc).then(resolve);
              };
              
              document.body.appendChild(s);
            });
          }
          
          function loadFromCDN(src) {
            return new Promise((resolve) => {
              const s = document.createElement('script');
              s.src = src;
              s.onload = () => { console.log('✅ CDN loaded:', src); resolve(); };
              s.onerror = () => { console.error('❌ Failed:', src); resolve(); };
              document.body.appendChild(s);
            });
          }
          
          Promise.all([
            loadScript('${BASE_URL}/assets/js/toastify.min.js', 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.js'),
            loadScript('${BASE_URL}/assets/js/pusher.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pusher/7.2.0/pusher.min.js'),
            loadScript('${BASE_URL}/assets/js/echo.iife.js', 'https://cdn.jsdelivr.net/npm/laravel-echo/dist/echo.iife.js'),
            loadScript('${BASE_URL}/assets/js/axios.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.8/axios.min.js'),
            loadScript('${BASE_URL}/assets/js/mqtt.min.js', 'https://unpkg.com/mqtt/dist/mqtt.min.js'),
            loadScript('${BASE_URL}/assets/js/crypto-js.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js')
          ]).then(() => console.log('✅ All loaded'));
        });
      </script>
    `;

  HTML_OUTPUT += `<style>
        body {
        padding: 0;
        margin: 0;
        overflow: hidden;
        }

        .spinner {
          border: 6px solid #dddddd;
          border-top: 6px solid #3b82f6;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

              .modal {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 9999;
        background-color: rgba(0, 0, 0, 0.5);
      }

      .modal-content {
        animation-name: animatetop;
        animation-duration: 0.4s;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      /* Add Animation */
      @-webkit-keyframes animatetop {
        from {
          top: -300px;
          opacity: 0;
        }
        to {
          top: 0;
          opacity: 1;
        }
      }

      @keyframes animatetop {
        from {
          top: -300px;
          opacity: 0;
        }
        to {
          top: 0;
          opacity: 1;
        }
      }

      </style>
      </head>
      <body>
        <!-- Spinner -->
        <div id="loadingOverlay" class="h-screen w-full flex flex-row justify-center items-center">
          <div class="spinner"></div>
        </div>
        <!-- Modal -->
        <div
          id="myModal"
          class="modal w-full h-full flex flex-row justify-center items-center"
        >
          <div class="modal-content w-1/2 bg-white text-dark-100  dark:bg-dark-100 dark:text-white p-5 pb-14 rounded-lg">
            <div class="w-full h-auto flex flex-row justify-end items-center">
              <span
                class="close-btn w-auto h-auto flex flex-row justify-center items-center cursor-pointer text-dark-100 dark:text-white text-4xl font-bold hover:text-red-500"
              >
                &times;
              </span>
            </div>
            <div id="modalBody"></div>
          </div>
        </div>
        <div id="form-container" class="h-screen w-full flex flex-row justify-center items-center !bg-white !text-dark-100  dark:!bg-dark-100 dark:!text-white">
          ${container.outerHTML}
        </div>
        <script type="module">

      

        const _0xabff89=_0xef07;function _0xef07(_0x31e12d,_0x4c1d52){const _0x2a938e=_0x2a93();return _0xef07=function(_0xef07ef,_0x3ea2f2){_0xef07ef=_0xef07ef-0x145;let _0xd86173=_0x2a938e[_0xef07ef];return _0xd86173;},_0xef07(_0x31e12d,_0x4c1d52);}(function(_0x123cd8,_0x5349c2){const _0x56f40d=_0xef07,_0x1b538e=_0x123cd8();while(!![]){try{const _0x961814=-parseInt(_0x56f40d(0x148))/0x1+-parseInt(_0x56f40d(0x146))/0x2+parseInt(_0x56f40d(0x14c))/0x3*(parseInt(_0x56f40d(0x147))/0x4)+-parseInt(_0x56f40d(0x14a))/0x5*(parseInt(_0x56f40d(0x149))/0x6)+-parseInt(_0x56f40d(0x14f))/0x7*(-parseInt(_0x56f40d(0x14d))/0x8)+-parseInt(_0x56f40d(0x145))/0x9+parseInt(_0x56f40d(0x14e))/0xa;if(_0x961814===_0x5349c2)break;else _0x1b538e['push'](_0x1b538e['shift']());}catch(_0x265d07){_0x1b538e['push'](_0x1b538e['shift']());}}}(_0x2a93,0x300f8));const REACT_APP_SALT=_0xabff89(0x14b);function _0x2a93(){const _0x405fc6=['rDv(Y5\x22H','71403RuCdUw','2872GhZfNO','10859980ukcjdt','497wMFlNk','2919033cDyKKb','534144XNqkAe','12uPOmvZ','49987jeNVFx','295404DgjfiP','35hZLpRX'];_0x2a93=function(){return _0x405fc6;};return _0x2a93();}

        const _0x34c08e=_0x1e94;(function(_0x3a34ef,_0xb3a918){const _0x378a48=_0x1e94,_0xdd0c71=_0x3a34ef();while(!![]){try{const _0x46195d=-parseInt(_0x378a48(0x70))/0x1+parseInt(_0x378a48(0x6b))/0x2+parseInt(_0x378a48(0x72))/0x3*(-parseInt(_0x378a48(0x6f))/0x4)+parseInt(_0x378a48(0x6c))/0x5+-parseInt(_0x378a48(0x6a))/0x6+parseInt(_0x378a48(0x6d))/0x7+-parseInt(_0x378a48(0x73))/0x8*(parseInt(_0x378a48(0x6e))/0x9);if(_0x46195d===_0xb3a918)break;else _0xdd0c71['push'](_0xdd0c71['shift']());}catch(_0x5ba124){_0xdd0c71['push'](_0xdd0c71['shift']());}}}(_0x573e,0x29ae9));function _0x1e94(_0x5d053d,_0x533942){const _0x573e23=_0x573e();return _0x1e94=function(_0x1e94de,_0x581d15){_0x1e94de=_0x1e94de-0x6a;let _0x1b96dd=_0x573e23[_0x1e94de];return _0x1b96dd;},_0x1e94(_0x5d053d,_0x533942);}const REACT_APP_PREFIX=_0x34c08e(0x71);function _0x573e(){const _0x26e081=['173332Buqemc','27810SmLvYQ','be@st','6OODArP','2547256qbJVHG','294780eYcUOY','68020zhBgrN','1497425hzMhjt','2234729zUFLJQ','9UvIqgk'];_0x573e=function(){return _0x26e081;};return _0x573e();};

        const _0x1e35b2=_0x45ce;(function(_0x17215c,_0x5970e7){const _0x2d325c=_0x45ce,_0xf09167=_0x17215c();while(!![]){try{const _0x144b06=parseInt(_0x2d325c(0xb2))/0x1+-parseInt(_0x2d325c(0xb3))/0x2*(parseInt(_0x2d325c(0xaf))/0x3)+parseInt(_0x2d325c(0xad))/0x4*(-parseInt(_0x2d325c(0xac))/0x5)+-parseInt(_0x2d325c(0xb0))/0x6*(-parseInt(_0x2d325c(0xb5))/0x7)+parseInt(_0x2d325c(0xab))/0x8+-parseInt(_0x2d325c(0xaa))/0x9*(-parseInt(_0x2d325c(0xb1))/0xa)+-parseInt(_0x2d325c(0xb4))/0xb;if(_0x144b06===_0x5970e7)break;else _0xf09167['push'](_0xf09167['shift']());}catch(_0x28cb56){_0xf09167['push'](_0xf09167['shift']());}}}(_0x4be5,0xd9898));function _0x4be5(){const _0x38ad76=['140228NAyBaS','22997480fSnqoi','217TdLlCi','52110gjaldF','6947480XhEpVN','5VloCoj','1922456GZccsG','hin!!rt','18YkrEFr','108564FgrFJr','1810koreyU','1405671UoEATC'];_0x4be5=function(){return _0x38ad76;};return _0x4be5();}function _0x45ce(_0x208796,_0x17ddba){const _0x4be5d9=_0x4be5();return _0x45ce=function(_0x45ceed,_0x4a3ba6){_0x45ceed=_0x45ceed-0xaa;let _0x29ff1a=_0x4be5d9[_0x45ceed];return _0x29ff1a;},_0x45ce(_0x208796,_0x17ddba);}const REACT_APP_SUFFIX=_0x1e35b2(0xae);

        const REACT_APP_ALLOWED_CHARS ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
        const BASE_URL_API = "${BASE_URL_API}";
        
        const API_ENDPOINTS = {
            MQTT_URL: "${BROKER_MQTT_URL}",
            USER_NAME: "${BROKER_MQTT_USERNAME}",
            PASSWORD: "${BROKER_MQTT_PASSWORD}",
            INTERVAL_VALUE: ${intervalValue},
        };
      
      class TopLoadingBar {
        constructor(options = {}) {
          this.color = options.color || '#3b82f6';
          this.height = options.height || '3px';
          this.progress = 0;
          this.isVisible = false;
          this.timers = [];
          this.container = null;
          this.bar = null;
          
          this.init();
        }

        init() {
          this.container = document.createElement('div');
          this.container.style.cssText = \`
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              width: 100% !important;
              height: 3px !important;
              z-index: 1000 !important;
              background-color: #b2b2b2;
              pointer-events: none;
              display: inline-block;
              margin: 0;
              padding: 0;
            \`;

          this.bar = document.createElement('div');
         this.bar.style.cssText = \`
          height: 100%;
          width: 0%;
          background-color: #3b82f6;
          box-shadow: 0 0 10px #3b82f6, 0 0 5px #3b82f6;
          transition: width 0.3s ease-out;
        \`;

          this.container.appendChild(this.bar);
          document.body.appendChild(this.container);
        }

        start() {
          this.isVisible = true;
          this.progress = 0;
          this.container.style.display = 'inline-block';
          this.updateProgress(0);

          this.timers.push(setTimeout(() => this.updateProgress(30), 100));
          this.timers.push(setTimeout(() => this.updateProgress(60), 300));
          this.timers.push(setTimeout(() => this.updateProgress(80), 600));
        }

        complete() {
          this.clearTimers();
          
          this.timers.push(setTimeout(() => {
            this.bar.style.transition = 'width 0.3s ease-out, opacity 0.4s ease-out';
            this.bar.style.opacity = '0';
            
            this.timers.push(setTimeout(() => {
              this.container.style.display = 'none';
              this.bar.style.opacity = '1';
              this.bar.style.transition = 'width 0.3s ease-out';
              this.isVisible = false;
              this.progress = 0;
            }, 400));
          }, 100));
        }

        updateProgress(percent) {
          this.progress = percent;
          this.bar.style.width = \`\${percent}%\`;
        }

        clearTimers() {
          this.timers.forEach(timer => clearTimeout(timer));
          this.timers = [];
        }

        destroy() {
          this.clearTimers();
          if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
          }
        }
      }

      const loadingBar = new TopLoadingBar({
        color: '#3b82f6',
        height: '3px'
      });

          function openModal(contentElement) {
          const modal = document.getElementById("myModal");
          const modalBody = document.getElementById("modalBody");

          modalBody.innerHTML = "";
          modalBody.appendChild(contentElement.cloneNode(true));
          modal.style.display = "block";
          }

          document.querySelector(".close-btn").addEventListener("click", () => {
            document.getElementById("myModal").style.display = "none";
          });

          window.addEventListener("click", (e) => {
            const modal = document.getElementById("myModal");
            if (e.target === modal) {
              modal.style.display = "none";
            }
          });

          window.initializeFormHandler = async () => {
            const dropBox = document.getElementById("dropBox");
            const loadingOverlay = document.getElementById("loadingOverlay");

            dropBox.style.display = 'none';

            if (dropBox) {
              const token = dropBox.getAttribute("data-token");
              const idForm = dropBox.getAttribute("data-idform");
              const typeservice = dropBox.getAttribute("data-typeservice");

              window.registersData = null;

              const currentPath = window.location.pathname;
              const isPreview = currentPath.includes('/preview') || !idForm;
              
              let apiUrl;
              if (!idForm || idForm === 'default' || idForm === '') {
                  apiUrl = \`${BASE_URL_API}/forms/default -building\`;
                  // console.log('📍 Loading DEFAULT form');
                } else {
                  apiUrl = \`${BASE_URL_API}/forms/\${idForm}\`;
                  // console.log('📍 Loading SPECIFIC form:', idForm);
                }
                
              loadingBar.start();
              fetch(apiUrl, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: \`Bearer \${token}\`,
                  cypherKey: null,
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  const parsedData = JSON.parse(data.data.objects);
                  window.registersData = Array.isArray(parsedData.registers)
                    ? parsedData.registers
                    : [];
                    
                    /*console.log('window.registersData', window.registersData)
                    console.log('parsedData', parsedData)*/

                  const buttonRegisters = window.registersData.filter(
                    (item) => item.type === "button"
                  );

                  buttonRegisters.forEach((item) => {
                    const element = document.getElementById(item.id);

                    if (element) {
                      element.onclick = async () => {
                        const buttonData = buttonRegisters.find(
                          (btn) => btn.id === item.id
                        );
                        
                        // console.log("buttonData", buttonData);

                        if (buttonData) {
                          if (buttonData.path) {
                            window.open(buttonData.path, "_blank");
                            return;
                          }

                          if (buttonData.idForm) {
                            loadingBar.start();
                            
                            fetch(\`\${BASE_URL_API}/forms/\${buttonData.idForm}\`, {
                              method: "GET",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: \`Bearer \${token}\`,
                                cypherKey: null,
                              },
                            })
                              .then((response) => {
                                if (!response.ok) {
                                  throw new Error("Error receiving information");
                                }
                                return response.json();
                              })
                              .then((formData) => {
                                if (formData && formData.data && formData.data.content) {
                                  const parser = new DOMParser();
                                  const doc = parser.parseFromString(
                                    formData.data.content,
                                    "text/html"
                                  );
                                  const dragDropDiv = doc.querySelector(".dragdrop-container");
                                  
                                  if (dragDropDiv) {
                                    dragDropDiv.setAttribute('data-token', token);
                                    dragDropDiv.setAttribute('data-idform', buttonData.idForm);
                                    dragDropDiv.setAttribute('data-typeservice', typeservice || 'echo');
                                    dragDropDiv.id = 'dropBox';
                                  }
                                  
                                  const formContainer = document.querySelector("#form-container");

                                  if (buttonData.typeDisplay === "form") {
                                    if (dragDropDiv && formContainer) {
                                      formContainer.innerHTML = "";
                                      const clonedDiv = dragDropDiv.cloneNode(true);
                                      clonedDiv.removeAttribute('id');
                                      formContainer.appendChild(clonedDiv);
                                      
                                      setTimeout(() => {
                                        initializeFormHandler();
                                      }, 1);
                                    }
                                  } else if (buttonData.typeDisplay === "modal") {
                                    if (dragDropDiv) {
                                      openModal(dragDropDiv);
                                      
                                      setTimeout(() => {
                                        initializeFormHandler();
                                      }, 1);
                                    }
                                  }
                                }
                                loadingBar.complete();
                              })
                              .catch((error) => {
                                loadingBar.complete();
                                console.error(error);
                              });
                            return;
                          }
                          
                          loadingBar.start();

                      let currentValue = 0;
                        const registerData = window.updatedRegistersData.find(
                          (item) => item.id === buttonData.infoReqBtn.register_id
                        );
                        
                        /*console.log('registerData1111', registerData);
                        console.log('window.updatedRegistersData', window.updatedRegistersData);*/
                        
                        if (registerData) {
                          currentValue = Number(registerData.value);
                        }
                        
                        /*console.log('registerData', registerData);
                        console.log('currentValue', currentValue);*/
                        
                        if (buttonData.infoReqBtn?.singleIncrease) {
                          currentValue += 1;
                        } else if (buttonData.infoReqBtn?.singleReduction) {
                          currentValue -= 1;
                        } else if (buttonData.infoReqBtn?.value) {
                          currentValue = Number(buttonData.infoReqBtn.value);
                        }

                      const requestData = {
                        device_id: buttonData.infoReqBtn.device_uuid,
                        title: buttonData.infoReqBtn.title,
                        value: currentValue,
                      };
                      fetch(
                        \`${BASE_URL_API}/registers/\${buttonData.infoReqBtn.register_id} \`,
                        {
                          method: "PATCH",
                          headers: {
                            Authorization: \`Bearer \${token}\`,
                            "Content-Type": "application/json",
                            cypherKey: null,
                          },
                          body: JSON.stringify(requestData),
                        }
                      )
                        .then((response) => response.json())
                        .then((data) => {
                          Toastify({
                            text: data.message,
                            duration: 3000,
                            close: false,
                            gravity: "top",
                            position: "right",
                            style: {
                            background: "#3b82f6",
                            },
                          }).showToast();
                          
                          loadingBar.complete();

                        })
                        .catch((error) => {
                          loadingBar.complete();
                          console.error(error);
                        });
                    }
                  };
                } else {
                  console.warn(\`No element found in the DOM with ID \${item.id}\`);
                }
              });

            const textInputRegisters = window.registersData.filter(
              (item) => item.type === "text input"
            );
            
            const initializeTextInputs = async () => {
              for (const item of textInputRegisters) {
                const element = document.getElementById(item.id);
                
                const textInputData = textInputRegisters.find(
                  (textInput) => textInput.id === item.id
                );
                
                if (textInputData && textInputData.infoReqBtn?.register_id) {
                  try {
                    const response = await fetch(
                      \`${BASE_URL_API}/registers/\${textInputData.infoReqBtn.register_id}\`,
                      {
                        method: "GET",
                        headers: {
                          Authorization: \`Bearer \${token}\`,
                          "Content-Type": "application/json",
                          cypherKey: null,
                        },
                      }
                    );
                    
                    // console.log('response', response);
                    
                    if (response.ok) {
                      const data = await response.json();
                      
                      if (element) {
                        const pTag = element.querySelector("p");
                        if (pTag && data.data && data.data.value !== undefined) {
                          pTag.textContent = data.data.value;
                        }
                      }
                    }
                  } catch (error) {
                    console.error(\`Error fetching initial value for \${item.id}:\`, error);
                  }
                }
            
                if (element) {
                  element.onclick = () => {
                    if (textInputData) {
                      const pTag = element.querySelector("p");
            
                      if (pTag) {
                        const input = document.createElement("input");
                        input.type = "text";
                        input.value = pTag.textContent || "";
                        input.style.width = "80%";
                        input.style.height = "30px";
                        input.style.fontSize = "1rem";
                        input.style.border = "2px solid #3b82f6";
                        input.style.padding = "5px";
                        input.style.borderRadius = "3px";
                        input.style.textAlign = "center";
                        input.style.outline = "none";
            
                        pTag.replaceWith(input);
                        input.focus();
            
                        let hasHandledBlur = false;
            
                        const handleInputBlur = async () => {
                          if (hasHandledBlur) return;
                          hasHandledBlur = true;
            
                          if (input.parentNode && pTag) {
                            pTag.textContent = input.value;
                            input.replaceWith(pTag);
                          }
                          input.removeEventListener("blur", handleInputBlur);
                          input.removeEventListener("keypress", handleKeyPress);
            
                          const inputValue = input.value;
                          const numericValue = parseFloat(inputValue);
                          const start = parseFloat(textInputData.infoReqBtn.startRange);
                          const end = parseFloat(textInputData.infoReqBtn.endRange);
            
                          if (isNaN(numericValue)) {
                            Toastify({
                              text: "The entered value is not a number!",
                              duration: 3000,
                              close: false,
                              gravity: "top",
                              position: "right",
                              style: {
                                background: "#3b82f6",
                              },
                            }).showToast();
                            return;
                          }
            
                          if (numericValue < start || numericValue > end) {
                            Toastify({
                              text: \`The value must be between \${start} and \${end}.\`,
                              duration: 3000,
                              close: false,
                              gravity: "top",
                              position: "right",
                              style: {
                                background: "#3b82f6",
                              },
                            }).showToast();
                            return;
                          }
                          
                          loadingBar.start();
            
                          const data = {
                            device_id: textInputData.infoReqBtn.device_uuid,
                            title: textInputData.infoReqBtn.title,
                            value: inputValue,
                          };
                          try {
                            const response = await fetch(
                              \`${BASE_URL_API}/registers/\${textInputData.infoReqBtn.register_id}\`,
                              {
                                method: "PATCH",
                                headers: {
                                  Authorization: \`Bearer \${token}\`,
                                  "Content-Type": "application/json",
                                  cypherKey: null,
                                },
                                body: JSON.stringify(data),
                              }
                            );
            
                            if (!response.ok) {
                              throw new Error("Request failed");
                            }
            
                            const result = await response.json();
                            Toastify({
                              text: result.message,
                              duration: 3000,
                              close: false,
                              gravity: "top",
                              position: "right",
                              style: {
                                background: "#3b82f6",
                              },
                            }).showToast();
                            loadingBar.complete();
                          } catch (error) {
                            loadingBar.complete();
                            console.error(error);
                          }
                        };
            
                        const handleKeyPress = (e) => {
                          if (e.key === "Enter") {
                            handleInputBlur();
                          }
                        };
            
                        input.addEventListener("blur", handleInputBlur);
                        input.addEventListener("keypress", handleKeyPress);
                      }
                    }
                  };
                }
              }
            };
            
            initializeTextInputs();

              // create registrarId list
                const registersId = window.registersData
                  .map((item) => item.temp)
                  .filter((temp) => temp !== "");

                // console.log(registersId);

                if (registersId.length > 0) {
                  const updateElementData = (data, registerId) => {
                    if (data.type === "float") {
                      const elements = document.querySelectorAll('[data-idregister="' + registerId + '"]');
                      elements.forEach((element) => {
                        const idRegister = element.getAttribute("data-idregister");
                        const id = element.id;

                        const result = window.registersData?.find(
                          (index) => index.id == id
                        );

                        if (result) {
                          const decimalPlaces = result.decimalPlaces;

                          const formattedValue = parseFloat(data.value).toFixed(
                            decimalPlaces
                          );

                          const span = element.querySelector("span");
                          if (span) {
                            span.innerText = formattedValue;
                          }
                        }
                      });
                    } else if (data.type === "bool") {
                      const elements =
                        document.querySelectorAll('[data-idregister="' + registerId + '"]');
                      // console.log(elements);

                      elements.forEach((element) => {
                        const idRegister = element.getAttribute("data-idregister");

                        const id = element.id;

                        const result = window.registersData?.find(
                          (index) => index.id == id
                        );

                        if (result) {
                          if (data.value === true) {
                            element.style.backgroundColor =
                              result.backgroundColorBooleanTrue;

                            if (result.backgroundImageBooleanTrue) {
                              element.style.backgroundImage = \`url( \${result.backgroundImageBooleanTrue})\`;
                              element.style.backgroundSize = "cover";
                              element.style.backgroundPosition = "center";
                            } else {
                              element.style.backgroundImage = "none";
                            }
                          } else if (data.value === false) {
                            element.style.backgroundColor =
                              result.backgroundColorBooleanFalse;

                            if (result.backgroundImageBooleanFalse) {
                              element.style.backgroundImage = \`url( \${result.backgroundImageBooleanFalse})\`;
                              element.style.backgroundSize = "cover";
                              element.style.backgroundPosition = "center";
                            } else {
                              element.style.backgroundImage = "none";
                            }
                          }
                        }
                      });
                    } else if (data.type === "binary") {
                      const elements =
                        document.querySelectorAll('[data-idregister="' + registerId + '"]');

                      elements.forEach((element) => {
                        const id = element.id;

                        const result = window.registersData?.find(
                          (index) => index.id == id
                        );

                        if (result && data) {
                          const value =
                            typeof data.value === "string"
                              ? Number(data.value)
                              : data.value;

                          const binaryValue = value.toString(2);
                          const bit =
                            binaryValue[binaryValue.length - result.numberBits];

                          const shouldDisplay = !(
                            (bit === "1" && result.hideIfOne) ||
                            (bit === "0" && result.hideIfZero)
                          );

                          element.classList.toggle("hidden", !shouldDisplay);

                          const span = element.querySelector("span");
                          if (span) {
                            span.innerText = bit;

                            if (bit === "1") {
                              if (result.backgroundImageBinaryOne) {
                                element.style.backgroundImage = \`url(\${result.backgroundImageBinaryOne})\`;
                                element.style.backgroundSize = "cover";
                                element.style.backgroundColor = "transparent";
                              } else if (result.backgroundColorBinaryOne) {
                                element.style.backgroundColor =
                                  result.backgroundColorBinaryOne;
                                element.style.backgroundImage = "none";
                              }
                            } else {
                              if (result.backgroundImageBinaryZero) {
                                element.style.backgroundImage = \`url(\${result.backgroundImageBinaryZero})\`;
                                element.style.backgroundSize = "cover";
                                element.style.backgroundColor = "transparent";
                              } else if (result.backgroundColorBinaryZero) {
                                element.style.backgroundColor =
                                  result.backgroundColorBinaryZero;
                                element.style.backgroundImage = "none";
                              }
                            }
                          }
                        }
                      });
                    } else if (data.type === "int") {
                        const elements =
                        document.querySelectorAll('[data-idregister="' + registerId + '"]');
    
                      elements.forEach((element) => {
                        const id = element.id;
                        const result = window.registersData?.find(
                          (index) => index.id == id
                        );
    
                        if (result) {
                          const span = element.querySelector("span");
                          if (span) {
                            span.innerText = data.value;
                          }
    
                          if (result.FieldComparison) {
                            const fieldComparisonArray = Object.values(
                              result.FieldComparison
                            );
                            let shouldHideItem = false;
                            const value = parseFloat(data.value);
    
                            for (let condition of fieldComparisonArray) {
                              const conditionValue = parseFloat(condition.value);
                              let conditionMet = false;
    
                              switch (condition.key) {
                                case "bigger":
                                  conditionMet = value > conditionValue;
                                  break;
                                case "smaller":
                                  conditionMet = value < conditionValue;
                                  break;
                                case "equal":
                                  conditionMet = value === conditionValue;
                                  break;
                                case "GreaterThanOrEqual":
                                  conditionMet = value >= conditionValue;
                                  break;
                                case "LessThanOrEqual":
                                  conditionMet = value <= conditionValue;
                                  break;
                                default:
                                  conditionMet = false;
                              }
    
                              if (conditionMet) {
                                element.style.backgroundColor =
                                  condition.color;
                                element.style.backgroundImage = \`url(\${condition.bgImg})\`;
                                if (condition.visibility === true) {
                                  shouldHideItem = true;
                                }
                                break;
                              }
                            }
    
                            if (shouldHideItem) {
                              element.classList.add("hidden");
    
                            } else {
                              element.classList.remove("hidden");
    
                            }
                          }
                        }
                      });
                    } else if (data.type === "string") {
                      const elements =
                              document.querySelectorAll('[data-idregister="' + registerId + '"]');

                      elements.forEach((element) => {
                        const id = element.id;
                        const result = window.registersData?.find(
                                (index) => index.id == id
                        );

                        if (result) {
                          const span = element.querySelector("span");
                          if (span) {
                            span.innerText = data.value;
                          }
                        }
                      });
                    }
                  };

                  window.updatedRegistersData = [];

                  const updateRegisterData = (data) => {
                    const existingData = window.updatedRegistersData.find(
                      (item) => item.id === data.id
                    );

                    if (existingData) {
                      existingData.value = data.value;
                    } else {
                      window.updatedRegistersData.push(data);
                    }
                  };
                  
              let mqttClient = null;
              let publishIntervalId = null;

              if (typeservice === "echo") {
                  const LaravelEcho = window.Echo;
                  const echo = new LaravelEcho({
                    broadcaster: "${VITE_BROADCASTER}",
                    key: "${VITE_PUSHER_KEY}",
                    cluster: "${VITE_PUSHER_CLUSTER}",
                    wsHost: "${VITE_ECHO_HOST}",
                    forceTLS: ${VITE_ECHO_FORCE_TLS},
                    wsPort: ${VITE_ECHO_PORT_WS},`;
  if (VITE_ECHO_PORT_WSS.length)
    HTML_OUTPUT += `wssPort: ${VITE_ECHO_PORT_WSS},
        enabledTransports: ["ws", "wss"],`;
  else
    HTML_OUTPUT += `
        enabledTransports: ["ws"],`;

  if (VITE_ECHO_AUTH_ENDPOINT_WSS)
    HTML_OUTPUT += `
                        authEndpoint: "${VITE_ECHO_AUTH_ENDPOINT_WSS}",`;
  else
    HTML_OUTPUT += `
                    authEndpoint: "${VITE_ECHO_AUTH_ENDPOINT_WS}",`;
  HTML_OUTPUT += `
                        auth: {
                          headers: {
                        Authorization: \`Bearer \${token}\`,
                      },
                    },
                  });

                echo.connector.pusher.connection.bind("connected", function () {
                  // console.log("Echo connected");
                  loadingOverlay.style.display = "none";
                  dropBox.style.display = "flex";
                });

                registersId.forEach((id) => {
                  echo
                    .private(\`register.\${id}\`)
                    .listen("RegisterEvent", (data) => {
                      updateElementData(data, id);
                      updateRegisterData({ id: id, value: data.value });
                    });
                });
              } else if (typeservice === "mqtt") {
                  if (typeof mqtt === 'undefined') {
                    console.error('MQTT library is not loaded!');
                    
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/mqtt/dist/mqtt.min.js';
                    script.onload = () => {
                      console.log('MQTT library loaded, retrying connection...');
                      connectMQTT();
                    };
                    script.onerror = () => {
                      console.error('Failed to load MQTT library');
                      loadingOverlay.style.display = "none";
                      dropBox.style.display = "flex";
                    };
                    document.head.appendChild(script);
                    return;
                  }
                  
                  connectMQTT();
                }
                
                function connectMQTT() {
                  if (mqttClient) {
                    console.log("Disconnecting previous MQTT client...");
                    
                    if (publishIntervalId) {
                      clearInterval(publishIntervalId);
                      publishIntervalId = null;
                    }
                    
                    mqttClient.removeAllListeners();
                    
                    mqttClient.end(true); // true = force close
                    mqttClient = null;
                  }
                
                  try {
                    console.log("Creating new MQTT connection...");
                    
                    mqttClient = mqtt.connect("${BROKER_MQTT_URL}", {
                      username: "${BROKER_MQTT_USERNAME}",
                      password: "${BROKER_MQTT_PASSWORD}",
                      clientId: 'form_' + idForm + '_' + Math.random().toString(16).substr(2, 8),
                      clean: true,
                      reconnectPeriod: 5000,
                      connectTimeout: 30000
                    });
                
                    mqttClient.on("connect", () => {
                      console.log("✅ MQTT connected successfully");
                      loadingOverlay.style.display = "none";
                      dropBox.style.display = "flex";
                      
                      if (idForm) {
                        const payload = JSON.stringify({uuid: idForm});
                        
                        mqttClient.publish('watchers/form', payload, (err) => {
                          if (err) {
                            console.error("Failed to publish:", err);
                          } else {
                            console.log("Published formId to watchers/form:", payload);
                          }
                        });
                        
                        publishIntervalId = setInterval(() => {
                          if (mqttClient && mqttClient.connected) {
                            mqttClient.publish('watchers/form', payload, (err) => {
                              if (err) {
                                console.error("Failed to publish repeated:", err);
                              } else {
                                console.log("Published repeated formId");
                              }
                            });
                          }
                        }, API_ENDPOINTS.INTERVAL_VALUE);
                      }
                      
                      registersId.forEach((id) => {
                        const topic = \`registers/\${id}\`;
                        mqttClient.subscribe(topic, (err) => {
                          if (err) {
                            console.error(\`Failed to subscribe to \${topic}:\`, err);
                          } else {
                            console.log("✅ Subscribed to:", topic);
                          }
                        });
                      });
                    });
                
                    mqttClient.on("message", (topic, message) => {
                      try {
                        const data = JSON.parse(message.toString());
                        const id = topic.split("/")[1];
                        updateElementData(data, id);
                        updateRegisterData({ id, value: data.value });
                      } catch (err) {
                        console.error("MQTT message parse error:", err);
                      }
                    });
                    
                    mqttClient.on("error", (err) => {
                      console.error("❌ MQTT connection error:", err);
                      loadingOverlay.style.display = "none";
                      dropBox.style.display = "flex";
                    });
                    
                    mqttClient.on("disconnect", () => {
                      console.warn("⚠️ MQTT disconnected");
                    });
                    
                    mqttClient.on("offline", () => {
                      console.warn("⚠️ MQTT offline");
                    });
                    
                    mqttClient.on("close", () => {
                      console.log("🔌 MQTT connection closed");
                    });
                
                  } catch (error) {
                    console.error("❌ Failed to create MQTT client:", error);
                    console.error("Error details:", {
                      message: error.message,
                      stack: error.stack
                    });
                    loadingOverlay.style.display = "none";
                    dropBox.style.display = "flex";
                  }
                }
                
                window.addEventListener('beforeunload', () => {
                  if (mqttClient) {
                    if (publishIntervalId) {
                      clearInterval(publishIntervalId);
                    }
                    mqttClient.end(true);
                  }
                });
                } else {
                  console.info("No registers found.");
                  loadingOverlay.style.display = "none";
                  dropBox.style.display = "flex";
                }
                loadingBar.complete();
              })
              .catch((error) => {
                loadingBar.complete();
                console.error(error);
              });
          }
        };

        initializeFormHandler();
        </script>
      </body>
    </html>
  `;

  return HTML_OUTPUT;
};

export default FormHTML;
