import * as React from 'react';

import getDerivedStateFromPropsCheck from '../Functions/getDerivedStateFromPropsCheck';

class InputAnimation extends React.Component {
    public props: {
        [key: string]: any
    };

    public translations: {
        [key: string]: any
    };

    public state: {
        [key: string]: any
    };

    public inputNode: any;

    constructor(props) {
        super(props);
        this.callback = this.callback.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.setValue = this.setValue.bind(this);
        this.callbackEnter = this.callbackEnter.bind(this);
        this.setFocus = this.setFocus.bind(this);
        this.checkClick = this.checkClick.bind(this);

        this.state = {
            plainValue: typeof '888' === typeof props.value ? props.value : '',
            callback: props.callback && 'function' === typeof props.callback ? props.callback : undefined,
            onEnter: props.onEnter && 'function' === typeof props.onEnter ? props.onEnter : undefined,
            inputType: props.type && typeof '888' === typeof props.type ? props.type : 'text',
            placeholder: props.placeholder && typeof '888' === typeof props.placeholder ? props.placeholder : '',
            inputProps: props.inputProps && typeof {} === typeof props.inputProps ? props.inputProps : {},
            allowOnlyAZ: typeof true === typeof props.allowOnlyAZ ? props.allowOnlyAZ : false,
            classNames: 'single-box',
            callbackEvent: props.callbackEvent && 'function' === typeof props.callbackEvent ? props.callbackEvent : undefined,
        }
    }

    /**
     * Force re-rendering of this component based
     * on keysChangeListners keys
     * @param {object} props 
     * @param {object} state 
     */
    static getDerivedStateFromProps(props, state) {
        if (getDerivedStateFromPropsCheck(['value', 'callback', 'onEnter', 'type', 'placeholder', 'inputProps', 'allowOnlyAZ', 'callbackEvent'], props, state)) {
            return {
                plainValue: props.value,
                callback: props.callback && 'function' === typeof props.callback ? props.callback : undefined,
                onEnter: props.onEnter && 'function' === typeof props.onEnter ? props.onEnter : undefined,
                inputType: props.type && typeof '888' === typeof props.type ? props.type : 'text',
                placeholder: props.placeholder && typeof '888' === typeof props.placeholder ? props.placeholder : '',
                inputProps: props.inputProps && typeof {} === typeof props.inputProps ? props.inputProps : {},
                allowOnlyAZ: typeof true === typeof props.allowOnlyAZ ? props.allowOnlyAZ : false,
                callbackEvent: props.callbackEvent && 'function' === typeof props.callbackEvent ? props.callbackEvent : undefined,
            };
        }

        return null;
    }

    componentDidMount() {
        document.addEventListener('click', this.checkClick);

        this.setFocus();

        setTimeout(() => {
            if (this.inputNode) {
                const val = this.inputNode.value || this.inputNode.defaultValue;

                if ('' !== val) {
                    this.setState({
                        plainValue: val
                    }, () => {
                        this.setFocus();
                    });
                }
            }
        }, 100);
    }

    componentWillUnmount(){
        document.removeEventListener('click', this.checkClick);
    }

    checkClick(e){
        if(this.inputNode && !this.inputNode.contains(e.target)){
            this.onBlur();
        }
    }

    /**
     * On state change callback
     */
    callback(plainValue: string) {
        const { callback } = this.state;

        if (callback) {
            (callback)(plainValue);
        }
    }

    /**
     * Enter callback
     */
    callbackEnter() {
        if (this.props.onEnter && 'function' == typeof this.props.onEnter) {
            const { plainValue } = this.state;

            (this.props.onEnter)(plainValue);
        }
    }

    /**
     * On Focus action
     */
    onFocus() {
        if (-1 == this.state.classNames.indexOf('focus')) {
            this.setState({
                classNames: 'single-box focus',
            });
        }
    }

    /**
     * On Blur action
     */
    onBlur() {
        if ('' == this.state.plainValue) {
            this.setState({
                classNames: 'single-box'
            });
        }
    }

    /**
     * Set focus
     */
    setFocus() {
        if ('' !== this.state.plainValue) {
            this.setState({
                classNames: 'single-box focus'
            });
        }
    }

    /**
     * Set value on change input field
     */
    setValue(e: KeyboardEvent | Event | any) {
        const { callbackEvent } = this.state;
        const { allowOnlyAZ } = this.state;
        let val = e.target.value;

        if (allowOnlyAZ) {
            val = val.replace(/[^a-zA-Z- ]/gmi, '');
            val = val.trim();
        }

        /**
         * callbackEvent
         */
        if (callbackEvent) {
            (callbackEvent)(e);

            return this.setState({
                plainValue: val
            });
        }

        /**
         * callback
         */
        this.setState({
            plainValue: val
        }, () => {
            this.callback(val);
        });
    }

    render() {
        const { classNames, inputType } = this.state;

        return (
            <div className={classNames}>
                <div className="font-input title">
                    {
                        this.state.placeholder
                    }
                </div>
                {
                    'textarea' == inputType &&
                    <textarea
                        {...this.state.inputProps}
                        className="font-input"
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        type={this.state.inputType}
                        value={this.state.plainValue}
                        onChange={this.setValue}
                        ref={(node) => this.inputNode = node}
                    />
                }
                {
                    'textarea' !== inputType &&
                    <input
                        {...this.state.inputProps}
                        className="font-input"
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        type={this.state.inputType}
                        value={this.state.plainValue}
                        onChange={this.setValue}
                        onKeyPress={event => {
                            if (event.key === 'Enter') {
                                this.callbackEnter();
                            }
                        }}
                        ref={(node) => this.inputNode = node}
                    />
                }
            </div>
        );
    }
}

export default InputAnimation;