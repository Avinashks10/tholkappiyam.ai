document.oncontextmenu = () => false;
document.onkeydown = (e) => {
  if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
    e.preventDefault();
    alert("Inspect Element is disabled for this page.");
  }
  if(e.ctrlKey && e.key === "u") {
    e.preventDefault();
    alert("Viewing source code is disabled for this page.");
  }
  if (e.ctrlKey && e.key === "c") {
    e.preventDefault();
    alert("Copying content is disabled for this page.");
  }
  if (e.ctrlKey && e.key === "v") {
    e.preventDefault();
    alert("Pasting content is disabled for this page.");
  }
}

function sendMessage() {
  const userInput = document.getElementById("userInput").value;
  if (!userInput) return;

  appendMessage("You", userInput);
  fetchAnswer(userInput);
  document.getElementById("userInput").value = "";
}

function autoAsk(question) {
  document.getElementById("userInput").value = question;
  sendMessage();
}

function appendMessage(sender, message) {
  const chatbox = document.getElementById("chatbox");
  const msgDiv = document.createElement("div");
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatbox.appendChild(msgDiv);
}

function fetchAnswer(question) {
  
  setTimeout(() => {
    appendMessage("Tholkappiyam AI", "This is an explanation based on Tholkappiyam for your query: \"" + question + "\".");
  }, 1000);
}
function sendMessage() {
  const userInput = document.getElementById("userInput").value;
  if (!userInput) return;

  appendMessage("You", userInput);
  fetchGPTAnswer(userInput);
  document.getElementById("userInput").value = "";
}

function autoAsk(question) {
  document.getElementById("userInput").value = question;
  sendMessage();
}

function appendMessage(sender, message) {
  const chatbox = document.getElementById("chatbox");
  const msgDiv = document.createElement("div");
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatbox.appendChild(msgDiv);
}

async function fetchGPTAnswer(question) {
  appendMessage("Tholkappiyam AI", "Typing...");

  try {
    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await response.json();
    appendMessage("Tholkappiyam AI", data.answer);
  } catch (error) {
    console.error(error);
    appendMessage("Tholkappiyam AI", "Sorry, something went wrong while fetching the answer.");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const chatbox = document.getElementById("chatbox");

  function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatbox.appendChild(msgDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  sendBtn.addEventListener("click", () => {
    const question = inputField.value.trim();
    if (!question) return;

    appendMessage("You", question);
    inputField.value = "";

    fetch("/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    })
      .then(res => res.json())
      .then(data => {
        appendMessage("Tholkappiyam AI", data.answer || "No response.");
      })
      .catch(err => {
        appendMessage("Tholkappiyam AI", "❌ Server error.");
        console.error(err);
      });
  });

  // Also trigger send on pressing Enter
  inputField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendBtn.click();
    }
  });
});

