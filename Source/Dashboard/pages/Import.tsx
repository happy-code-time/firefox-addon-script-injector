import * as React from 'react';

import { getTranslations } from '../../Translations';

import addToStore from '../../Store/addToStore';

import ModuleFullScreenLoading from '../../AppFiles/Modules/ModuleFullScreenLoading';

import { addonRoot } from '../../AppFiles/Functions/addonPrefix';

class Import extends React.Component {
    
    public translations: {
        [ key: string ]: any
    };

    public state: {
        [ key: string ]: any
    };

    public dropRef: any;
    public dragCounter: number; 

    constructor(props) {
        super(props);
        this.handleFile = this.handleFile.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.handleDrop = this.handleDrop.bind(this);

        this.state = {
            data: '',
            showLoading: false,
            dragging: false
        };

        this.translations = getTranslations();
    }

    componentDidMount(){
        this.dragCounter = 0;
    }

    handleFile(file) {
        this.setState({
            showLoading: true
        }, () => {
            try {
                const reader = new FileReader();
                /**
                 * check availability of needs
                 */
                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    
                    if (!file.length) {
                        addToStore('Could not upload file: Empty file are not allowed.', -1);
                        return this.setState({ showLoading: false });
                    }
                    if (!file[0]) {
                        addToStore('Could not upload file: File not accessable.', -1);
                        return this.setState({ showLoading: false });
                    }
                    if (!file[0].name) {
                        addToStore('Could not upload file: Filename has to be not empty.', -1);
                        return this.setState({ showLoading: false });
                    }

                    /**
                     * all checks ok
                     */
                    file = file[0];
                    const self = this;

                    reader.addEventListener("load", async (e) => {

                        if (!e.target) {
                            addToStore('Could not upload file: File not accessable.', -1);
                            return this.setState({ showLoading: false });
                        }

                        if (!e.target.result) {
                            addToStore('Could not upload file: Empty file are not allowed.', -1);
                            return this.setState({ showLoading: false });
                        }

                        if (typeof "888" !== typeof e.target.result) {
                            addToStore('Could not upload file: Filetypes content are wrong.', -1);
                            return this.setState({ showLoading: false });
                        }

                        const importetData: any = e.target.result;
                                    
                        try {
                            const parsedData = JSON.parse(importetData);

                            if (typeof {} === typeof parsedData) {
                                /**
                                 * all checks passed, now go to the background scipt
                                 * and make the final import after decoding array
                                 */
                                //@ts-ignore
                                await browser.runtime
                                    .sendMessage({
                                        action: 'import',
                                        value: parsedData
                                    })
                                    .then(response => {
                                        if (response.error) {
                                            addToStore('Pleas don`t change the original file content. Download the original file and try again.', -1);
                                            return this.setState({ showLoading: false });
                                        }
                                        if (!response.error) {
                                            addToStore(`Imported ${response.count} scripts and ${response.settings} language setting.`, 0);
                                            return this.setState({ showLoading: false });
                                        }
                                    })
                                    .catch(error => {
                                        addToStore(`${this.translations.importError}: ${error}`, -1);
                                        return this.setState({ showLoading: false });
                                    });
                            } else {
                                addToStore('Pleas don`t change the original file content. Download the original file and try again.', -1);
                                return this.setState({ showLoading: false });
                            }
                        } catch (error) {
                            addToStore(`${this.translations.importError}: ${error}`, -1);
                            return this.setState({ showLoading: false });
                        }
                    });
                    reader.readAsBinaryString(file);
                } else {
                    addToStore('This browser version does not support file uploading.', -1);
                    return this.setState({ showLoading: false });
                }
            } catch (error) {
                addToStore(`${this.translations.importError}: ${error}`, -1);
                return this.setState({ showLoading: false });
            }
        });
    }

    onDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    onDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dragCounter++;

        if (e.dataTransfer.items && e.dataTransfer.items.length > 0 && !this.state.dragging) {
            this.setState({
                dragging: true
            });
        }
    }
    
    onDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dragCounter--;

        if(0 >= this.dragCounter){
            this.setState({
                dragging: false
            });
        }
    }
    
    handleDrop(e: any) {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.handleFile(e.dataTransfer.files);
            this.dragCounter = 0;
        }

        this.setState({
            dragging: false
        });
    }

    render() {
        const { dragging, showLoading } = this.state;

        return (
            <div className="Import">
                {
                    showLoading && 
                    <ModuleFullScreenLoading/>
                }
                <div 
                    className="upload-box"
                    onDragEnter={this.onDragEnter}
                    onDragLeave={this.onDragLeave}
                    onDragOver={this.onDragOver}
                    onDrop={this.handleDrop}
                >
                    {
                        dragging &&
                        <div className="drag-drop">
                            <img src={`${addonRoot()}/Images/abstract-4431599_1920.jpg`} alt="animation"/>
                        </div>
                    }
                    {
                        !dragging &&
                        <p>
                            {
                                this.translations.upload
                            }
                        </p>
                    }
                </div>
            </div>
        );
    }
}

export default Import;