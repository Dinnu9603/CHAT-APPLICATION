const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const usersList = document.getElementById('users-list');

// Get username when page loads
const username = prompt('Please enter your username:') || 'Anonymous';
socket.emit('user join', username);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', (data) => {
    const item = document.createElement('li');
    const isSent = data.userId === socket.id;
    item.className = `message ${isSent ? 'sent' : 'received'}`;
    
    item.innerHTML = `
        <div class="username">${data.username}</div>
        <div class="text">${data.text}</div>
        <div class="timestamp">${data.timestamp}</div>
    `;
    
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('user joined', (data) => {
    updateUsersList(data.users);
    const item = document.createElement('li');
    item.className = 'message system';
    item.textContent = `${data.username} joined the chat`;
    messages.appendChild(item);
});

socket.on('user left', (data) => {
    updateUsersList(data.users);
    const item = document.createElement('li');
    item.className = 'message system';
    item.textContent = `${data.username} left the chat`;
    messages.appendChild(item);
});

function updateUsersList(users) {
    usersList.innerHTML = users
        .map(user => `<li>${user}</li>`)
        .join('');
}