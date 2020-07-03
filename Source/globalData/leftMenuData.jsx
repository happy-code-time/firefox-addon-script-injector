import React from 'react';

import { Link } from 'react-router-dom';

import { customKey } from 'react-divcreator';

import { getTranslations } from '../Translations';

export const leftMenuData = (current) => {
    const translations = getTranslations();
    const data = [];
    const menuItems = [ 
        {
            text: translations.header_1,
            icon: <i className="far fa-window-maximize"></i>,
            href: '/'
        },
        {
            text: translations.header_2,
            icon: <i className="fas fa-terminal"></i>,
            href: '/new-script'
        },
        {
            text: translations.header_3,
            icon: <i className="fas fa-server"></i>,
            href: '/import-settings'
        },
        {
            text: translations.header_4,
            icon: <i className="fas fa-server"></i>,
            href: '/export-settings'
        },
        {
            text: translations.header_5,
            icon: <i className="fas fa-flag-checkered"></i>,
            href: '/change-language'
        }
    ];

    menuItems.map( (object, i) => {
        data.push(
            <li 
                key={customKey()}
                className={i === current ? 'active' : ''}
            >
                {
                    object.icon
                }
                <span>
                    <Link to={object.href}>
                        {
                            object.text
                        }
                    </Link>
                </span>
            </li>
        );
    });

    return (<ul className="menu-ul"> { data }</ul>);
}