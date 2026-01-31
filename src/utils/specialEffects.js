import confetti from "canvas-confetti";

export function fireConfetti(){
    confetti({
        particleCount: 300,
        spread: 120,
        origin: { y: 0.6 },
    });
}

export function doomMode(){
      document.body.classList.add("doom-mode");
      
      const warning = document.createElement("div");
      warning.textContent = "☠️ REALLY?";
      warning.className = "doom-warning";
      document.body.appendChild(warning);

      setTimeout(() => {
        document.body.classList.remove("doom-mode");
        warning.remove();
      }, 3000);
}