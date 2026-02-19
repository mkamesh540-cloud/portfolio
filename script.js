/* ============================= */
/*  SCROLL FRAME ANIMATION       */
/* ============================= */

const frameCount = 240;
const canvas = document.getElementById("scrollCanvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const currentFrame = index => 
  `frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

const images = [];
const img = new Image();

for (let i = 1; i <= frameCount; i++) {
  const image = new Image();
  image.src = currentFrame(i);
  images.push(image);
}

img.src = currentFrame(1);
img.onload = function () {
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
};

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil((scrollTop / maxScrollTop) * frameCount)
  );

  requestAnimationFrame(() => {
    context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
  });
});

/* ============================= */
/*        CHATBOT WIDGET         */
/* ============================= */

const API_KEY = "YOUR_GEMINI_API_KEY";

const SYSTEM_PROMPT = `
You are a resume assistant chatbot.
STRICT RULES:
1. Answer ONLY using the resume content provided below.
2. If information is not in resume, say: "This information is not available in the resume."
3. Do not add extra knowledge.
4. Be professional and concise.

Resume Content:
Name: KAMESHWARAN M
Degree: B.E ECE (2023-2027)
College: Government College of Engineering Tirunelveli
CGPA: 7.9
Skills: Digital & Analog Electronics, C, Python, Arduino, MATLAB, Proteus
Languages: English, Tamil
HSC: 90%
Phone: 9361887323
Email: mkamesh540@gmail.com
Location: Karaikudi
`;

async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBody = document.getElementById("chatBody");
  const userText = input.value;

  if (!userText) return;

  chatBody.innerHTML += `<p><strong>You:</strong> ${userText}</p>`;
  input.value = "";

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT + "\nUser Question: " + userText }]
          }
        ]
      })
    }
  );

  const data = await response.json();
  const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error";

  chatBody.innerHTML += `<p><strong>Bot:</strong> ${botReply}</p>`;
  chatBody.scrollTop = chatBody.scrollHeight;
}
