import * as React from 'react';

import { Link } from 'react-router-dom';

import WebsiteContainer from '../../AppFiles/Modules/WebsiteContainer';

import LoadingBoxTop from '../../AppFiles/Modules/LoadingBoxTop';

import ModuleSourceCode from '../../AppFiles/Modules/ModuleSourceCode';

import ModuleNoFilteredData from '../../AppFiles/Modules/ModuleNoFilteredData';

import ToTopRocket from '../../AppFiles/Modules/Modules/ToTopRocket';

import FullScreenListObjects from '../../AppFiles/Modules/FullScreenListObjects';

import { getTranslations } from '../../Translations';

import customKey from '../../AppFiles/Functions/customKey';

import * as FileSaver from 'file-saver';

import addToStore from '../../Store/addToStore';

import copyToClipBoard from '../../AppFiles/Functions/copyToClipboard';

class All extends React.Component {

  public currentMenuEntry: number;

  public imagesChart: string;

  public translations: {
    [key: string]: any
  };

  public state: {
    [key: string]: any
  };

  constructor(props: {}) {
    super(props);
    this.getSavedCodes = this.getSavedCodes.bind(this);
    this.executeSingleCode = this.executeSingleCode.bind(this);
    this.executeCodeInAllTabs = this.executeCodeInAllTabs.bind(this);
    this.removeCode = this.removeCode.bind(this);
    this.getCurrentActiveTabs = this.getCurrentActiveTabs.bind(this);
    this.toggleList = this.toggleList.bind(this);

    this.state = {
      showLoading: true,
      code: [],
      type: 'HTML',
      messages: [],
      tabs: [],
      appName: 'ScriptInjector_DavidJanitzek_',
      displayValueTab: [],
      layout: this.getLayout(),
      layoutBoxes: this.getLayoutBoxes()
    };

    this.currentMenuEntry = 0;
    this.imagesChart = `${customKey()}`;
    this.translations = getTranslations();
  }

  componentDidMount() {
    this.getSavedCodes();
  }

  getLayoutBoxes() {
    const allowedBoxes = ['box'];
    const box = localStorage.getItem('box');

    if (!box || !allowedBoxes.includes(box)) {
      localStorage.setItem('box', '');
      return '';
    }

    return box;
  }

  toggleLayoutBoxes() {
    const box = localStorage.getItem('box');

    if ('' == box) {
      localStorage.setItem('box', 'box');
      return this.setState({ layoutBoxes: 'box' });
    }

    localStorage.setItem('box', '');
    return this.setState({ layoutBoxes: '' });
  }

  getLayout() {
    const allowedTints = ['light', 'dark'];
    const tint = localStorage.getItem('tint');

    if (!tint || !allowedTints.includes(tint)) {
      localStorage.setItem('tint', 'light');
      return 'light';
    }

    return tint;
  }

  toggleTint() {
    const tint = localStorage.getItem('tint');

    if ('dark' == tint) {
      localStorage.setItem('tint', 'light');
      return this.setState({ layout: 'light' });
    }

    localStorage.setItem('tint', 'dark');
    return this.setState({ layout: 'dark' });
  }

  async getSavedCodes() {
    const displayValueTab = [];

    //@ts-ignore
    const code = await browser.runtime.sendMessage({
      action: 'get-saved-codes',
    })
      .then(response => {

        if (!response || (response && 0 == response.length)) {
          addToStore(this.translations.noScripts, -1);
          return [];
        }

        return response;
      })
      .catch(error => {
        addToStore(`${this.translations.globalProcessError}`, 1);
        return [];
      });

    //@ts-ignore
    const tabs = await browser.runtime.sendMessage({
      action: 'get-all-tabs',
    })
      .then(response => response)
      .catch(error => {
        addToStore(`${this.translations.globalProcessError}`, 1);
        return [];
      });

    code.map((c, i) => {
      displayValueTab[i] = false
    });

    this.setState({
      showLoading: false,
      tabs,
      code,
      displayValueTab
    });
  }

  dupplicateCode(codeObject) {
    this.setState({
      showLoading: true
    }, () => {
      //@ts-ignore
      browser.runtime.sendMessage({
        action: 'dupplicate-code',
        data: codeObject
      })
        .then(() => {
          this.getSavedCodes();
        })
        .catch(error => {
          this.setState({
            messages: [{
              type: 'error',
              msg: `${error}`
            }],
            showLoading: false
          });
        })
    });
  }

  toggleList(loopIndex: number = null) {
    const { code, displayValueTab } = this.state;

    code.map((c, i) => {
      if (i == loopIndex) {
        displayValueTab[loopIndex] = !displayValueTab[loopIndex]
      }
      else {
        displayValueTab[i] = false
      }
    });

    this.setState({
      displayValueTab
    });
  }

  executeSingleCode(e, object, callbackCustomData) {
    const { code, displayValueTab } = this.state;

    code.map((c, i) => {
      displayValueTab[i] = false
    });

    this.setState({
      showLoading: true,
      displayValueTab
    }, () => {
      //@ts-ignore
      browser.runtime.sendMessage({
        action: 'execute-code-custom-tab',
        code: callbackCustomData,
        id: object.value
      })
        .then(() => {
          addToStore(`Code executed for tab id: ${object.value}`, 0);
          this.setState({
            showLoading: false,
          });
        })
        .catch((error) => {
          addToStore(`${error}`, -1);
          this.setState({ showLoading: false });
        });
    })
  }

  removeCode(object) {
    this.setState({
      showLoading: true
    }, () => {
      //@ts-ignore
      browser.runtime.sendMessage({
        action: 'remove-code',
        data: object,
      })
        .then(() => {
          this.getSavedCodes();
        })
        .catch(error => {
          addToStore(error, -1);
          this.setState({ showLoading: false });
        });
    });
  }

  executeCodeInAllTabs(codeObject) {
    this.setState({
      showLoading: true
    }, () => {
      //@ts-ignore
      browser.runtime.sendMessage({
        action: 'execute-code-all-tabs',
        code: codeObject
      })
        .then(() => {
          addToStore('Code executed for all tabs', 0);
          this.setState({ showLoading: false });
        })
        .catch((error) => {
          addToStore(error, -1);
          this.setState({ showLoading: false });
        });
    })
  }

  saveToFileJsonSingle(code) {
    const { appName } = this.state;

    if (code.length) {
      try {
        var blob = new Blob([JSON.stringify(code)], { type: "application/json;charset=utf-8" });
        FileSaver.saveAs(blob, `${appName}${customKey()}.json`);
      } catch (error) {
        var blob = new Blob([`Error while creating JSON file. Error message: ${error}.`], { type: "application/json;charset=utf-8" });
        FileSaver.saveAs(blob, `${appName}${customKey()}.json`);
        addToStore(`Error while creating JSON file. Error message: ${error}.`, -1);
      }
    }
    else {
      addToStore('Selected or filtered code cannot be empty.', -1);
    }
  }

  saveToFileJsonSingleRaw(code) {
    const { appName } = this.state;

    if (code.length) {
      try {
        var blob = new Blob([code], { type: "application/json;charset=utf-8" });
        FileSaver.saveAs(blob, `${appName}${customKey()}.json`);
      } catch (error) {
        var blob = new Blob([`Error while creating RAW JSON file. Error message: ${error}.`], { type: "application/json;charset=utf-8" });
        FileSaver.saveAs(blob, `${appName}${customKey()}.json`);
        addToStore(`Error while creating RAW JSON file. Error message: ${error}.`, -1);
      }
    }
    else {
      addToStore('Selected or filtered code cannot be empty.', -1);
    }
  }

  saveToTxtFile(code) {
    const { appName } = this.state;

    if (code.length) {
      try {
        var blob = new Blob([code], { type: "application/txt;charset=utf-8" });
        FileSaver.saveAs(blob, `${appName}${customKey()}.txt`);
      } catch (error) {
        var blob = new Blob([`Error while creating TXT file. Error message: ${error}.`], { type: "application/txt;charset=utf-8" });
        FileSaver.saveAs(blob, `${appName}${customKey()}.txt`);
        addToStore(`Error while creating TXT file. Error message: ${error}.`, -1);
      }
    }
    else {
      addToStore('Selected or filtered code cannot be empty.', -1);
    }
  }

  getCurrentActiveTabs() {
    const { tabs } = this.state;
    const data = [];

    tabs.map(tab => {
      if (-1 !== tab.url.indexOf('http')) {
        data.push(
          {
            text: `${this.translations.click_to_exec} - [tab: ${tab.id}] ${tab.url}`,
            value: tab.id
          }
        );
      }
    });

    return data;
  }

  getRuntime(runtime = '') {
    switch (runtime) {
      case 'interactive': {
        return `Interactive - ${this.translations.interactive}`;
      }
      case 'complete': {
        return `Complete - ${this.translations.loaded}`;
      }
      case 'timeout01': {
        return `Timeout - ${this.translations.timeout}: 0.1`;
      }
      case 'timeout02': {
        return `Timeout - ${this.translations.timeout}: 0.2`;
      }
      case 'timeout03': {
        return `Timeout - ${this.translations.timeout}: 0.3`;
      }
      case 'timeout04': {
        return `Timeout - ${this.translations.timeout}: 0.4`;
      }
      case 'timeout05': {
        return `Timeout - ${this.translations.timeout}: 0.5`;
      }
      case 'timeout1': {
        return `Timeout - ${this.translations.timeout}: 1`;
      }
      case 'timeout2': {
        return `Timeout - ${this.translations.timeout}: 2`;
      }
      case 'timeout3': {
        return `Timeout - ${this.translations.timeout}: 3`;
      }
      case 'timeout4': {
        return `Timeout - ${this.translations.timeout}: 4`;
      }
      case 'timeout5': {
        return `Timeout - ${this.translations.timeout}: 5`;
      }
      case 'timeout10': {
        return `Timeout - ${this.translations.timeout}: 10`;
      }
      case 'timeout20': {
        return `Timeout - ${this.translations.timeout}: 20`;
      }
      case 'timeout30': {
        return `Timeout - ${this.translations.timeout}: 30`;
      }
      case 'timeout40': {
        return `Timeout - ${this.translations.timeout}: 40`;
      }
      case 'timeout50': {
        return `Timeout - ${this.translations.timeout}: 50`;
      }
      case 'timeout60': {
        return `Timeout - ${this.translations.timeout}: 60`;
      }
      default: {
        return this.translations.manually;
      }
    }
  }

  render(): JSX.Element {
    const { showLoading, code, layoutBoxes, layout, displayValueTab } = this.state;

    return (
      <WebsiteContainer
        contentData={
          (
            <div className={layoutBoxes ? 'Home HomeBoxes' : 'Home'}>
              {
                showLoading && <LoadingBoxTop />
              }
              {
                0 !== code.length &&
                <div className="actions-all">
                  <i className="fas fa-th-large toggle-layout" title={this.translations.changeCodeStyleBox} onClick={() => this.toggleLayoutBoxes()}></i>
                </div>
              }
              {
                0 !== code.length &&
                code.map((c, loopIndex) => {
                  let { type, name, data, runtime, attributes } = c;

                  const changeExportFiles = (e, searchvalue, c) => {
                    data = c;
                  };

                  return (
                    <div key={customKey()} className="code-box-holder flex flex-column">
                      <FullScreenListObjects
                        display={displayValueTab[loopIndex]}
                        callback={this.executeSingleCode}
                        callbackData={c}
                        iconClose="✖"
                        callbackClose={this.toggleList}
                        closeOnCallback={true}
                        closeOnDimmedClick={true}
                        closeOnEsc={true}
                        inputActive={true}
                        inputPlaceholder={'https://domain.com ....'}
                        noDataText={'🤯'}
                        animation='top' // scale, top, right, bottom, left
                        data={this.getCurrentActiveTabs()}
                      />
                      <h1>
                        {`${name} (${type})`}
                        <i className="fas fa-power-off" title={this.translations.dashboard_msg_2} onClick={(e) => this.executeCodeInAllTabs(c)}></i>
                        <i className="fas fa-syringe" title={this.translations.dashboard_msg_2} onClick={(e) => this.toggleList(loopIndex)} />
                      </h1>
                      <div className='code-box' key={customKey()}>
                        <ModuleSourceCode
                          /*
                          * Code
                          */
                          displayLineNumber={true}
                          code={data}
                          layout={layout}
                          /*
                          * Input 
                          */
                          inputActive={true}
                          inputPlaceholder={this.translations.codeSearch}
                          inputCallback={changeExportFiles}
                          /*
                          * Loading
                          */
                          displayLoading={true}
                          inputNoDataText={<ModuleNoFilteredData />}
                        />
                        <div className="export-options flex flex-column">
                          <Link to={`/update?uuid=${c.uuid}`}>
                            <i
                              title={this.translations.title_1}
                              className="fas fa-user-edit update"
                            ></i>
                          </Link>
                          <i
                            title={this.translations.title_2}
                            className="fas fa-object-ungroup dupplicate"
                            onClick={(e) => this.dupplicateCode(c)}>
                          </i>
                          <i title="Export to txt file" onClick={(e) => { this.saveToTxtFile(data) }} className="fas fa-superscript"></i>
                          {
                            document.queryCommandSupported &&
                            <i
                              title="Copy to clipboard"
                              className="fas fa-paste"
                              onClick={(e) => copyToClipBoard(e, data, document.documentElement.scrollTop)}
                            ></i>
                          }
                          <i title="Export to stringified json file" onClick={(e) => { this.saveToFileJsonSingle(data) }} className="fas fa-clipboard"></i>
                          <i title="Export to raw json file" onClick={(e) => { this.saveToFileJsonSingleRaw(data) }} className="fas fa-file-signature"></i>
                          <i
                            title={this.translations.title_3}
                            className="fas fa-trash-alt trash"
                            onClick={(e) => this.removeCode(c)}>
                          </i>
                          <i
                            title={this.translations.changeCodeTint}
                            className="fas fa-tint"
                            onClick={(e) => this.toggleTint()}>
                          </i>
                        </div>
                      </div>
                      <div className='analyser'>
                        <div className='box'>
                          <div className='content flex'>
                            <div className='text'>
                              {
                                this.translations.runtime
                              }
                            </div>
                            <div className='value'>
                              {
                                runtime ? this.getRuntime(runtime) : this.translations.manually
                              }
                            </div>
                          </div>
                        </div>
                        <div className='box'>
                          <div className='content flex'>
                            <div className='text'>
                              {
                                this.translations.attr
                              }
                            </div>
                            <div className='value'>
                              {
                                attributes && 0 !== attributes.length &&
                                attributes.map((attributeObject: { name: string, value: string }, index) => {
                                  return (
                                    <span key={customKey()} className="single-attribute">
                                      {`${attributeObject.name}="${attributeObject.value}" ${index !== attributes.length - 1 ? `   |    ` : ''}`}
                                    </span>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
              {
                0 === this.state.code.length &&
                <div key={customKey()} className="no-code">
                  <Link title={this.translations.title_5} to='/new'>
                    <h1>
                      {
                        this.translations.no_script_msg_2
                      }
                    </h1>
                    <img alt='icon' src='../../Images/logo-512.png' />
                  </Link>
                </div>
              }
              <ToTopRocket />
              <form style={{
                display: 'none !important',
                opacity: 0,
                position: 'absolute',
                width: 0,
                height: 0,
                overflow: 'hidden'
              }}>
                <textarea
                  id="copy-to-clipboard"
                  value=''
                  readOnly={true}
                />
              </form>
            </div>
          )
        }
      />
    );
  }
}

export default All;
