import React, { Component } from 'react';

import { HashRouter, Switch, Route } from 'react-router-dom';

import ReactDOM from 'react-dom';

import Redirection from '../AppFiles/Functions/redirect/Redirection';

import ModuleSideBar from '../AppFiles/Modules/SideBar';

import Menu from '../AppFiles/Modules/Menu';

import All from './pages/All';

import NewScript from './pages/NewScript';

import Update from './pages/Update';

import Import from './pages/Import';

import Export from './pages/Export';

import WebsiteContainer from '../AppFiles/Modules/Modules/WebsiteContainer';

import GlobalMessages from '../AppFiles/Modules/Modules/GlobalMessages';

import ModulePopupBoxLinks from '../AppFiles/Modules/ModulePopupBoxLinks';

import { appNameShort, version } from '../AppFiles/Globals';

import { getTranslations } from '../Translations';

import { addonRoot, addonPrefixDashboard } from '../AppFiles/Functions/addonPrefix';

import getCurrentLoggedInUser from '../AppFiles/Functions/getCurrentLoggedInUser';

import ModuleLanguages from '../AppFiles/Modules/ModuleLanguages';

import '../Sass/dashboard/index.scss';

class App extends Component {
  public Redirection: {
    [key: string]: any;
  };

  public state: {
    [key: string]: any;
  };

  public translations: {
    [key: string]: any;
  };

  public globalMessagesIntervaller: any;
  public env?: string;
  public remoteHost?: string;
  public currentUser?: string;
  public currentUserHash?: string;
  public nodeSideBar: Node;
  public isRegular: boolean;
  public isResponsive: boolean;
  public redirectAfterLogin: string;

  constructor(props: {}) {
    super(props);

    this.state = {
      globalErrors: [],
      notLoggedInErrors: [],
      successMessage: [],
      errorMessagesApp: [],
      minifiedSecondSideBar: true,
      setValue_languageClicked: false,
    };

    this.Redirection = new Redirection();
    this.translations = getTranslations();
    this.env = process.env.ENV;
    this.remoteHost = process.env.REMOTE_HOST;
    this.currentUser = getCurrentLoggedInUser(true);
    this.currentUserHash = getCurrentLoggedInUser();
  }

  componentDidMount() {
    this.Redirection.redirect();
  }

  render() {
    return (
      <div className="Main block">
        <WebsiteContainer
          persistUserSelection={false} // set local sotrage on click
          clearPersistUserSelection={true} // do not remove the local storage on component did mount
          sidebarMinifiedAt={720}
          sidebarMaxifiedAt={1024}
          displayMinifyMaxifyIcon={true}
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
                        href: `${addonPrefixDashboard()}#/`,
                      },
                      {
                        text: this.translations.header_2,
                        icon: <i className='fas fa-laptop-code' />,
                        href: `${addonPrefixDashboard()}#/new`,
                      },
                      {
                        text: this.translations.header_3,
                        icon: <i className='fas fa-cloud-upload-alt' />,
                        href: `${addonPrefixDashboard()}#/import`,
                      },
                      {
                        text: this.translations.header_4,
                        icon: <i className='fas fa-cloud-download-alt' />,
                        href: `${addonPrefixDashboard()}#/export`,
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
                icon={<i className='fas fa-external-link-alt'/>}
                titleBox={this.translations.links}
                
                masterLink={`${addonPrefixDashboard()}#/`}
                masterIcon={<i className='fas fa-angle-right'/>}
                masterText={this.translations.footer_1}
                masterAttributes={
                  {
                    'target': '_blank'
                  }
                }

                data={
                  [
                    {
                      href: 'https://addons.mozilla.org/de/firefox/addon/x-script-injection/',
                      icon: <i className='fab fa-firefox-browser'/>,
                      text: 'Firefox Hub',
                      attributes:{
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
            <HashRouter>
              <Switch>
                <Route exact path="/" component={All} />
                <Route exact path='/new' component={NewScript} />
                <Route exact path='/update' component={Update} />
                <Route exact path='/import' component={Import} />
                <Route exact path='/export' component={Export} />
              </Switch>
            </HashRouter>
          }
        />
        <GlobalMessages
          messageKey='messagesApp'
          timer={2000}
          codeMapping={{
            '-2': {
              title: this.translations.notLoggedIn,
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
            1: {
              title: this.translations.code,
              displayErrorCode: true,
              text: {
                prefix: this.translations.globalErrormessagePrefix,
                suffix: '',
                attributes: {},
              },
              close: {
                text: this.translations.globalErrormessageCloseButton,
                attributes: {},
              },
              link: {
                text: this.translations.globalErrormessageLearnMoreButton,
                useTagLink: false,
                href: `${addonPrefixDashboard()}#error-messages-learn-more`,
                attributes: {
                  target: '_blank',
                },
              },
            },
            2: {
              title: this.translations.code,
              displayErrorCode: true,
              text: {
                prefix: this.translations.globalErrormessagePrefix,
                suffix: '',
                attributes: {},
              },
              close: {
                text: this.translations.globalErrormessageCloseButton,
                attributes: {},
              },
              link: {
                text: this.translations.globalErrormessageLearnMoreButton,
                useTagLink: false,
                href: `${addonPrefixDashboard()}#error-messages-learn-more`,
                attributes: {
                  target: '_blank',
                },
              },
            },
            3: {
              title: this.translations.code,
              displayErrorCode: true,
              text: {
                prefix: this.translations.globalErrormessagePrefix,
                suffix: '',
                attributes: {},
              },
              close: {
                text: this.translations.globalErrormessageCloseButton,
                attributes: {},
              },
              link: {
                text: this.translations.globalErrormessageLearnMoreButton,
                useTagLink: false,
                href: `${addonPrefixDashboard()}#error-messages-learn-more`,
                attributes: {
                  target: '_blank',
                },
              },
            },
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
