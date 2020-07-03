import * as React from 'react';

import { HashRouter, Switch, Route } from 'react-router-dom';

import ReactDOM from 'react-dom';

import ModuleSideBar from '../AppFiles/Modules/SideBar';

import Menu from '../AppFiles/Modules/Menu';

import Home from './pages/Home';

import Executed from './pages/Executed';

import WebsiteContainer from '../AppFiles/Modules/Modules/WebsiteContainer';

import ModulePopupBoxLinks from '../AppFiles/Modules/ModulePopupBoxLinks';

import GlobalMessages from '../AppFiles/Modules/Modules/GlobalMessages';

import AddonNotAvailable from '../AppFiles/Modules/AddonNotAvailable';

import ModuleLanguages from '../AppFiles/Modules/ModuleLanguages';

import { getTranslations } from '../Translations';

import { addonPrefixPopup, addonRoot, addonPrefixDashboard } from '../AppFiles/Functions/addonPrefix';

import { appNameShort, version } from '../AppFiles/Globals';

import '../Sass/popup/popup.scss';

class App extends React.Component {

  public translations: {
    [key: string]: any;
  };

  public state: {
    [key: string]: any;
  };

  constructor(props: {}) {
    super(props);
    this.checkAddonsAvailability = this.checkAddonsAvailability.bind(this);

    this.state = {
      documentWidth: 700,
      setValue_languageClicked: false,
      addonNotAvailable: false
    };

    this.translations = getTranslations();
  }

  componentDidMount() {
    this.checkAddonsAvailability();

    //@ts-ignore
    browser.runtime.sendMessage({
      action: 'get-app-language'
    })
      .then(applanguage => {
        localStorage.setItem('applanguage', applanguage);
      })
      .catch(() => {
        localStorage.setItem('applanguage', 'en');
      })
  }

  checkAddonsAvailability() {
    // @ts-ignore
    browser.runtime
      .sendMessage({
        action: 'check-addons-availablitity',
      })
      .then(response => {
        if (!response) {
          this.setState({
            addonNotAvailable: true
          });
        }
      })
      .catch(() => {
        this.setState({
          addonNotAvailable: true
        });
      });
  }

  render() {
    const { documentWidth, addonNotAvailable } = this.state;

    return (
      <div id="app-holder" style={{ width: `${documentWidth}px` }}>
        <WebsiteContainer
          persistUserSelection={false} // set local sotrage on click
          clearPersistUserSelection={true} // do not remove the local storage on component did mount
          sidebarMinifiedAt={600}
          sidebarMaxifiedAt={650}
          displayMinifyMaxifyIcon={false}
          moduleSidebar={
            <ModuleSideBar
              image={<img alt="image" src={`${addonRoot()}Images/logo-64.png`} />}
              textLong={appNameShort}
              textShort={`v${version}`}
              moduleMenu={
                <Menu
                  reactRouter={false}
                  childrenPaddingX={18}
                  data={
                    [
                      {
                        text: this.translations.header_1,
                        icon: <i className='far fa-folder-open' />,
                        href: `${addonPrefixPopup()}#/`,
                      },
                      {
                        text: this.translations.text_executed,
                        icon: <i className='fas fa-syringe' />,
                        href: `${addonPrefixPopup()}#/executed`,
                      }
                    ]
                  }
                />
              }
            />
          }
          headerData={
            <span>
              <ModulePopupBoxLinks
                location='popup'
                icon={<i className='fas fa-external-link-alt' />}
                titleBox={this.translations.links}

                masterLink={`${addonPrefixDashboard()}#/`}
                masterIcon={<i className='fas fa-angle-right' />}
                masterText={this.translations.footer_1}
                masterAttributes={
                  {
                    'target': '_blank',
                    'onClick': () => { setTimeout(() => { window.close() }, 100) }
                  }
                }

                data={
                  [
                    {
                      href: 'https://addons.mozilla.org/de/firefox/addon/x-script-injection/',
                      icon: <i className='fab fa-firefox-browser' />,
                      text: 'Firefox Hub',
                      attributes: {
                        'target': '_blank'
                      }
                    }
                  ]
                }
              />
              <ModuleLanguages/>
            </span>
          }
          contentData={
            <span>
              {
                addonNotAvailable && <AddonNotAvailable />
              }
              {
                !addonNotAvailable &&
                <HashRouter>
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/executed" component={Executed} />
                  </Switch>
                </HashRouter>
              }
            </span>
          }
        />
        <GlobalMessages
          messageKey='messagesApp'
          timer={1000}
          codeMapping={{
            '-1': {
              title: this.translations.error,
              displayErrorCode: false,
              text: {
                prefix: '',
                suffix: '',
                attributes: {},
              },
              close: {
                text: this.translations.globalErrormessageCloseButton,
                attributes: {},
              },
              link: {},
            },
            0: {
              title: <i className="fas fa-thumbs-up mr-2" />,
              displayErrorCode: false,
              text: {
                prefix: '',
                suffix: '',
                attributes: {},
              },
              close: {
                text: this.translations.globalErrormessageCloseButton,
                attributes: {},
              },
              link: {},
            },
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));