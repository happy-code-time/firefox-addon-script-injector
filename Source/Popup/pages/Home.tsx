import * as React from 'react';

import LoadingBoxTop from '../../AppFiles/Modules/LoadingBoxTop';

import { getTranslations } from '../../Translations';

import * as FileSaver from 'file-saver';

import addToStore from '../../Store/addToStore';

import copyToClipBoard from '../../AppFiles/Functions/copyToClipboard';

import { addonPrefixDashboard } from '../../AppFiles/Functions/addonPrefix';

import customKey from '../../AppFiles/Functions/customKey';

class Home extends React.Component {

    public translations: {
        [key: string]: any;
    };

    public state: {
        [key: string]: any;
    };

    constructor(props) {
        super(props);
        this.getSavedCodes = this.getSavedCodes.bind(this);
        this.closeMessages = this.closeMessages.bind(this);
        this.generateCodeJsx = this.generateCodeJsx.bind(this);
        this.executeCodeInAllTabs = this.executeCodeInAllTabs.bind(this);
        this.removeCode = this.removeCode.bind(this);
        this.executeSingleCode = this.executeSingleCode.bind(this);

        this.state = {
            showLoading: true,
            code: [],
            type: 'HTML',
            newCode: '',
            messages: [],
            data: '',
            appName: 'ScriptInjector_DavidJanitzek_',
            codeObject: {}
        };
        this.translations = getTranslations();
    }

    componentDidMount() {
        this.getSavedCodes();
    }

    getSavedCodes() {
        //@ts-ignore
        browser.runtime.sendMessage({
            action: 'get-saved-codes',
            showLoading: true
        })
            .then((response) => {

                if (undefined !== response) {
                    this.setState({
                        data: this.generateCodeJsx(response),
                        showLoading: false
                    });
                }

                else {
                    this.setState({
                        code: [],
                        showLoading: false
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    showLoading: false
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
                    addToStore('Code removed', 0);
                })
                .catch(error => {
                    this.setState({
                        showLoading: false
                    });
                    addToStore(error, -1);
                })
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
                    this.setState({
                        showLoading: false,
                    });
                    addToStore('Code executed for all tabs', 0);
                })
                .catch((error) => {
                    addToStore(error, -1);
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

    generateCodeJsx(scripts) {

        if (scripts && scripts.length) {

            return scripts.map(c => {
                const { type, name, runtime, data } = c;

                return (
                    <div key={customKey()} className="code-box-holder">
                        <h1>
                            {
                                name
                            }
                        </h1>
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
                                            this.translations.type
                                        }
                                    </div>
                                    <div className='value'>
                                        {
                                            type
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span className="buttons-holder flex">
                            <button className="execute" onClick={(e) => this.executeSingleCode(c)}>
                                {
                                    this.translations.msg_1
                                }
                            </button>
                            <button className="all-tabs" onClick={(e) => this.executeCodeInAllTabs(c)}>
                                {
                                    this.translations.msg_2
                                }
                            </button>
                        </span>
                        <span className="buttons-holder flex">
                            <button className="remove" onClick={(e) => this.removeCode(c)}>
                                {
                                    this.translations.msg_4
                                }
                            </button>
                        </span>
                        <div className="export-options flex flex-column">
                            <a
                                href={`${addonPrefixDashboard()}#/update?uuid=${c.uuid}`}
                                target='_blank'
                                onClick={() => { setTimeout(() => { window.close() }, 100) }}>
                                <i
                                    title={this.translations.title_1}
                                    className="fas fa-user-edit update"
                                ></i>
                            </a>
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
                        </div>
                    </div>
                );
            })
        }

        return (
            <div key={customKey()} className="no-code">
                <a
                    title={this.translations.title_5}
                    onClick={() => { setTimeout(() => { window.close(); }, 100); }}
                    target='_blank'
                    //@ts-ignore
                    href={`${browser.runtime.getURL('/Distribution/Dashboard/index.html')}#/new`}
                >
                    <h1 className="ff-title text-center">
                        {
                            this.translations.no_script_msg_3
                        }
                    </h1>
                    <img alt='icon' src='../../Images/logo-512.png' />
                </a>
            </div>
        );
    }

    closeMessages() {
        this.setState({
            messages: []
        });
    }

    executeSingleCode(object) {
        //@ts-ignore
        browser.runtime.sendMessage({ action: 'execute-code', code: object })
        .then( () => {
            addToStore('Code executed for single tabs', 0);
        })
        .catch( error => {
            addToStore(error, -1);
        })
    }

    render() {
        const { showLoading, data } = this.state;

        return (
            <div className="ContentBody">
                {
                    showLoading && <LoadingBoxTop />
                }
                <div className="content">
                    {
                        data
                    }
                </div>
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
        );
    }
}

export default Home;
