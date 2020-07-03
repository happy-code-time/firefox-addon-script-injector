import * as React from 'react';

import { getTranslations } from '../../Translations';

import { addonRoot, addonPrefixDashboard } from '../Functions/addonPrefix';

import fadePopupBoxOutPopup from '../Functions/fadePopupBoxOutPopup';

class AddonNotAvailable extends React.Component
{
    render(){
        const translations: { [key: string]: any } = getTranslations();

        return (
            <div className="AddonNotAvailable">
                <img alt="image" src={`../../Images/logo-512.png`} />
                <h1 className="h1-title ff-title text-center">
                    {
                        translations.addon_not_available
                    }
                </h1>
                <a
                    className="dashboard-link"
                    onClick={() => { setTimeout(() => { window.close(); }, 100); }}
                    target='_blank'
                    //@ts-ignore
                    href={`${browser.runtime.getURL('/Distribution/Dashboard/index.html')}`}
                >
                    {
                        translations.dashboard
                    }
                </a>
            </div>
        );
    }
};

export default AddonNotAvailable;