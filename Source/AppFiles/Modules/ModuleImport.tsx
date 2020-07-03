import * as React from 'react';

import { getTranslations } from '../../Translations';

import addToStore from '../../Store/addToStore';

import ModuleFullScreenLoading from './ModuleFullScreenLoading';

import { addonRoot } from '../Functions/addonPrefix';

class ModuleImport extends React.Component {
    
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

    /**
     * Handle file upload
     */
    handleFile(files) {
        let messages = [];
        let errorMessage = undefined;
        let successMessage = undefined;

        this.setState({
            messages,
            showLoading: true
        }, () => {
            setTimeout( () => {
                try {
                    const reader = new FileReader();
                    /**
                     * check availability of needs
                     */
                    if (window.File && window.FileReader && window.FileList && window.Blob) {
                        let file = files[0];
    
                        if (!file.size) {
                            errorMessage = 'Empty file are not allowed.';
                        }
                        if (!file) {
                            errorMessage = 'Could not upload file: File not accessable.';
                        }
                        if (!file.name) {
                            errorMessage = 'Could not upload file: Filename has to be not empty.';
                        }
    
                        if('application/json' !== file.type){
                            errorMessage = 'Only previously exported ProtectX.json (settings and lists) file are allowed to import.';
                        }
    
                        /**
                         * All checks ok
                         * then process further
                         */
                        
                         reader.addEventListener("load", async (e) => {
    
                            if (!e.target) {
                                errorMessage = 'Could not upload file: Filecontent is not available.';
                            }

                            if (!e.target.result) {
                                errorMessage = 'Could not upload file: Filecontent is empty.';
                            }                            

                            if (typeof '888' !== typeof e.target.result) {
                                errorMessage = 'Could not upload file: Filecontent is not the original filecontent.';
                            }
    
                            if(errorMessage){
                                addToStore( errorMessage ,-1);
                
                                return this.setState({ 
                                    showLoading: false 
                                });
                            }
                    
                            let importetData: any = e.target.result;
                            try {
                                importetData = JSON.parse(importetData);

                                if (typeof {} === typeof importetData) {
                                    /**
                                     * all checks passed, now go to the background scipt
                                     * and make the final import after decoding array
                                     */
                                    //@ts-ignore
                                    await browser.runtime
                                        .sendMessage({
                                            action: 'import',
                                            value: importetData
                                        })
                                        .then(response => {      

                                            if (response.error) {
                                                errorMessage = 'Pleas don`t change the original file content. Download the original file and try again.';
                                            }

                                            if (!response.error) {
                                                successMessage = `Imported ${response.count} settings`;
                                            }

                                            if(errorMessage){
                                                addToStore( errorMessage ,-1);
                                
                                                return this.setState({ 
                                                    showLoading: false 
                                                });
                                            }
                                    
                                            if(successMessage){
                                                addToStore( successMessage , 0);
                                
                                                return this.setState({ 
                                                    showLoading: false 
                                                });
                                            }

                                        })
                                        .catch(error => {
                                            errorMessage =`General process error. Incorrect filetype.`;
                                            this.setState({ 
                                                showLoading: false 
                                            });
                                        });
                                } else {
                                    errorMessage = 'Could not upload file: Filecontent is not the original filecontent.';
                                }
                            } catch (error) {
                                errorMessage = 'Could not upload file: General error.';
                            }
                        });
    
                        reader.readAsBinaryString(file);
                    } else {
                        errorMessage = 'File uploading not available on this browser version.';
                    }
                } catch (error) {
                    errorMessage =`General process error. Incorrect filetype.`;
                }
    
                if(errorMessage){
                    addToStore( errorMessage ,-1);
    
                    this.setState({ 
                        showLoading: false 
                    });
                }
        
                if(successMessage){
                    addToStore( successMessage , 0);
    
                    this.setState({ 
                        showLoading: false 
                    });
                }
            }, 300);
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
                            <img src={`${addonRoot()}/logo/encore-clipart-ClipArt-Computer-BoyTyping-3Frames-107x98.gif`} alt="animation"/>
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

export default ModuleImport;