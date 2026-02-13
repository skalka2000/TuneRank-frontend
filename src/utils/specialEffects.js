import confetti from "canvas-confetti";

export function fireConfetti(){
    confetti({
        particleCount: 300,
        spread: 120,
        origin: { y: 0.6 },
    });
}

export function showSuccessCheckmark(duration = 1200) {
    const check = document.createElement("div");

    check.innerText = "✔";
    check.style.position = "fixed";
    check.style.top = "50%";
    check.style.left = "50%";
    check.style.transform = "translate(-50%, -50%) scale(0.5)";
    check.style.fontSize = "120px";
    check.style.color = "#22c55e"; // clean green
    check.style.fontWeight = "bold";
    check.style.zIndex = "9999";
    check.style.opacity = "0";
    check.style.transition = "all 0.3s ease";

    document.body.appendChild(check);

    // Trigger animation
    requestAnimationFrame(() => {
        check.style.opacity = "1";
        check.style.transform = "translate(-50%, -50%) scale(1)";
    });

    // Remove after duration
    setTimeout(() => {
        check.style.opacity = "0";
        check.style.transform = "translate(-50%, -50%) scale(0.8)";
        setTimeout(() => {
            document.body.removeChild(check);
        }, 300);
    }, duration);
}

export function showErrorX(duration = 1200) {
    const x = document.createElement("div");

    x.innerText = "✖";
    x.style.position = "fixed";
    x.style.top = "50%";
    x.style.left = "50%";
    x.style.transform = "translate(-50%, -50%) scale(0.5)";
    x.style.fontSize = "120px";
    x.style.color = "#ef4444"; // solid red
    x.style.fontWeight = "bold";
    x.style.zIndex = "9999";
    x.style.opacity = "0";
    x.style.transition = "all 0.3s ease";

    document.body.appendChild(x);

    requestAnimationFrame(() => {
        x.style.opacity = "1";
        x.style.transform = "translate(-50%, -50%) scale(1)";
    });

    setTimeout(() => {
        x.style.opacity = "0";
        x.style.transform = "translate(-50%, -50%) scale(0.8)";
        setTimeout(() => {
            document.body.removeChild(x);
        }, 300);
    }, duration);
}

