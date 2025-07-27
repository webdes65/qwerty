import { CURRENT_VERSION } from "../version";

export function setupInstallPrompt() {
  let deferredPrompt;

  // If the app is already installed, the BeforeinstallPrompt event will not be implemented

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;

    const observer = new MutationObserver((mutationsList, observer) => {
      const installModal = document.getElementById("installModal");
      const modalOverlay = document.getElementById("modalOverlay");

      if (installModal && modalOverlay) {
        observer.disconnect();

        installModal.style.display = "block";
        modalOverlay.style.display = "block";

        installModal.style.animation =
          "install-slide-down 0.5s ease-out forwards";
        modalOverlay.style.animation = "fadeIn 0.5s ease-out forwards";

        const installBtn = document.getElementById("installBtn");
        const closeModal = document.getElementById("closeModal");

        if (installBtn) {
          installBtn.addEventListener("click", () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
              if (choiceResult.outcome === "accepted") {
                // console.log("User accepted the prompt");
                localStorage.setItem("app_version", CURRENT_VERSION);
              }
              // else {
              //   console.log("User dismissed the prompt");
              // }

              installModal.style.animation =
                "install-slide-up 0.5s ease-in forwards";
              modalOverlay.style.animation = "fadeOut 0.5s ease-in forwards";

              setTimeout(() => {
                installModal.style.display = "none";
                modalOverlay.style.display = "none";
              }, 500);
              deferredPrompt = null;
            });
          });
        }

        if (closeModal) {
          closeModal.addEventListener("click", () => {
            installModal.style.animation =
              "install-slide-up 0.5s ease-in forwards";
            modalOverlay.style.animation = "fadeOut 0.5s ease-in forwards";

            setTimeout(() => {
              installModal.style.display = "none";
              modalOverlay.style.display = "none";
            }, 500);
          });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}
