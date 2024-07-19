
// let username;
// const userNameApi =async ()=>{
//     try {
//         const response = await fetch('/userName');
//         if (!response.ok) {
//           throw new Error('Failed to fetch user name');
//         }
//         const data = await response.json();
//         return data
//       } catch (error) {
//         console.error(error);
//       }
      
// }

// userNameApi().then((data) => {

// const socket = io()
// const names = data.userName;
// let textarea =  document.getElementById('inputText')
// let messageArea =  document.querySelector('.message-right')
// let incoming =  document.querySelector('.message-left')
// const submitBtn =  document.querySelector('.button-send')
// const chatRoom = document.querySelector('.main-chat-room')


// // textarea.addEventListener('keyup',(e)=>{
// //     if(e.key.toLowerCase() === "enter"){
// //         sendMessage(e.target.value)
// //         textarea.value =""
// //     }
// // })

// // submitBtn.addEventListener('click',()=>{
// //     sendMessage(textarea.value)
// //     textarea.value =""
// // })


// function sendMessage(message){
//     if(!message){
//     alert('can"t be send empty message')
//     return;
//     }
//     const msg ={
//         name :names,
//         message :message.trim()
//     }
//     console.log(msg)
//     appendMessage(msg,'outgoing')
//     textarea.value =""
//     scrollToBottom()
//     //send to server
//     socket.emit('message',msg)

// }

// function appendMessage(msg,type){
//     const messageElement = document.createElement('div');
//     messageElement.innerHTML = `
//     <div class="message message-right ${type}">
//     <small class="small">${msg.name}</small>
//     <div class="bubble bubble-light">
//      ${msg.message}
//     </div>
//     </div>
//     `
//     chatRoom.appendChild(messageElement)
// }
// // incoming
// // this is client code
// socket.on('message',(e)=>{
//     const messageElement = document.createElement('div');
//     messageElement.innerHTML = `
//     <div class="message message-left incoming">
//     <small class="small">${e.name}</small>
//     <div class="bubble bubble-light">
//     ${e.message}
//     </div>
//   </div>
//     `
//     chatRoom.appendChild(messageElement)
//     scrollToBottom()
// })

// function scrollToBottom(){
//     chatRoom.scrollTop = chatRoom.scrollHeight
// }
// });