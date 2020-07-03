import * as React from 'react';

import getCurrentLoggedInUser from '../Functions/getCurrentLoggedInUser';

import getDataAxios from '../Functions/getDataAxios';

import encryptValue from '../Functions/encryptValue';

import decryptValue from '../Functions/decryptValue';

import customKey from '../Functions/customKey';

import Redirection from '../Functions/redirect/Redirection';

import addToStore from '../../Store/addToStore';

class InputSuggestionEmails extends React.Component {
    public props: {
        [ key: string ]: any
    };

    public translations: {
        [ key: string ]: any
    };

    public state: {
        [ key: string ]: any
    };

    public Redirection: {
        [ key: string ]: any;
    };

    public remoteHost: string;
    public currentUser: string;
    public currentUserHash: string;
    public refNodeUl: Node;

    constructor (props) {
        super(props);
        this.callback=this.callback.bind(this);
        this.setValue=this.setValue.bind(this);
        this.callbackEnter=this.callbackEnter.bind(this);
        this.callbackEsc=this.callbackEsc.bind(this);
        this.getMailSuggestions=this.getMailSuggestions.bind(this);
        this.handleMouseDown=this.handleMouseDown.bind(this);
        this.toggleChoosedUser=this.toggleChoosedUser.bind(this);
        this.removeChoosed=this.removeChoosed.bind(this);

        this.state={
            plainValue: '',
            callback: this.props.callback,
            classNames: 'single-box-suggestions',
            inputType: this.props.type? this.props.type:'text',
            inputProps: this.props.inputProps? this.props.inputProps:{},
            placeholder: this.props.placeholder? this.props.placeholder:'text',
            remoteHost: this.props.remoteHost,
            parentContext: this.props.parentContext,
            errorMessages: '',
            choosedUsers: this.checkForStaticDataForNewMessage(this.props),
            suggestions: [],
            suggestionFavourites: [],
        };

        this.translations= props.translations;
        this.remoteHost=this.state.remoteHost;
        this.currentUser=getCurrentLoggedInUser(true);
        this.currentUserHash=getCurrentLoggedInUser();
        this.Redirection = new Redirection();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleMouseDown);
        this.getMailSuggestionsFavourites();
    }

    /**
     * Get static value, possible new message comes from draft
     */
    checkForStaticDataForNewMessage(props: any){
        if(undefined !== props.parentContext && props.parentContext.state.staticDataNewMessage && undefined !== props.parentContext.state.staticDataNewMessage){
            if(undefined !== props.parentContext.state.staticDataNewMessage.recipient && 0 !== props.parentContext.state.staticDataNewMessage.recipient.length){
                const mappedRecipients = [];
                const recipients = props.parentContext.state.staticDataNewMessage.recipient.split(',');
                recipients.map( email => {
                    if(email.length){
                        const emailsChars = email.split('').map( (char) => { 
                            if(char !== "'"){
                                return char;
                            }
                        }).join('');

                        mappedRecipients.push(emailsChars.replace("'", ''));
                    }
                });

                return mappedRecipients;
            }

            return [];
        }

        return [];
    }

    /**
     * Hide data div
     * while user not inside it
     * @param {React.MouseEvent|any} e
     */
    handleMouseDown(e: React.MouseEvent|any) {
        if (this.refNodeUl&&!this.refNodeUl.contains(e.target)) {
            this.setState({
                suggestions: [],
                errorMEssages: ''
            })
        }
    }

    /**
     * On state change callback
     */
    callback() {
        if (this.props.callback&&'function'==typeof this.props.callback) {
            const { plainValue }=this.state;

            (this.props.callback)(plainValue);
        }
    }

    /**
     * Enter callback
     */
    callbackEnter() {
        this.getMailSuggestions();
    }

    /**
     * Esc callback
     */
    callbackEsc() {
        this.setState({
            suggestions: [],
            errorMEssages: ''
        })
    }

    /**
     * Get user favourites
     */
    getMailSuggestionsFavourites(){
        getDataAxios( 'get', `${this.remoteHost}?key=${encryptValue('userfavourites')}&user=${this.currentUserHash}`)
        .then((response: any) => {
            /**
             * Check if response has data
             */
            if (response&&response.data) {
                const encryptedData=response.data;

                try {
                    /**
                     * Decrypt data and from string back to array|object
                     */

                    const decryptedData=decryptValue(encryptedData);
                    const suggestionFavourites=JSON.parse(decryptedData);

                    if (suggestionFavourites&&suggestionFavourites.length) {
                        this.setState({
                            suggestionFavourites,
                            errorMessages: ''
                        });
                    }

                } catch (error) {
                    this.setState({
                        errorMessages: this.translations.globalProcessError
                    });
                    addToStore( `${this.translations.globalProcessError}` ,2);
                }
            }
        })
        .catch((error: ErrorEvent) => {
            this.setState({
                errorMessages: this.translations.globalNetworkError
            });
            addToStore( `${this.translations.globalNetworkError}` ,1);
        });
    }

    /**
     * Get email suggestions
     */
    getMailSuggestions() {
        if (''==this.state.plainValue) {
            this.setState({
                errorMessages: this.translations.messagesNewMessageEmptyField,
                suggestions: []
            })
        }
        else {
            getDataAxios( 'get', `${this.remoteHost}?key=${encryptValue('messagessuggestions')}&value=${encryptValue(this.state.plainValue)}&user=${this.currentUserHash}`)
                .then((response: any) => {
                    /**
                     * Check if response has data
                     */
                    if (response&&response.data) {
                        const encryptedData=response.data;

                        try {
                            /**
                             * Decrypt data and from string back to array|object
                             */

                            const decryptedData=decryptValue(encryptedData);
                            const suggestions=JSON.parse(decryptedData);
                            
                            if (suggestions&&suggestions.length) {
                                this.setState({
                                    suggestions,
                                    errorMessages: ''
                                });
                            }
                            else {
                                this.setState({
                                    errorMessages: this.translations.messagesNewMessageNoResults
                                });
                            }

                        } catch (error) {
                            this.setState({
                                errorMessages: this.translations.globalProcessError
                            });
                            addToStore( `${this.translations.globalProcessError}` ,2);
                        }
                    }
                })
                .catch((error: ErrorEvent) => {
                    this.setState({
                        errorMessages: this.translations.globalNetworkError
                    });
                    addToStore( `${this.translations.globalNetworkError}` ,1);
                });
        }
    }

    /**
     * Set value on change input field
     */
    setValue(e: KeyboardEvent|Event|any) {
        const { value } = e.target;

        this.setState({
            plainValue: value
        }, () => {
            this.callback();
            this.showSuggestions();
        });
    }

    /**
     * Show suggestion if the user has favourites
     */
    showSuggestions(){
        const filteredSuggestions = [];
        let { suggestionFavourites, plainValue, suggestions } = this.state;

        if(plainValue.length){

            for(let x = 0; x <= suggestionFavourites.length-1; x++){
                if(undefined !== suggestionFavourites[x].email && -1 !== suggestionFavourites[x].email.indexOf(plainValue)){
                    filteredSuggestions.push(suggestionFavourites[x]);
                }
            }

            if(filteredSuggestions.length){
                const emails = [];
                const indexes = [];

                /**
                 * Get unique email addresses
                 */
                for(let x = 0; x <= filteredSuggestions.length-1; x++){
                    if(!emails.includes(filteredSuggestions[x].email)){
                        emails.push(filteredSuggestions[x].email);
                        indexes.push(x);
                    }
                }   

                /**
                 * Add items by getted indexes of parent element: filteredSuggestions
                 */
                const removedDupplicates = [];
                
                for(let x = 0; x <= indexes.length-1; x++){
                    removedDupplicates.push(filteredSuggestions[indexes[x]]);
                }

                this.setState({
                    suggestions: removedDupplicates,
                    errorMessages: ''
                });
            }
            else {
                this.setState({
                    suggestions: [],
                    errorMessages: ''
                });
            }
        }
        else{
            this.setState({
                suggestions: [],
                errorMessages: ''
            });
        }
    }

    /**
     * Append choosed user
     */
    toggleChoosedUser(email) {
        let { choosedUsers }=this.state;

        if (!choosedUsers.includes(email)) {
            choosedUsers.push(email);
        }
        else {
            choosedUsers=choosedUsers.filter( entry => entry !== email);
        }

        this.state.parentContext.setRecipients(choosedUsers);

        this.setState({
            choosedUsers,
            errorMessages: '',
            plainValue: ''
        });
    }

    /**
     * Remove choosed user from list
     */
    removeChoosed(email) {
        let { choosedUsers }=this.state;
        choosedUsers=choosedUsers.filter( entry => entry !== email);

        this.state.parentContext.setRecipients(choosedUsers);

        this.setState({
            choosedUsers,
            errorMessages: ''
        });
    }

    render() {

        const inputStyle={
            width: (0!==this.state.choosedUsers.length)? undefined:'100%',
            minWidth: (0!==this.state.choosedUsers.length)? '300px':'100%',
            maxWidth: (0!==this.state.choosedUsers.length)? '500px':'100%',
        };

        return (
            <div>
                <h1 className="h1-title">
                    { `${this.translations.messagesNewMessageTitle} E-mail` }
                </h1>
                <div className={ this.state.classNames }>
                    {
                        0!==this.state.choosedUsers.length&&
                        <div className="choosed">
                            {
                                this.state.choosedUsers.map(email => {
                                    return (
                                        <div
                                            key={ customKey() }
                                            className="item ff-title"
                                        >
                                            <div
                                                onClick={ (e) => this.removeChoosed(email) }
                                                className="remove">
                                                x
                                            </div>
                                            {
                                                email
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                    <input
                        { ...this.state.inputProps }
                        className="font-input"
                        type={ this.state.inputType }
                        value={ this.state.plainValue }
                        onChange={ (e) => this.setValue(e) }
                        placeholder={ this.state.placeholder }
                        onKeyPress={ event => {
                            if (event.key==='Enter') {
                                this.callbackEnter();
                            }
                            if (event.key==='Escape') {
                                this.callbackEsc();
                            }
                        } }
                        style={ inputStyle }
                    />
                    <i
                        onClick={ this.getMailSuggestions }
                        className="fas fa-search search-icon"
                    ></i>
                </div>
                {
                    this.state.suggestions&&0!==this.state.suggestions.length&&
                    <div className="user-suggestions">
                        <ul
                            className="flex flex-column"
                            ref={ (node) => this.refNodeUl=node }
                        >
                            <span className="suggestions-span-holder">
                            {
                                this.state.suggestions.map( suggestion => {
                                    const { email, firstname, lastname }=suggestion;

                                    return (
                                        <li
                                            className={`${this.state.choosedUsers.includes(email) ? 'ff-title active' : 'ff-title'}`}
                                            key={ customKey() }
                                            onClick={ (e) => this.toggleChoosedUser(email) }
                                        >
                                            {
                                                `${firstname} ${lastname}: ${email}`
                                            }
                                        </li>
                                    )
                                })
                            }
                            </span>
                        </ul>
                    </div>
                }
                {
                    ''!==this.state.errorMessages&&
                    <div className="error-message">
                        {
                            ''!==this.state.errorMessages&&
                            <i className="fas fa-exclamation"></i>
                        }
                        {
                            ''!==this.state.errorMessages&&
                            <span>
                                {
                                    this.state.errorMessages
                                }
                            </span>
                        }
                    </div>
                }
            </div>
        );
    }
}

export default InputSuggestionEmails;