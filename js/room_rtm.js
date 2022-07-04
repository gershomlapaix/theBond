let handleMemberJoined = async (MemberId) => {
  addMemberToDom(MemberId);
};

let addMemberToDom = async (MemberId) => {
  const { name } = await rtmClient.getUserAttributesByKeys(MemberId, ["name"]);

  let membersWrapepr = document.getElementById("member__list");

  let memberItem = ` <div class="member__wrapper" id="member__${MemberId}__wrapper">
    <span class="green__icon"></span>
    <p class="member_name">${name}</p>`;

  membersWrapepr.insertAdjacentHTML("beforeend", memberItem);
};

let updateMemberTotal = async()=>{}

let handleMemberLeft = async (MemberId) => {
  removeMemberFromDom(MemberId);
};

let removeMemberFromDom = async (MemberId) => {
  let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`);
  memberWrapper.remove();
};

let getMembers = async () => {
  let members = await channel.getMembers();

  for (let i = 0; i < members.length; i++) {
    addMemberToDom(members[i]);
  }
};

let leaveChannel = async () => {
  await channel.leave();
  await rtmClient.logout();
};

window.addEventListener("beforeunload", leaveChannel);
