/**
 * Geet item from the local storage
 * @param {string} item 
 */
const getItem = (item) => {
    return JSON.parse(localStorage.getItem(item));
}

/**
 * Set item to the local storage
 * @param {string} name 
 * @param {any} value 
 */
const setItemToLocalStorage = (name, value) => {
    try {
        localStorage.setItem(name, JSON.stringify(value));
    } catch (error) {
        localStorage.clear();
        localStorage.setItem(name, JSON.stringify(value));
    }
}

if (null == getItem('SAVED_CODE')) {
    setItemToLocalStorage('SAVED_CODE', []);
}

/**
 * Get users current active tab
 */
const getTab = () => {
    return browser.tabs.query({
        currentWindow: true, active: true
    })
        .then(function (data) {
            return data
        })
        .catch(function (error) {
            return false;
        });
};

/**
 * Get only domain name
 * @param {string} url 
 */
const getOnlyDomainName = (url) => {
    if (url) {
        return url.split('/')[2];
    }
    return '';
};

/**
 * Background listener
 */
const onCreated = (tab) => {
    console.debug("Created new tab: " + tab.id);
}
const onError = (error) => {
    console.debug(error);
}

/**
 * Generate unique key
 */
const customKey = () => {
    return Math.floor((Math.random() * 123456789) + 1) + '9' +
        Math.floor((Math.random() * 123456789) + 1) + '1' +
        Math.floor((Math.random() * 123456789) + 1) + '8' +
        Math.floor((Math.random() * 123456789) + 1);
};

if (null == localStorage.getItem('applanguage')) {
    localStorage.setItem('applanguage', 'en');
}

const EXTENSIONS_NOT_AVAILABLE = '⛔';
var injectedCodes = {};
var updateToolbarInterval;

clearInterval(updateToolbarInterval);

updateToolbarInterval = setInterval( () => {
    updateToolbarIcon();
}, 2000);

const updateToolbarIcon = () => {
    getTab()
        .then(tabData => {
            const tab = tabData[0];
            const { id, url } = tab;

            /**
             * Addon is off
             */
            if (-1 === url.indexOf('http')) {
                browser.browserAction.setBadgeBackgroundColor({ tabId: id, color: 'rgb(69,69,69)' });
                browser.browserAction.setBadgeText({ tabId: id, text: EXTENSIONS_NOT_AVAILABLE });
                return;
            }

            const count = getCount(tabData);

            if(count){
                browser.browserAction.setBadgeBackgroundColor({ tabId: id, color: 'rgb(69,69,69)' });
                return browser.browserAction.setBadgeText({ tabId: id, text: JSON.stringify(count) });
            }

            browser.browserAction.setBadgeText({ tabId: id, text: '' });
        })
        .catch(error => {
            browser.browserAction.setBadgeText({ tabId: id, text: '' });
        });
}

const setCount = (sender) => {
    const { tab } = sender;

    if(tab){
        const { id } = tab;

        if (undefined == injectedCodes[id]) {
            return injectedCodes[id] = 1;
        }
    
        injectedCodes[id] += 1;
    }
};

const getCount = (tabData) => {
    const tab = tabData[0];
    const { id } = tab;

    if (undefined == injectedCodes[id]) {
        return null;
    }

    return injectedCodes[id];
};

const resetCount = (sender) => {
    const { tab } = sender;

    if(tab){
        const { id } = tab;
        injectedCodes[id] = 0;
    }
};

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'code-has-been-executed': {
            setCount(sender);
            updateToolbarIcon();
            return sendResponse(true);
            break;
        }
        case 'get-executed-codes': {
            return sendResponse(
                new Promise(resolve => {
                    getTab()
                        .then(async (activeTab) => {
                            const { id } = activeTab[0];

                            //@ts-ignore
                            await browser.tabs.sendMessage(id, {
                                action: 'get-executed-codes',
                            })
                                .then(response => {
                                    resolve(response);
                                })
                                .catch(() => {
                                    resolve([]);
                                });
                        })
                        .catch(() => {
                            resolve([]);
                        });
                })
            );
            break;
        }
        case 'open-new-tab': {
            const { url } = request;
            // @ts-ignore
            browser.tabs.create({
                url
            }, onCreated, onError);
            return sendResponse(true);
            break;
        }
        case 'check-addons-availablitity': {
            return sendResponse(
                new Promise(resolve => {
                    getTab()
                        .then(async (activeTab) => {
                            const { id } = activeTab[0];

                            //@ts-ignore
                            await browser.tabs.sendMessage(id, {
                                action: 'check-addons-availablitity',
                            })
                                .then(() => {
                                    resolve(true);
                                })
                                .catch(() => {
                                    resolve(false);
                                });
                        })
                        .catch(() => {
                            resolve(false);
                        });
                })
            );
            break;
        }
        case 'import': {
            try {
                let count = 0;
                let settings = 0;
                if (request.value) {
                    /**
                     * finally decoded object keys
                     * start import to local storage
                     * - booleans will be overridden
                     * - keys in arrays will be not duplicated
                     */
                    const rootObject = request.value;
                    const masterKeys = Object.keys(rootObject);

                    if (masterKeys.length) {

                        for (let x = 0; x <= masterKeys.length - 1; x++) {
                            switch (masterKeys[x]) {
                                case 'codes': {
                                    let SAVED_CODE_IMPORT = rootObject[masterKeys[x]];
                                    let SAVED_CODES = getItem('SAVED_CODE') ? getItem('SAVED_CODE') : [];
                                    const newValidItems = [];

                                    try {
                                        SAVED_CODE_IMPORT = JSON.parse(SAVED_CODE_IMPORT);

                                        if (SAVED_CODE_IMPORT && typeof [] == typeof SAVED_CODE_IMPORT && SAVED_CODE_IMPORT.length) {
                                            SAVED_CODE_IMPORT.map((singleCode) => {
                                                const { data, name, runtime, type, attributes, runtimeText } = singleCode;

                                                if (data && name && type) {
                                                    newValidItems.push({
                                                        data,
                                                        name,
                                                        runtime,
                                                        type,
                                                        attributes,
                                                        runtimeText,
                                                        uuid: customKey()
                                                    });
                                                    count++;
                                                }
                                            })

                                            if (newValidItems.length) {
                                                SAVED_CODES = SAVED_CODES.concat(newValidItems);
                                                setItemToLocalStorage('SAVED_CODE', SAVED_CODES);
                                            }
                                        }
                                    }
                                    catch (error) {
                                        return sendResponse({
                                            count,
                                            settings,
                                            error: true
                                        });
                                    }
                                    break;
                                }
                                /**
                                 * string or number
                                 */
                                case 'applanguage': {
                                    const applanguage = rootObject[masterKeys[x]] ? rootObject[masterKeys[x]] : 'en';
                                    setItemToLocalStorage('applanguage', applanguage);
                                    settings++;
                                    break;
                                }
                            }
                        }
                        return sendResponse({
                            count,
                            settings,
                            error: false
                        });
                    }
                    else {
                        return sendResponse({
                            error: true
                        });
                    }
                }
            } catch (error) {
                return sendResponse({
                    error: true
                });
            }
            break;
        }

        case 'export': {
            return sendResponse({
                applanguage: localStorage.getItem('applanguage') ? localStorage.getItem('applanguage') : 'en',
                codes: localStorage.getItem('SAVED_CODE') ? localStorage.getItem('SAVED_CODE') : '[]'
            });
            break;
        }

        case 'set-app-language': {
            const mainLanguages = [
                'de', 'en', 'pl'
            ];

            if (mainLanguages.includes(request.language)) {
                localStorage.setItem('applanguage', request.language);
            }
            else {
                localStorage.setItem('applanguage', 'en');
            }
            return sendResponse(true);
            break;
        }

        case 'get-app-language': {

            if (null == localStorage.getItem('applanguage')) {
                localStorage.setItem('applanguage', 'en');
            }

            return sendResponse(localStorage.getItem('applanguage'));
            break;
        }

        case 'execute-code': {
            getTab()
                .then((tab) => {
                    if ((tab[0]) && tab[0].id && tab[0].active) {
                        browser.tabs.sendMessage(tab[0].id, {
                            action: 'generate-code',
                            code: request.code
                        });
                    }
                })
                .then(() => {
                    return sendResponse(true);
                })
                .catch(() => {
                    return sendResponse(true);
                });
            break;
        }

        case 'execute-code-all-tabs': {
            (async () => {
                const allTabs = await browser.tabs.query({}).then(data => data).catch(error => []);

                if (allTabs && allTabs.length) {
                    allTabs.map(tabObject => {
                        browser.tabs.sendMessage(parseInt(tabObject.id), {
                            action: 'generate-code',
                            code: request.code
                        })
                            .catch((error) => {

                            })
                    });
                    return sendResponse(true);

                } else {
                    return sendResponse(true);
                }
            })();
            break;
        }

        case 'execute-code-custom-tab': {
            browser.tabs.sendMessage(parseInt(request.id), {
                action: 'generate-code',
                code: request.code
            })
                .then(() => {
                    update
                    return sendResponse(true);
                })
                .catch((error) => {
                    return sendResponse(true);
                });
            break;
        }

        case 'get-saved-codes': {
            resetCount(sender);
            updateToolbarIcon();
            return sendResponse(getItem('SAVED_CODE'));
            break;
        }

        case 'update-code': {
            let SAVED_CODE = getItem('SAVED_CODE');
            const { type, data, name, runtime, uuid, attributes, runtimeText } = request.data;

            if (null !== SAVED_CODE) {
                SAVED_CODE.map((object, i) => {

                    if (object.uuid === uuid) {
                        SAVED_CODE[i].data = data;
                        SAVED_CODE[i].type = type;
                        SAVED_CODE[i].name = name;
                        SAVED_CODE[i].runtime = runtime;
                        SAVED_CODE[i].attributes = attributes;
                        SAVED_CODE[i].runtimeText = runtimeText;
                    }
                })
            }

            setItemToLocalStorage('SAVED_CODE', SAVED_CODE);
            return sendResponse(true);
            break;
        }

        case 'dupplicate-code': {
            let SAVED_CODE = getItem('SAVED_CODE');
            const { type, data, name, runtime, attributes, runtimeText, uuid } = request.data;

            if (null !== SAVED_CODE) {
                SAVED_CODE.map((object, i) => {
                    if (object.uuid === uuid) {

                        SAVED_CODE.push({
                            type,
                            data,
                            name,
                            runtime,
                            attributes,
                            runtimeText,
                            uuid: customKey()
                        });
                    }
                })
            }

            setItemToLocalStorage('SAVED_CODE', SAVED_CODE);
            return sendResponse(true);
            break;
        }

        case 'save-new-code': {
            let SAVED_CODE = getItem('SAVED_CODE');
            const { type, data, name, runtime, attributes, runtimeText } = request;

            if (null == SAVED_CODE) {
                SAVED_CODE = [
                    {
                        type,
                        data,
                        name,
                        runtime,
                        attributes,
                        runtimeText,
                        uuid: customKey()
                    }
                ];
            }
            else {
                SAVED_CODE.push({
                    type,
                    data,
                    name,
                    runtime,
                    attributes,
                    runtimeText,
                    uuid: customKey()
                });
            }

            setItemToLocalStorage('SAVED_CODE', SAVED_CODE);
            return sendResponse(true);
            break;
        }

        case 'remove-code': {
            let SAVED_CODE = getItem('SAVED_CODE');

            if (null !== SAVED_CODE) {
                SAVED_CODE = SAVED_CODE.filter(i => i.uuid !== request.data.uuid);
                setItemToLocalStorage('SAVED_CODE', SAVED_CODE);
            }

            return sendResponse(true);
            break;
        }

        case 'open-dashboard': {
            browser.tabs.create({
                url: request.url
            })
                .then(onCreated, onError);
            break;
        }

        case 'get-all-tabs': {
            (async () => {
                const allTabs = await browser.tabs.query({}).then(data => data).catch(error => []);
                return sendResponse(allTabs);
            })();
            break;
        }

        default: {
            break;
        }
    }
    return true;
});