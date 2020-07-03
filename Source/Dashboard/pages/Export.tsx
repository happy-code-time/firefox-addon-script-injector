import React, { Component } from 'react';

import * as FileSaver from 'file-saver';

import { getTranslations } from '../../Translations';

import addToStore from '../../Store/addToStore';

import customKey from '../../AppFiles/Functions/customKey';

class Export extends Component {

    public translations: {
        [key: string]: any
    };

    public state: {
        [key: string]: any
    };

    constructor(props) {
        super(props);
        this.translations = getTranslations();
    }

    /**
     * Export all scripts to json file
     */
    saveToFileJson() {
        //@ts-ignore
        browser.runtime.sendMessage({
            action: 'export',
        })
            .then(response => {

                try {
                    const blob = new Blob([JSON.stringify(response)], { type: "application/json;charset=utf-8" });
                    FileSaver.saveAs(blob, `Script_Injector_${customKey()}.json`);
                } catch (error) {
                    const blob = new Blob([`Error while creating JSON file. Error message: ${error}.`], { type: "application/json;charset=utf-8" });
                    FileSaver.saveAs(blob, `Script_Injector_${customKey()}.json`);
                    addToStore(`${this.translations.exportError}: ${error}`, -1);
                }
            })
            .catch(error => {
                addToStore(`${this.translations.exportError}: ${error}`, -1);
            })
    }

    render() {
        return (
            <div className="Export">
                <div
                    key={customKey()}
                    className={`single-box single-box-0`}
                    onClick={(e) => this.saveToFileJson()}
                >
                    <h1 className="h1-title">
                        {
                            this.translations.click_to_export
                        }
                    </h1>
                    <img alt='icon' src='../../Images/logo-512.png' />
                </div>
            </div>
        );
    }
}

export default Export;