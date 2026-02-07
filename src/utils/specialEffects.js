import confetti from "canvas-confetti";

export function fireConfetti(){
    confetti({
        particleCount: 300,
        spread: 120,
        origin: { y: 0.6 },
    });
}