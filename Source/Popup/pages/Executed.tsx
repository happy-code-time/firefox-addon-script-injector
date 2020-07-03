import * as React from 'react';

import LoadingBoxTop from '../../AppFiles/Modules/LoadingBoxTop';

import { getTranslations } from '../../Translations';

import { addonPrefixDashboard } from '../../AppFiles/Functions/addonPrefix';

import customKey from '../../AppFiles/Functions/customKey';

class Executed extends React.Component {

    public translations: {
        [key: string]: any;
    };

    public state: {
        [key: string]: any;
    };

    constructor(props) {
        super(props);
        this.getExecutedCodes = this.getExecutedCodes.bind(this);
        this.generateCodeJsx = this.generateCodeJsx.bind(this);

        this.state = {
            showLoading: true,
            code: [],
            type: 'HTML',
            newCode: '',
            data: '',
            codeObject: {}
        };
        this.translations = getTranslations();
    }

    componentDidMount() {
        this.getExecutedCodes();
    }

    getExecutedCodes() {
        //@ts-ignore
        browser.runtime.sendMessage({
            action: 'get-executed-codes',
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
                        data: this.generateCodeJsx([]),
                        showLoading: false
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    data: this.generateCodeJsx([]),
                    showLoading: false
                });
            })
    }

    generateCodeJsx(scripts) {

        if (scripts && scripts.length) {

            scripts = scripts.reverse();

            return scripts.map(contentScriptsObject => {
                const { time, code } = contentScriptsObject;
                const { type, name, runtime, data } = code;

                const year = time.getFullYear();
                const month = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1);
                const day = time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()
                const hours = time.getHours() >= 10 ? time.getHours() : '0' + time.getHours()
                const minutes = (time.getMinutes() + 1) >= 10 ? (time.getMinutes() + 1) : '0' + (time.getMinutes());
                const seconds = (time.getSeconds() + 1) >= 10 ? (time.getSeconds() + 1) : '0' + (time.getSeconds());
                const generatedDay = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

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
                                            this.translations.type
                                        }
                                    </div>
                                    <div className='value'>
                                        {
                                            type
                                        }
                                    </div>
                                </div>
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
                                <div className='content flex'>
                                    <div className='text'>
                                        {
                                            this.translations.execution_time
                                        }
                                    </div>
                                    <div className='value'>
                                        {
                                            generatedDay
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="export-options flex flex-column">
                                <a
                                    href={`${addonPrefixDashboard()}#/update?uuid=${code.uuid}`}
                                    target='_blank'
                                    onClick={() => { setTimeout(() => { window.close() }, 100) }}>
                                    <i
                                        title={this.translations.title_1}
                                        className="fas fa-user-edit update"
                                    ></i>
                                </a>
                            </div>
                        </div>
                    </div>
                );
            })
        }

        return (
            <div key={customKey()} className="no-code">
                <h1 className="ff-title text-center">
                    {
                        this.translations.no_injections_yet
                    }
                </h1>
                <img alt='icon' src='../../Images/logo-512.png' />
            </div>
        );
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

    render() {
        const { showLoading, data } = this.state;

        if (showLoading) {
            return <LoadingBoxTop />;
        }

        return (
            <div className="ContentBody Executed">
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

export default Executed;
