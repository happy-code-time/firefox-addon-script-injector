import * as React from 'react';

import getDerivedStateFromPropsCheck from '../Functions/getDerivedStateFromPropsCheck';

import disableHtmlScroll from './Functions/disableHtmlScroll';

import enableHtmlScroll from './Functions/enableHtmlScroll';

class FullScreenOverlay extends React.Component {

    public props: {
        [key: string]: any
    };

    public state: {
        [key: string]: any
    };

    constructor(props) {
        super(props);
        this.closeClick = this.closeClick.bind(this);
        this.EscListener = this.EscListener.bind(this);

        this.state = {
            closeOnClick: (typeof true == typeof props.closeOnClick) ? props.closeOnClick : true,
            closeOnEsc: (typeof true == typeof props.closeOnEsc) ? props.closeOnEsc : true,
            data: props.data ? props.data : '',
            animation: (typeof true == typeof props.animation) ? props.animation : true,
            animationType: (props.animationType && typeof '8' == typeof props.animationType) ? props.animationType : '',
            defaultClass: (props.defaultClass && typeof '8' == typeof props.defaultClass) ? props.defaultClass : 'rr-fullScreenOverlay',
            closeCallback: ('function' == typeof props.closeCallback) ? props.closeCallback : undefined,
            display: (typeof true == typeof props.display) ? props.display : false,
            iconClose: props.iconClose ? props.iconClose : undefined,
            dimmed: (typeof true == typeof props.dimmed) ? props.dimmed : true,
            disableScroll: (typeof true == typeof props.disableScroll) ? props.disableScroll : true,
        };
    }

    componentDidMount(){
        const { closeOnEsc, disableScroll } = this.state;

        if(closeOnEsc){
            window.addEventListener("keydown", this.EscListener, false);
        }

        if(disableScroll){
            disableHtmlScroll();
        }
    }

    componentWillUnmount(){
        enableHtmlScroll();
        window.removeEventListener("keydown", this.EscListener, false);
    }

    EscListener(event: KeyboardEvent){
        const self = this;

        if(event.keyCode === 27) {
            const { closeCallback } = self.state;

            if(closeCallback && 'function' == typeof closeCallback){
                enableHtmlScroll();
                window.removeEventListener("keydown", this.EscListener, false);
                (closeCallback)();
            }
        }
    }

    /**
     * Force re-rendering of this component based
     * on keysChangeListners keys
     * @param {object} props 
     * @param {object} state 
     */
    static getDerivedStateFromProps(props, state) {
        if (getDerivedStateFromPropsCheck(['disableScroll', 'closeCallback', 'defaultClass', 'animation', 'closeOnClick', 'closeOnEsc', 'data', 'iconClose'], props, state)) {
            return {
                closeCallback: ('function' == typeof props.closeCallback) ? props.closeCallback : undefined,
                closeOnClick: (typeof true == typeof props.closeOnClick) ? props.closeOnClick : true,
                closeOnEsc: (typeof true == typeof props.closeOnEsc) ? props.closeOnEsc : true,
                data: props.data ? props.data : '',
                animation: (typeof true == typeof props.animation) ? props.animation : true,
                defaultClass: (props.defaultClass && typeof '8' == typeof props.defaultClass) ? props.defaultClass : 'rr-fullScreenOverlay',
                iconClose: props.iconClose ? props.iconClose : undefined,
                disableScroll: (typeof true == typeof props.disableScroll) ? props.disableScroll : true
            };
        }

        return null;
    }

    closeClick(force: boolean = false){
        const { closeOnClick, closeCallback } = this.state;

        if(force || (closeOnClick && closeCallback && 'function' == typeof closeCallback)){
            enableHtmlScroll();
            window.removeEventListener("keydown", this.EscListener, false);
            (closeCallback)();
        }
    }

    getDefaultClass(){
        let { animation, animationType, defaultClass } = this.state;

        if(animation){
            
            if('scale' == animationType){
                defaultClass = `${defaultClass} rr-fullScreenOverlay-scale`;
            }

            if('left' == animationType){
                defaultClass = `${defaultClass} rr-fullScreenOverlay-left`;
            }

            if('top' == animationType){
                defaultClass = `${defaultClass} rr-fullScreenOverlay-top`;
            }

            if('right' == animationType){
                defaultClass = `${defaultClass} rr-fullScreenOverlay-right`;   
            }

            if('bottom' == animationType){
                defaultClass = `${defaultClass} rr-fullScreenOverlay-bottom`;   
            }
        }

        return defaultClass
    }
    
    render() {
        let { display, iconClose, data, dimmed } = this.state;
        const defaultClass = this.getDefaultClass();

        if(!display){
            return null;
        }

        return (
            <div className={defaultClass}>
                {
                    iconClose &&
                    <div className="icon-close" onClick={() => this.closeClick(true)}>
                        {
                            iconClose
                        }
                    </div>
                }
                {
                    dimmed &&
                    <div className="close-area" onClick={() => this.closeClick()}></div>
                }

                <div className="content" onClick={() => this.closeClick()}>
                    {
                        data
                    }
                </div>
            </div>
        );
    }
}

export default FullScreenOverlay;
