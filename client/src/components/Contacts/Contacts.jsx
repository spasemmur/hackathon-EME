import React from "react";
import './Contacts.css';

function Contacts() {
  const developers = [
    {
      name: "Максим",
      role: "Backend-разработчик",
      linkVK: "https://vk.com/",
      linkGitHub:"https://github.com/",
      email: "example@mail.domen",
      color: "#e8b86d"
    },
    {
      name: "Егор",
      role: "Full-stack разработчик",
      linkVK:"https://vk.com/",
      linkGitHub:"https://github.com/",
      email: "example@mail.domen",
      color: "#496856"
    },
    {
      name: "Ева",
      role: "Frontend-разработчик",
      linkVK:"https://vk.com/",
      linkGitHub:"https://github.com/",
      email: "example@mail.domen",
      color: "#f5c0bb"
    }
  ];

  return (
    <div className="paper-page about-page">
      <div className="paper-card about-card torn-edge">
        <div className="tape tape-top-center"></div>
        <div className="paper-crease"></div>

        <h2 className="paper-title">Контакты</h2>

        <div className="developers-grid">
          {developers.map((dev) => (
            <div
              key={dev.name}
              className="developer-card soft-shadow"
              style={{ backgroundColor: dev.color, position: 'relative' }}
            >
              <h4 className="dev-name">{dev.name}</h4>
              <p className="dev-role">{dev.role}</p>
              <div className="dev-socials">
                <a href={dev.linkVK} target="_blank" rel="noopener noreferrer" className="social-link" title="ВКонтакте">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.785 16.241s.288-.032.435-.194c.135-.148.13-.427.13-.427s-.018-1.302.576-1.496c.586-.192 1.338 1.28 2.136 1.838c.603.422 1.062.33 1.062.33l2.137-.03s1.117-.068.588-.95c-.043-.072-.308-.656-1.588-1.84c-1.34-1.24-1.16-1.04.453-3.15c.983-1.282 1.376-2.06 1.253-2.398c-.117-.32-.84-.236-.84-.236l-2.405.015s-.178-.025-.31.056c-.13.079-.213.263-.213.263s-.382 1.03-.89 1.905c-1.07 1.85-1.498 1.948-1.674 1.834c-.408-.267-.306-1.07-.306-1.645c0-1.788.267-2.53-.52-2.723c-.262-.065-.454-.107-1.123-.114c-.858-.009-1.58.003-1.988.207c-.273.136-.484.44-.355.457c.158.022.516.098.706.36c.246.338.237 1.097.237 1.097s.142 2.093-.33 2.352c-.325.178-.77-.185-1.725-1.84c-.489-.85-.859-1.794-.859-1.794s-.07-.176-.197-.27c-.153-.112-.368-.148-.368-.148l-2.286.015s-.343.01-.47.162c-.112.136-.009.417-.009.417s1.79 4.258 3.817 6.404c1.858 1.967 3.968 1.838 3.968 1.838h.956z"/>
                  </svg>
                </a>
                
                <a href={dev.linkGitHub} target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
                
                <a href={dev.email} className="social-link" title="Написать на почту">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contacts;