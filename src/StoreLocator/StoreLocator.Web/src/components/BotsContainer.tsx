import React, { useEffect } from 'react';

export default function BotsContainer(props: {}) {

  useEffect(() => {
    const elements = document.querySelectorAll('.container-bots .tooltipped');
    M.Tooltip.init(elements, { position: 'left' });
  });

  const openBotPopup = () => {
    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=500,height=600,left=500,top=300`;
    window.open('https://webchat.botframework.com/embed/grcovid19bot?s=rLLYUcsoKS8.qLYi4Tu2oxPKgsrTgTe4soIBnuoHdYv32Qlkuzacha0', 'bot', params);
    return false;
  }

  return (
    <div className="container-bots">
      <a href="#" onClick={openBotPopup} rel="noopener" className="tooltipped" data-tooltip="Chat Bot (popup)">
        <img src="https://dev.botframework.com/client/images/channels/icons/webchat.png" alt="Web chatbot icon" />
      </a>
      <a href='https://join.skype.com/bot/e73ea68e-77c5-4f1a-b64f-b08edb67454c' target="_blank" rel="noopener noreferrer" className="tooltipped" data-tooltip="Open in Skype">
        <img src='https://dev.botframework.com/client/images/channels/icons/skype.png' alt="Skype icon" />
      </a>
      <a href='https://teams.microsoft.com/l/chat/0/0?users=28:e73ea68e-77c5-4f1a-b64f-b08edb67454c' target="_blank" rel="noopener noreferrer" className="tooltipped" data-tooltip="Open in Teams">
        <img src='https://dev.botframework.com/client/images/channels/icons/msteams.png' alt="Teams icon" />
      </a>
    </div>
  );
}