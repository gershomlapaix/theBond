let handleMemberJoined = async (MemberId) => {
  addMemberToDom(MemberId);

  let members = await channel.getMembers();
  updateMemberTotal(members);

  const { name } = await rtmClient.getUserAttributesByKeys(MemberId, ["name"]);

  addBotMessageToDOm(`Welcome to he room ${name}! 👋`);
};

let addMemberToDom = async (MemberId) => {
  const { name } = await rtmClient.getUserAttributesByKeys(MemberId, ["name"]);

  let membersWrapepr = document.getElementById("member__list");

  let memberItem = ` <div class="member__wrapper" id="member__${MemberId}__wrapper">
    <span class="green__icon"></span>
    <p class="member_name">${name}</p>`;

  membersWrapepr.insertAdjacentHTML("beforeend", memberItem);
};

let updateMemberTotal = async (members) => {
  let total = document.getElementById("members__count");
  total.innerText = members.length;
};

let handleMemberLeft = async (MemberId) => {
  removeMemberFromDom(MemberId);

  let members = await channel.getMembers();
  updateMemberTotal(members);
};

let removeMemberFromDom = async (MemberId) => {
  let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`);
  let name = memberWrapper.getElementsByClassName("member_name")[0].textContent;
  memberWrapper.remove();

  addBotMessageToDOm(`${name} has left the room`);
};

let getMembers = async () => {
  let members = await channel.getMembers();

  updateMemberTotal(members); // on the first load

  for (let i = 0; i < members.length; i++) {
    addMemberToDom(members[i]);
  }
};

let handleChannelMessage = async (messageData, MemberId) => {
  console.log("new message......");

  let data = JSON.parse(messageData.text);

  if (data.type === "chat") {
    addMessageToDOm(data.displayName, data.message);
  }
};

// sending messages
let sendMessage = async (e) => {
  e.preventDefault();

  let message = e.target.message.value;

  channel.sendMessage({
    text: JSON.stringify({
      type: "chat",
      message: message,
      displayName: displayName,
    }),
  });

  addMessageToDOm(displayName, message);

  e.target.reset();
};

let addMessageToDOm = async (name, message) => {
  let messageWrapper = document.getElementById("messages");

  let newMessage = `
    <div class="message__wrapper">
    <div class="message__body">
        <strong class="message__author">${name}</strong>
        <p class="message__text">${message}</p>
    </div>
</div>
    `;

  messageWrapper.insertAdjacentHTML("beforeend", newMessage);

  let lastMessage = document.querySelector(
    "#messages .message__wrapper:last-child"
  );

  if (lastMessage) {
    lastMessage.scrollIntoView();
  }
};

let addBotMessageToDOm = async (botMessge) => {
  let messageWrapper = document.getElementById("messages");

  let newMessage = `
  <div class="message__wrapper">
  <div class="message__body__bot">
      <strong class="message__author__bot">🤖 <span>for<span style="font-size: 20px;">Each</span></span> Bot</strong>
      <p class="message__text__bot">${botMessge}</p>
  </div>
</div>  
      `;

  messageWrapper.insertAdjacentHTML("beforeend", newMessage);

  let lastMessage = document.querySelector(
    "#messages .message__wrapper:last-child"
  );

  if (lastMessage) {
    lastMessage.scrollIntoView();
  }
};

let leaveChannel = async () => {
  await channel.leave();
  await rtmClient.logout();
};

window.addEventListener("beforeunload", leaveChannel);
let messageForm = document.getElementById("message__form");
messageForm.addEventListener("submit", sendMessage);
