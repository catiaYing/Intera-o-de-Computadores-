
const messages = document.querySelector(".messages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

// 滚动到最新消息
function scrollToLatestMessage() {
    messages.scrollTop = messages.scrollHeight;
}

// 页面打开时显示最新消息
window.addEventListener("load", scrollToLatestMessage);

// 发送消息
messageForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = messageInput.value.trim();

    if (!text) return;

    const message = document.createElement("div");
    message.className = "message sent";

    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    const time = document.createElement("span");
    time.textContent = new Date().toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit"
    });

    message.appendChild(paragraph);
    message.appendChild(time);

    messages.appendChild(message);

    messageInput.value = "";

    // 新消息出现后自动滚动到底部
    requestAnimationFrame(scrollToLatestMessage);
});
