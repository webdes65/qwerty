const FormHTML = (container) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>DragDrop Content</title>
        <link href="https://fonts.cdnfonts.com/css/ds-digital" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/azeret-mono" rel="stylesheet" />
        <link
          href="https://fonts.cdnfonts.com/css/noto-serif-toto"
          rel="stylesheet"
        />
        <link
          href="https://fonts.cdnfonts.com/css/edu-sa-beginner"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
        <link
        href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"
        rel="stylesheet"
        />
        <script src="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pusher/7.2.0/pusher.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/laravel-echo/dist/echo.iife.js"></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.8/axios.min.js"
          integrity="sha512-v8+bPcpk4Sj7CKB11+gK/FnsbgQ15jTwZamnBf/xDmiQDcgOIYufBo6Acu1y30vrk8gg5su4x0CG3zfPaq5Fcg=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        ></script>
        <script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>
        <style>
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
          <div class="modal-content w-1/2 bg-white p-5 pb-14 rounded-lg">
            <div class="w-full h-auto flex flex-row justify-end items-center">
              <span
                class="close-btn w-auto h-auto flex flex-row justify-center items-center cursor-pointer text-[#333] text-4xl font-bold hover:text-red-500"
              >
                &times;
              </span>
            </div>
            <div id="modalBody"></div>
          </div>
        </div>
        <div id="form-container" class="h-screen w-full flex flex-row justify-center items-center">
          ${container.outerHTML}
        </div>
        <script type="module">

      const API_ENDPOINTS = {
        MQTT_URL: "ws://192.168.100.135:1882",
        USER_NAME: "BehinStart",
        PASSWORD: "Aa@123456",
      };

        const _0xabff89=_0xef07;function _0xef07(_0x31e12d,_0x4c1d52){const _0x2a938e=_0x2a93();return _0xef07=function(_0xef07ef,_0x3ea2f2){_0xef07ef=_0xef07ef-0x145;let _0xd86173=_0x2a938e[_0xef07ef];return _0xd86173;},_0xef07(_0x31e12d,_0x4c1d52);}(function(_0x123cd8,_0x5349c2){const _0x56f40d=_0xef07,_0x1b538e=_0x123cd8();while(!![]){try{const _0x961814=-parseInt(_0x56f40d(0x148))/0x1+-parseInt(_0x56f40d(0x146))/0x2+parseInt(_0x56f40d(0x14c))/0x3*(parseInt(_0x56f40d(0x147))/0x4)+-parseInt(_0x56f40d(0x14a))/0x5*(parseInt(_0x56f40d(0x149))/0x6)+-parseInt(_0x56f40d(0x14f))/0x7*(-parseInt(_0x56f40d(0x14d))/0x8)+-parseInt(_0x56f40d(0x145))/0x9+parseInt(_0x56f40d(0x14e))/0xa;if(_0x961814===_0x5349c2)break;else _0x1b538e['push'](_0x1b538e['shift']());}catch(_0x265d07){_0x1b538e['push'](_0x1b538e['shift']());}}}(_0x2a93,0x300f8));const REACT_APP_SALT=_0xabff89(0x14b);function _0x2a93(){const _0x405fc6=['rDv(Y5\x22H','71403RuCdUw','2872GhZfNO','10859980ukcjdt','497wMFlNk','2919033cDyKKb','534144XNqkAe','12uPOmvZ','49987jeNVFx','295404DgjfiP','35hZLpRX'];_0x2a93=function(){return _0x405fc6;};return _0x2a93();}

        const _0x34c08e=_0x1e94;(function(_0x3a34ef,_0xb3a918){const _0x378a48=_0x1e94,_0xdd0c71=_0x3a34ef();while(!![]){try{const _0x46195d=-parseInt(_0x378a48(0x70))/0x1+parseInt(_0x378a48(0x6b))/0x2+parseInt(_0x378a48(0x72))/0x3*(-parseInt(_0x378a48(0x6f))/0x4)+parseInt(_0x378a48(0x6c))/0x5+-parseInt(_0x378a48(0x6a))/0x6+parseInt(_0x378a48(0x6d))/0x7+-parseInt(_0x378a48(0x73))/0x8*(parseInt(_0x378a48(0x6e))/0x9);if(_0x46195d===_0xb3a918)break;else _0xdd0c71['push'](_0xdd0c71['shift']());}catch(_0x5ba124){_0xdd0c71['push'](_0xdd0c71['shift']());}}}(_0x573e,0x29ae9));function _0x1e94(_0x5d053d,_0x533942){const _0x573e23=_0x573e();return _0x1e94=function(_0x1e94de,_0x581d15){_0x1e94de=_0x1e94de-0x6a;let _0x1b96dd=_0x573e23[_0x1e94de];return _0x1b96dd;},_0x1e94(_0x5d053d,_0x533942);}const REACT_APP_PREFIX=_0x34c08e(0x71);function _0x573e(){const _0x26e081=['173332Buqemc','27810SmLvYQ','be@st','6OODArP','2547256qbJVHG','294780eYcUOY','68020zhBgrN','1497425hzMhjt','2234729zUFLJQ','9UvIqgk'];_0x573e=function(){return _0x26e081;};return _0x573e();};

        const _0x1e35b2=_0x45ce;(function(_0x17215c,_0x5970e7){const _0x2d325c=_0x45ce,_0xf09167=_0x17215c();while(!![]){try{const _0x144b06=parseInt(_0x2d325c(0xb2))/0x1+-parseInt(_0x2d325c(0xb3))/0x2*(parseInt(_0x2d325c(0xaf))/0x3)+parseInt(_0x2d325c(0xad))/0x4*(-parseInt(_0x2d325c(0xac))/0x5)+-parseInt(_0x2d325c(0xb0))/0x6*(-parseInt(_0x2d325c(0xb5))/0x7)+parseInt(_0x2d325c(0xab))/0x8+-parseInt(_0x2d325c(0xaa))/0x9*(-parseInt(_0x2d325c(0xb1))/0xa)+-parseInt(_0x2d325c(0xb4))/0xb;if(_0x144b06===_0x5970e7)break;else _0xf09167['push'](_0xf09167['shift']());}catch(_0x28cb56){_0xf09167['push'](_0xf09167['shift']());}}}(_0x4be5,0xd9898));function _0x4be5(){const _0x38ad76=['140228NAyBaS','22997480fSnqoi','217TdLlCi','52110gjaldF','6947480XhEpVN','5VloCoj','1922456GZccsG','hin!!rt','18YkrEFr','108564FgrFJr','1810koreyU','1405671UoEATC'];_0x4be5=function(){return _0x38ad76;};return _0x4be5();}function _0x45ce(_0x208796,_0x17ddba){const _0x4be5d9=_0x4be5();return _0x45ce=function(_0x45ceed,_0x4a3ba6){_0x45ceed=_0x45ceed-0xaa;let _0x29ff1a=_0x4be5d9[_0x45ceed];return _0x29ff1a;},_0x45ce(_0x208796,_0x17ddba);}const REACT_APP_SUFFIX=_0x1e35b2(0xae);

        const REACT_APP_ALLOWED_CHARS ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      async function getToken() {
        function generateTimestamp() {
          const now = new Date();
          now.setSeconds(0);
          now.setMilliseconds(0);
          const timestamp = Math.floor(now.getTime() / 1000);
          return timestamp;
        }

        async function consistentShuffle(str) {
          if (!str || str.length === 0) {
            return str;
          }
          return str.split("").reverse().join("");
        }

        async function stringResult(salt, timestamp) {
          const shuffle = await consistentShuffle(salt);
          return \`\${REACT_APP_PREFIX}\${shuffle}\${REACT_APP_SUFFIX}\${timestamp}\`;
        }

        async function sha256(value) {
          const encoder = new TextEncoder();
          const data = encoder.encode(value);
          const hashBuffer = await crypto.subtle.digest("SHA-256", data);
          return Array.from(new Uint8Array(hashBuffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        }

        async function multiHash(value, hashRounds, salt) {
          const shuffle = await consistentShuffle(salt);
          for (let i = 0; i < hashRounds; i++) {
            const dataToHash = value + shuffle.split("").reverse().join("") + i;
            value = await sha256(dataToHash);
            value = value.slice(0, 32);
          }
          return value;
        }

        async function transformString(input, salt) {
          const allowedChars = REACT_APP_ALLOWED_CHARS;
          let hash = await multiHash(input, 5, salt);
          let transformed = "";
          const desiredLength = 36;
          const rounds = 3;

          for (let round = 0; round < rounds; round++) {
            let roundHash = await multiHash(hash + round, 3, salt);
            for (let i = 0; transformed.length < desiredLength; i++) {
              const segment = roundHash.slice(i * 3, i * 3 + 3);
              const numericValue = parseInt(segment, 16) || 0;
              const index = (numericValue + i + round) % allowedChars.length;
              transformed += allowedChars[index];

              if (i * 3 + 3 >= roundHash.length) {
                roundHash = await multiHash(roundHash, 2, salt);
                i = -1;
              }
            }
            if (transformed.length >= desiredLength) {
              break;
            }
          }
          return transformed.substring(0, desiredLength);
        }

        const timestamp = generateTimestamp();
        const input = await stringResult(REACT_APP_SALT, timestamp);
        const token = await transformString(input, REACT_APP_SALT);

        return token;
      }
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

          const initializeFormHandler = async () => {
          const dropBox = document.getElementById("dropBox");
          const loadingOverlay = document.getElementById("loadingOverlay");

          dropBox.style.display = 'none';

          if (dropBox) {
            const token = dropBox.getAttribute("data-token");
            const idForm = dropBox.getAttribute("data-idform");
            const typeservice = dropBox.getAttribute("data-typeservice");

            window.registersData = null;
            const cypherKey = await getToken();

            fetch(\`https://api.bms.behinstart.ir/api/forms/\${idForm}\`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: \`Bearer \${token}\`,
                cypherKey: cypherKey,
              },
            })
              .then((response) => response.json())
              .then((data) => {
                const parsedData = JSON.parse(data.data.objects);
                window.registersData = Array.isArray(parsedData.registers)
                  ? parsedData.registers
                  : [];

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

                    if (buttonData) {
                      if (buttonData.path) {
                        window.open(buttonData.path, "_blank");
                        return;
                      }

                      if (buttonData.idForm) {
                      const cypherKey = await getToken();
                      fetch("https://api.bms.behinstart.ir/api/forms", {
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: \`Bearer \${token}\`,
                          cypherKey: cypherKey,
                        },
                      })
                        .then((response) => {
                          if (!response.ok) {
                            throw new Error("Error receiving information");
                          }
                          return response.json();
                        })
                        .then((data) => {
                          if (data && data.data.length > 0) {
                            const foundItem = data.data.find(
                              (item) => item.id === buttonData.idForm
                            );
                            if (foundItem) {
                              const parser = new DOMParser();
                              const doc = parser.parseFromString(
                                foundItem.content,
                                "text/html"
                              );
                              const dragDropDiv = doc.querySelector(
                                ".dragdrop-container"
                              );

                              const formContainer =
                                document.querySelector("#form-container");

                              if (buttonData.typeDisplay === "form") {
                                if (dragDropDiv && formContainer) {
                                  formContainer.innerHTML = "";
                                  formContainer.appendChild(
                                    dragDropDiv.cloneNode(true)
                                  );
                                  initializeFormHandler();
                                }
                              } else if (buttonData.typeDisplay === "modal") {
                                if (dragDropDiv) {
                                  openModal(dragDropDiv.cloneNode(true));
                                }
                              }
                            }
                          }
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                      return;
                    }

                      let currentValue = 0;
                      const registerData = window.updatedRegistersData.find(
                        (item) => item.id === buttonData.infoReqBtn.register_id
                      );

                      if (registerData) {
                        currentValue = registerData.value;
                      }

                      if (buttonData.infoReqBtn?.singleIncrease) {
                        currentValue += 1;
                      } else if (buttonData.infoReqBtn?.singleReduction) {
                        currentValue -= 1;
                      } else if (buttonData.infoReqBtn?.value) {
                        currentValue = buttonData.infoReqBtn.value;
                      }

                      const requestData = {
                        device_id: buttonData.infoReqBtn.device_Id,
                        title: buttonData.infoReqBtn.title,
                        value: currentValue,
                      };
                      const cypherKey = await getToken();
                      fetch(
                        \`https://api.bms.behinstart.ir/api/registers/ \${buttonData.infoReqBtn.register_id} \`,
                        {
                          method: "PATCH",
                          headers: {
                            Authorization: \`Bearer \${token}\`,
                            "Content-Type": "application/json",
                            cypherKey: cypherKey,
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

                        })
                        .catch((error) => {
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

            textInputRegisters.forEach((item) => {
              const element = document.getElementById(item.id);

              if (element) {
                element.onclick = () => {
                  const textInputData = textInputRegisters.find(
                    (textInput) => textInput.id === item.id
                  );

                  if (textInputData) {
                    const pTag = element.querySelector("p");

                    if (pTag) {
                      const input = document.createElement("input");
                      input.type = "text";
                      input.value = "";
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
                        const start = parseFloat(
                          textInputData.infoReqBtn.startRange
                        );
                        const end = parseFloat(
                          textInputData.infoReqBtn.endRange
                        );

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

                        const data = {
                          device_id: textInputData.infoReqBtn.device_Id,
                          title: textInputData.infoReqBtn.title,
                          value: inputValue,
                        };
                        const cypherKey = await getToken();
                        try {
                          const response = await fetch(
                            \`https://api.bms.behinstart.ir/api/registers/ \${textInputData.infoReqBtn.register_id}\`,
                            {
                              method: "PATCH",
                              headers: {
                                Authorization: \`Bearer \${token}\`,
                                "Content-Type": "application/json",
                                cypherKey: cypherKey,
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

                        } catch (error) {
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
            });

              // create registrarId list
                const registersId = window.registersData
                  .map((item) => item.temp)
                  .filter((temp) => temp !== "");

                if (registersId.length > 0) {
                  const updateElementData = (data) => {
                    if (data.type === "float") {
                      const elements =
                        document.querySelectorAll("[data-idregister]");
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
                        document.querySelectorAll("[data-idregister]");

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
                        document.querySelectorAll("[data-idregister]");

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
                    document.querySelectorAll("[data-idregister]");

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

              if (typeservice === "echo") {
                  const LaravelEcho = window.Echo;
                  const echo = new LaravelEcho({
                    broadcaster: "pusher",
                    key: "sv6gaswl6mrw8o0xw5vf",
                    cluster: "mt1",
                    wsHost: "bms.behinstart.ir",
                    wsPort: 443,
                    wssPort: 443,
                    forceTLS: true,
                    enabledTransports: ["ws", "wss"],
                    authEndpoint: "https://api.bms.behinstart.ir/broadcasting/auth",
                    auth: {
                      headers: {
                        Authorization: \`Bearer \${token}\`,
                      },
                    },
                  });

                echo.connector.pusher.connection.bind("connected", function () {
                  loadingOverlay.style.display = "none";
                  dropBox.style.display = "flex";
                });

                registersId.forEach((id) => {
                  echo
                    .private(\`register.\${id}\`)
                    .listen("RegisterEvent", (data) => {
                      updateElementData(data);
                      updateRegisterData({ id: id, value: data.value });
                    });
                });
              } else if (typeservice === "mqtt") {

                const client = mqtt.connect("wss://mqtt.metariom.com/ws", {
                  username: "BehinStart",
                  password: "Aa@123456",
                });

                // const client = mqtt.connect(API_ENDPOINTS.MQTT_URL, {
                //   username: API_ENDPOINTS.USER_NAME,
                //   password: API_ENDPOINTS.PASSWORD,
                // });

                client.on("connect", () => {
                  loadingOverlay.style.display = "none";
                  dropBox.style.display = "flex";

                  registersId.forEach((id) => {
                    const topic = \`registers/\${id}\`;
                    client.subscribe(topic);
                  });
                });

                client.on("message", (topic, message) => {

                  try {
                    const data = JSON.parse(message.toString());
                    const id = topic.split("/")[1];

                    updateElementData(data);
                    updateRegisterData({ id, value: data.value });
                  } catch (err) {
                    console.error("MQTT message parse error", err);
                  }
                });
              }
                } else {
                  console.error("No registers found.");
                  loadingOverlay.style.display = "none";
                  dropBox.style.display = "flex";
                }
              })
              .catch((error) => {
                console.error(error);
              });
          }
        };

        initializeFormHandler();
        </script>
      </body>
    </html>
  `;
};

export default FormHTML;
