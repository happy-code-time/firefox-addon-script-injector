import * as React from 'react';

import getDerivedStateFromPropsCheck from '../Functions/getDerivedStateFromPropsCheck';

interface WebsiteContainerProps {
    contentData?: string | any;
}

class WebsiteContainer extends React.Component<WebsiteContainerProps> {

    public state: {
        [key: string]: any
    };

    constructor(props: WebsiteContainerProps) {
        super(props);

        this.state = {
            contentData: this.props.contentData ? this.props.contentData : '',
        };
    }

    /**
     * Force re-rendering of this component based
     * on keysChangeListners keys
     * @param {object} props 
     * @param {object} state 
     */
    static getDerivedStateFromProps(props, state) {
        if (getDerivedStateFromPropsCheck(['contentData'], props, state)) {
            return {
                contentData: (props.contentData && typeof {} === typeof props.contentData) ? props.contentData : {},
            };
        }

        return null;
    }

    render(): JSX.Element {
        return (
            <div className="ContentBody">
                {
                    this.state.contentData
                }
            </div>
        );
    }
}

export default WebsiteContainer;
