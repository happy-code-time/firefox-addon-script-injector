import * as React from 'react';

import customKey from '../Functions/customKey';

import getDerivedStateFromPropsCheck from '../Functions/getDerivedStateFromPropsCheck';

class FullScreenListObjects extends React.Component
{

    public props: {
        [key: string]: any
    };

    public state: {
        [key: string]: any
    };

    public FullSceenListNode: any;

    constructor(props){
        super(props);
        this.callback = this.callback.bind(this);
        this.callbackClose = this.callbackClose.bind(this);
        this.setValue = this.setValue.bind(this);
        this.buildListJsx = this.buildListJsx.bind(this);
        this.removeEscEventListener = this.removeEscEventListener.bind(this);
        this.addEscEventListener = this.addEscEventListener.bind(this);
        this.EscListener = this.EscListener.bind(this);
        this.getDefaultClass = this.getDefaultClass.bind(this);

        this.state = {
            /**
             * App
             */
            filteredData: [],
            inputValue: '',
            /**
             * User
             */
            defaultClass: (props.defaultClass && typeof '8' == typeof props.defaultClass) ? this.getDefaultClass(props) : this.getDefaultClass(props),
            animation: typeof '8' === typeof props.animation ? props.animation.toLowerCase() : '',
            data: (props.data && typeof [] === typeof props.data) ? props.data : [],
            display: typeof true === typeof props.display ? props.display : false,
            displayLineNumber: typeof true === typeof props.displayLineNumber ? props.displayLineNumber : false,
            iconClose: props.iconClose ? props.iconClose : '',
            inputActive: typeof true === typeof props.inputActive ? props.inputActive : false,
            noDataText: (props.noDataText && typeof 'react' === typeof props.noDataText) ? props.noDataText : 'No data found',
            inputPlaceholder: (props.inputPlaceholder && typeof 'react' === typeof props.inputPlaceholder) ? props.inputPlaceholder : 'Search here...',
            callback: props.callback && 'function' == typeof props.callback ? props.callback : undefined,
            callbackClose: props.callbackClose && 'function' == typeof props.callbackClose ? props.callbackClose : undefined,
            closeOnCallback: typeof true === typeof props.closeOnCallback ? props.closeOnCallback : false,
            closeOnDimmedClick: typeof true === typeof props.closeOnDimmedClick ? props.closeOnDimmedClick : false,
            closeOnEsc: typeof true === typeof props.closeOnEsc ? props.closeOnEsc : false,
            callbackData: props.callbackData ? props.callbackData : undefined
        };
    }

    /**
     * Force re-rendering of this component based
     * on keysChangeListners keys
     * @param {object} props 
     * @param {object} state 
     */
    static getDerivedStateFromProps(props, state) {
        if (getDerivedStateFromPropsCheck(['data', 'display', 'displayLineNumber', 'iconClose', 'inputActive', 'closeOnDimmed', 'noDataText', 'inputPlaceholder', 'animation', 'callback', 'callbackClose', 'closeOnEsc', 'callbackData'], props, state)) {
            return {
                data: (props.data && typeof [] === typeof props.data) ? props.data : [],
                display: typeof true === typeof props.display ? props.display : false,
                displayLineNumber: typeof true === typeof props.displayLineNumber ? props.displayLineNumber : false,
                iconClose: props.iconClose ? props.iconClose : '',
                inputActive: typeof true === typeof props.inputActive ? props.inputActive : false,
                noDataText: (props.noDataText && typeof 'react' === typeof props.noDataText) ? props.noDataText : 'No data found',
                inputPlaceholder: (props.inputPlaceholder && typeof 'react' === typeof props.inputPlaceholder) ? props.inputPlaceholder : 'Search here...',
                animation: typeof '8' === typeof props.animation ? props.animation.toLowerCase() : '',
                callback: props.callback && 'function' == typeof props.callback ? props.callback : undefined,
                callbackClose: props.callbackClose && 'function' == typeof props.callbackClose ? props.callbackClose : undefined,
                closeOnCallback: typeof true === typeof props.closeOnCallback ? props.closeOnCallback : false,
                closeOnDimmedClick: typeof true === typeof props.closeOnDimmedClick ? props.closeOnDimmedClick : false,
                closeOnEsc: typeof true === typeof props.closeOnEsc ? props.closeOnEsc : false,
                callbackData: props.callbackData ? props.callbackData : undefined
            };
        }

        return null;
    }

    /**
     * After mount
     */
    componentDidMount(){
        const { closeOnEsc } = this.state;

        if(closeOnEsc){
            this.addEscEventListener();
        }
    }
    
    /**
     * Before unmount
     */
    componentWillUnmount(){
        const { closeOnEsc } = this.state;

        if(closeOnEsc){
            this.removeEscEventListener();
        }
    }

    getAvailableAnimationTypes(){
        return [
            'scale',
            'top',
            'right',
            'bottom',
            'left'
        ];
    }

    getDefaultClass(props){
        const { defaultClass } = props;
        let { animation } = props;

        if(typeof '8' === typeof props.animation){
            animation = animation.toLowerCase();
        }

        if(!this.getAvailableAnimationTypes().includes(animation)){
            animation = 'none';
        }

        if(props.defaultClass && typeof '8' == typeof props.defaultClass){
            return `${defaultClass} ${animation ? `${animation}` : ''}`;
        }

        return `rr-fullscreenlist ${animation ? `${animation}` : ''}`;
    }

    /**
     * After state change
     * and rerendered
     */
    componentDidUpdate(){
        const { display, closeOnEsc } = this.state;

        if(closeOnEsc){
            this.removeEscEventListener();
        }

        if(display){

            if(closeOnEsc){
                this.addEscEventListener();
            }

            if(this.FullSceenListNode){
                this.FullSceenListNode.click();
            }
        }
    }

    /**
     * Add - On "ESC" key press listenere
     */
    addEscEventListener(){
        window.addEventListener("keydown", this.EscListener, false);
    }

    /**
     * Remove - On "ESC" key press listenere
     */
    removeEscEventListener(){
        window.removeEventListener("keydown", this.EscListener, false);
    }

    /**
     * On "ESC" key press
     */
    EscListener(event){
        if(event.keyCode === 27) {
            this.removeEscEventListener();
            this.callbackClose();
        }
    }

    callbackClose(isDimmed = false){
        const { defaultClass, callbackClose, closeOnDimmedClick } = this.state;
        let { animation } = this.state;
        let timeouter = 0;

        if(isDimmed && !closeOnDimmedClick){
            return null;
        }
        
        if(!this.getAvailableAnimationTypes().includes(animation)){
            animation = 'none';
        }

        if(animation && 'none' !== animation){
            timeouter = 300;
        }

        this.setState({
            defaultClass: `${defaultClass} ${animation ? `${animation}-back` : ''}`
        }, () => {
            setTimeout( () => {

                if(callbackClose){
                    (callbackClose)();
                }

                this.setState({
                    defaultClass: this.getDefaultClass(this.props)
                });

            }, timeouter);
        });
    }

    /**
     * User custom callback to 
     * return the value of 
     * the clicked li item
     * @param event 
     */
    callback(event, entry){
        const { closeOnCallback, callbackData } = this.state;
        const { callback } = this.props;

        if(callback && 'function' === typeof callback){

            (callback)(event, entry, callbackData);

            if(closeOnCallback){
                return this.callbackClose();
            }
        }
    }

    /**
     * Set input value
     * @param event 
     */
    setValue(event){
        this.setState({
            inputValue: event.target.value
        }, () => {
            const { data, inputValue } = this.state;

            this.setState({
                filteredData: data.filter( entry => -1 !== entry.text.toLowerCase().indexOf(inputValue.toLowerCase()))
            });
        });
    }

    /**
     * Main li list builder
     * @param array 
     */
    buildListJsx(array){
        const { displayLineNumber } = this.state;

        return array.map( (entry, index) => {
            return (
                <li key={customKey()} className="li" onClick={ (e) => this.callback(e, entry)}>
                    {
                        displayLineNumber &&
                        <span className="index">
                            {
                                index+1
                            }
                        </span>
                    }
                    <span className="text">
                        {
                            entry.text
                        }
                    </span>
                </li>
            )
        });
    }

    render(){
        const { defaultClass, iconClose, data, display, filteredData, inputActive, inputValue, noDataText, inputPlaceholder } = this.state;

        if(!display){
            return null;
        }

        return (
            <div className={defaultClass} ref={ (node) => this.FullSceenListNode = node }>
                {
                    iconClose &&
                    <span className="span-close" onClick={(e) => this.callbackClose()}>
                        {
                            iconClose
                        }
                    </span>
                }
                <div className='dimmed' onClick={(e) => this.callbackClose(true)}></div>
                <div className="content">
                    {
                        inputActive && <input value={inputValue} placeholder={inputPlaceholder} onChange={(e) => this.setValue(e)}/>
                    }
                    <ul className="ul">
                        {
                            0 !== filteredData.length && this.buildListJsx(filteredData)
                        }
                        {
                            0 === filteredData.length && 0 !== inputValue.length && 
                            <div className="no-data">
                                {
                                    noDataText
                                }
                            </div>
                        }
                        {
                            0 == filteredData.length && 0 == inputValue.length && this.buildListJsx(data)
                        }
                    </ul>
                </div>                
            </div>
        );
    }
}

export default FullScreenListObjects;