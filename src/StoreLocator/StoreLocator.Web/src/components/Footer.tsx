import React, { useContext } from 'react';
import i18n from '../i18n';

export default function Footer() {
  const t = i18n.t.bind(i18n);

  return (
    <footer className="page-footer darken-4">
      <div className="container">
          <div className="row">
          <div className="col l6 s12">
              <h5 className="white-text">CoronaVirus days</h5>
              <p className="grey-text text-lighten-4">{t('footer.mainText')}</p>
          </div>
          <div className="col l3 s12">
            <h5 className="white-text">{t('footer.stores')}</h5>
              <ul>
                <li><a className="white-text" target="_blank" href="#">{t('footer.document.movementPermit')}</a></li>
                <li><a className="white-text" target="_blank" href="#">{t('footer.document.employeePermit')}</a></li>
              </ul>
          </div>
          <div className="col l3 s12">
              <h5 className="white-text">{t('footer.information')}</h5>
              <ul>
                <li><a className="white-text" target="_blank" href="#">{t('footer.faq')}</a></li>
                <li><a className="white-text" target="_blank" href="#">{t('footer.privacy')}</a></li>
              </ul>
          </div>
          </div>
      </div>
      <div className="footer-copyright">
          <div className="container">
            <div className="left">
              {i18n.language == 'el' ? t('footer.language.el') : <a href="/?lng=el" className="font-white">{t('footer.language.el')}</a>}<span>&nbsp;|&nbsp;</span>
              {i18n.language == 'en' ? t('footer.language.en') : <a href="/?lng=en" className="font-white">{t('footer.language.en')}</a>}
            </div>
            <div className="right">
              Hosted and powered by <a className="text-lighten-3" target="_blank" rel="noreferrer" href="https://azure.microsoft.com/en-us/">Microsoft Azure</a>
            </div>
          </div>
      </div>
    </footer>
  );
}