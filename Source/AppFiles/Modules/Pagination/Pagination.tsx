import * as React from 'react';

import customKey from '../../Functions/customKey';

import isEquivalent from '../../Functions/checkObjectsAreEqual';

import '../../../Sass/Pagination.scss';

class Pagination extends React.Component {

    public state: {
        [ key: string ]: any
    }

    public props: {
        [ key: string ]: any
    }

    constructor (props) {
        super(props);
        this.getPagerJsx=this.getPagerJsx.bind(this);
        this.getList=this.getList.bind(this);
        this.prev=this.prev.bind(this);
        this.next=this.next.bind(this);
        this.filterData=this.filterData.bind(this);

        this.state={
            /**
             * User passed props
             */
            data: (props.data && typeof [] === typeof props.data) ? props.data : [],
            filteredData: (props.data && typeof [] === typeof props.data) ? props.data : [],
            searchOnKeys: (props.searchOnKeys && typeof [] === typeof props.searchOnKeys) ? props.searchOnKeys : [],
            itemsPerSite: (props.itemsPerSite && typeof 888 === typeof props.itemsPerSite) ? props.itemsPerSite : 10,
            keysToRender: (props.display && typeof [] === typeof props.display) ? props.display : [],
            displayCount: (typeof true === typeof props.displayCount) ? props.displayCount : false,
            liOnClickCallback: (props.liOnClickCallback && 'function' === typeof props.liOnClickCallback) ? props.liOnClickCallback : undefined,
            inputOnChangeCallback: (props.inputOnChangeCallback && 'function' === typeof props.inputOnChangeCallback) ? props.inputOnChangeCallback : undefined,
            displayTotal: (typeof true === typeof props.displayTotal) ? props.displayTotal : false,
            displayPagesInfo: (typeof true === typeof props.displayPagesInfo) ? props.displayPagesInfo : false,
            displayPaginationPages: (typeof true === typeof props.displayPaginationPages) ? props.displayPaginationPages : false,
            totalPrefix: (props.totalPrefix && typeof '888' === typeof props.totalPrefix) ? props.totalPrefix : '',
            paginationTextPrefix: (props.paginationTextPrefix && typeof '888' === typeof props.paginationTextPrefix) ? props.paginationTextPrefix : '',
            paginationTextMiddle: (props.paginationTextMiddle && typeof '888' === typeof props.paginationTextMiddle) ? props.paginationTextMiddle : '',
            paginationPagesToDisplay: (props.paginationPagesToDisplay && typeof 888 === typeof props.paginationPagesToDisplay) ? props.paginationPagesToDisplay : 5,
            alignPagesItems: (props.alignPagesItems && typeof 888 === typeof props.alignPagesItems) ? props.alignPagesItems : 1,
            alignPagination: (props.alignPagination && typeof 888 === typeof props.alignPagination) ? props.alignPagination : 1,
            resetCountOnEachPage: (typeof true === typeof props.resetCountOnEachPage) ? props.resetCountOnEachPage : false,
            nextButton: props.nextButton ? props.nextButton : '',
            previousButton: props.previousButton ? props.previousButton : '',
            displaySearch: (typeof true === typeof props.displaySearch) ? props.displaySearch : false,
            searchPlaceholder: props.searchPlaceholder ? props.searchPlaceholder : '',
            searchIcon: props.searchIcon ? props.searchIcon : '',
            searchSensisitve: (typeof true === typeof props.searchSensisitve) ? props.searchSensisitve : false,
            searchValue: (props.searchValue && typeof '888' === typeof props.searchValue) ? props.searchValue : '',
            searchOnKeyDown: (typeof true === typeof props.searchOnKeyDown) ? props.searchOnKeyDown : false,
            searchTitle: (props.searchTitle && typeof '888' === typeof props.searchTitle) ? props.searchTitle : '',
            paginationTitle: (props.paginationTitle && typeof '888' === typeof props.paginationTitle) ? props.paginationTitle : '',
            noDataMessage: (props.noDataMessage && typeof '888' === typeof props.noDataMessage) ? props.noDataMessage : '',
            isLoadingFalse: (typeof true === typeof props.isLoadingFalse) ? props.isLoadingFalse : false,
            fallbackLoading: props.fallbackLoading ? props.fallbackLoading : '',
            fallbackLoadingTime: (props.fallbackLoadingTime && typeof 888 === typeof props.fallbackLoadingTime) ? props.fallbackLoadingTime : 0,
            fallbackNoData: props.fallbackNoData ? props.fallbackNoData : '',
            fallbackNoDataSearch: props.fallbackNoDataSearch ? props.fallbackNoDataSearch : '',
            fallbackMounting: props.fallbackMounting ? props.fallbackMounting : '',
            /**
             * Debugging
             */
            env: (typeof 'react'===typeof props.env)? props.env:0,
            /**
             * Filtered items
             */
            itemsToRender: [],
            itemsToRenderJsx: [],
            currentPage: 0,
            /**
             * Mounting and performance
             */
            loading: true,
            dataLoaded: false
        };
    }

    componentDidMount(){
        this.filterData(true);
    }

    /**
     * Force re-rendering of this component
     * only if data are changed
     * @param {object} props 
     * @param {object} state 
     */
    static getDerivedStateFromProps(props, state) {
        if (!isEquivalent(props.data, state.data)){
            return {
                data: (props.data && typeof [] === typeof props.data) ? props.data : [],
                filteredData: (props.data && typeof [] === typeof props.data) ? props.data : [],
                searchOnKeys: (props.searchOnKeys && typeof [] === typeof props.searchOnKeys) ? props.searchOnKeys : [],
                itemsPerSite: (props.itemsPerSite && typeof 888 === typeof props.itemsPerSite) ? props.itemsPerSite : 10,
                keysToRender: (props.display && typeof [] === typeof props.display) ? props.display : [],
                displayCount: (typeof true === typeof props.displayCount) ? props.displayCount : false,
                liOnClickCallback: (props.liOnClickCallback && 'function' === typeof props.liOnClickCallback) ? props.liOnClickCallback : undefined,
                inputOnChangeCallback: (props.inputOnChangeCallback && 'function' === typeof props.inputOnChangeCallback) ? props.inputOnChangeCallback : undefined,
                displayTotal: (typeof true === typeof props.displayTotal) ? props.displayTotal : false,
                displayPagesInfo: (typeof true === typeof props.displayPagesInfo) ? props.displayPagesInfo : false,
                displayPaginationPages: (typeof true === typeof props.displayPaginationPages) ? props.displayPaginationPages : false,
                totalPrefix: (props.totalPrefix && typeof '888' === typeof props.totalPrefix) ? props.totalPrefix : '',
                paginationTextPrefix: (props.paginationTextPrefix && typeof '888' === typeof props.paginationTextPrefix) ? props.paginationTextPrefix : '',
                paginationTextMiddle: (props.paginationTextMiddle && typeof '888' === typeof props.paginationTextMiddle) ? props.paginationTextMiddle : '',
                paginationPagesToDisplay: (props.paginationPagesToDisplay && typeof 888 === typeof props.paginationPagesToDisplay) ? props.paginationPagesToDisplay : 5,
                alignPagesItems: (props.alignPagesItems && typeof 888 === typeof props.alignPagesItems) ? props.alignPagesItems : 1,
                alignPagination: (props.alignPagination && typeof 888 === typeof props.alignPagination) ? props.alignPagination : 1,
                resetCountOnEachPage: (typeof true === typeof props.resetCountOnEachPage) ? props.resetCountOnEachPage : false,
                nextButton: props.nextButton ? props.nextButton : '',
                previousButton: props.previousButton ? props.previousButton : '',
                displaySearch: (typeof true === typeof props.displaySearch) ? props.displaySearch : false,
                searchPlaceholder: props.searchPlaceholder ? props.searchPlaceholder : '',
                searchIcon: props.searchIcon ? props.searchIcon : '',
                searchSensisitve: (typeof true === typeof props.searchSensisitve) ? props.searchSensisitve : false,
                searchValue: (props.searchValue && typeof '888' === typeof props.searchValue) ? props.searchValue : '',
                searchOnKeyDown: (typeof true === typeof props.searchOnKeyDown) ? props.searchOnKeyDown : false,
                searchTitle: (props.searchTitle && typeof '888' === typeof props.searchTitle) ? props.searchTitle : '',
                paginationTitle: (props.paginationTitle && typeof '888' === typeof props.paginationTitle) ? props.paginationTitle : '',
                noDataMessage: (props.noDataMessage && typeof '888' === typeof props.noDataMessage) ? props.noDataMessage : '',
                isLoadingFalse: (typeof true === typeof props.isLoadingFalse) ? props.isLoadingFalse : false,
                fallbackLoading: props.fallbackLoading ? props.fallbackLoading : '',
                fallbackLoadingTime: (props.fallbackLoadingTime && typeof 888 === typeof props.fallbackLoadingTime) ? props.fallbackLoadingTime : 0,
                fallbackNoData: props.fallbackNoData ? props.fallbackNoData : '',
                fallbackNoDataSearch: props.fallbackNoDataSearch ? props.fallbackNoDataSearch : '',
                fallbackMounting: props.fallbackMounting ? props.fallbackMounting : '',
            };
        }
        return null;
    }

    /**
     * Max available pages
     */
    getMaxPages(){
        const { filteredData, itemsPerSite } = this.state;
        let maxPages: any = filteredData.length/itemsPerSite;

        if(filteredData.length <= itemsPerSite){
            return parseInt(maxPages);
        }

        maxPages = Math.round(maxPages);

        if(maxPages*itemsPerSite<filteredData.length){
            maxPages += 1;
        }

        return maxPages;
    }

    changePage(number: number){
        number -= 1;

        this.setState({
            currentPage: number
        });
    }

    /**
     * Users pagination interagtions jsx
     */
    getPagerJsx() {
        let { 
            itemsPerSite, currentPage, filteredData, 
            displayTotal, totalPrefix, displayPagesInfo, 
            paginationTextPrefix, paginationTextMiddle, 
            displayPaginationPages, paginationPagesToDisplay,
            alignPagesItems, fallbackNoData,
            previousButton, nextButton, searchValue,
            fallbackNoDataSearch, dataLoaded, fallbackMounting,
        } =this.state;

        const currentCount=filteredData.length;
        let mainPage=currentPage;
        mainPage++;
        let maxPages = this.getMaxPages();
        let pagesPrev = [];
        let pagesNext = [];

        if(maxPages){

            /**
             * Prev pages
             */
            for(let x = mainPage-paginationPagesToDisplay; x < mainPage; x++){
        
                if(x > 0){
                    pagesPrev.push(x);                    
                }
            }

            /**
             * Next pages
             */
            for(let x = 0; x <= maxPages; x++){
        
                if(x > mainPage && x <= mainPage+paginationPagesToDisplay){
                    pagesNext.push(x);
                }
            }
        }

        if(!maxPages){
            maxPages = 1;
        }

        const itemsTotal = (
            <div className="total">
                {
                    totalPrefix && totalPrefix
                }
                {
                    currentCount
                }
            </div>
        );

        const itemsPage = (
            <div className="pagination-pages">
                {
                    `${paginationTextPrefix} ${mainPage} ${paginationTextMiddle} ${maxPages}`
                }
            </div>
        );

        const itemsPagination = (
            <span className="buttons">
                <span
                    onClick={ (e) => this.prev() }
                    className={ currentPage!==0 ? `previous-button ${'' == previousButton ? 'icon-previous' : ''}`: `previous-button disabled ${'' == previousButton ? 'icon-previous' : ''}` }
                >
                    {
                        previousButton && previousButton
                    }
                    {
                        '' == previousButton && '↩'
                    }
                </span>
                {
                    displayPaginationPages &&
                    <span className="pagination-paging">
                        <span className="pages-previous">
                            {
                                pagesPrev.map( pageNumber => {
                                    return (
                                        <span 
                                            key={customKey()}
                                            className="page-number" 
                                            onClick={(e) => this.changePage(pageNumber)}
                                        >
                                            {
                                                pageNumber
                                            }
                                        </span>
                                    )
                                })   
                            }
                        </span>
                        <span className="pages-current">
                            <span className="page-number">
                                {
                                    mainPage
                                }
                            </span>
                        </span>
                        <span className="pages-next">
                            {
                                pagesNext.map( pageNumber => {
                                    return (
                                        <span 
                                            key={customKey()}
                                            className="page-number" 
                                            onClick={(e) => this.changePage(pageNumber)}
                                        >
                                            {
                                                pageNumber
                                            }
                                        </span>
                                    )
                                })
                            }
                        </span>
                    </span>
                }
                <span
                    onClick={ (e) => this.next() }
                    className={ itemsPerSite*mainPage<currentCount? `next-button ${'' == nextButton ? 'icon-next' : ''}`: `next-button disabled ${'' == nextButton ? 'icon-next' : ''}` }
                >
                    {
                        nextButton && nextButton
                    }
                </span>
            </span>
        );

        /**
         * No Data available
         */
        if(0 == currentCount){

            if(!dataLoaded && '' !== fallbackMounting){
                return fallbackMounting;
            }

            if('' !== fallbackNoData && '' === searchValue){
                return fallbackNoData;
            }

            if('' !== fallbackNoDataSearch && '' !== searchValue){
                return fallbackNoDataSearch;
            }

            return null;
        }

        /**
         * Data available
         */
        switch(alignPagesItems){
            case 1 : {
                return (
                    <div key={ customKey() } className="paging">
                        {
                            displayTotal && itemsTotal
                            
                        }
                        {
                            displayPagesInfo && itemsPage
                            
                        }
                        {
                            itemsPagination
                        }
                    </div>
                );
            }
            case 2 : {
                return (
                    <div key={ customKey() } className="paging">
                        {
                            itemsPagination
                        }
                        {
                            displayTotal && itemsTotal
                            
                        }
                        {
                            displayPagesInfo && itemsPage
                            
                        }
                    </div>
                );
            }
            case 3 : {
                return (
                    <div key={ customKey() } className="paging">
                        {
                            displayPagesInfo && itemsPage
                            
                        }
                        {
                            displayTotal && itemsTotal
                            
                        }
                        {
                            itemsPagination
                        }
                    </div>
                );
            }
            case 4 : {
                return (
                    <div key={ customKey() } className="paging">
                        {
                            itemsPagination
                        }
                        {
                            displayTotal && itemsTotal
                            
                        }
                        {
                            displayPagesInfo && itemsPage
                            
                        }
                    </div>
                );
            }
            case 5 : {
                return (
                    <div key={ customKey() } className="paging">
                        {
                            itemsPagination
                        }
                        {
                            displayPagesInfo && itemsPage
                            
                        }
                        {
                            displayTotal && itemsTotal
                            
                        }
                    </div>
                );
            }
            default : {
                return (
                    <div key={ customKey() } className="paging">
                        {
                            displayTotal && itemsTotal
                            
                        }
                        {
                            displayPagesInfo && itemsPage
                            
                        }
                        {
                            itemsPagination
                        }
                    </div>
                );
            }
        }
    }

    /**
     * Change page - previous
     */
    prev() {
        let { currentPage }=this.state;

        if (currentPage!==0) {
            this.setState({
                currentPage: currentPage-1
            })
        }
    }

    /**
     * Change page - next
     */
    next() {
        let { itemsPerSite, currentPage, filteredData }=this.state;
        const currentCount=filteredData.length;

        let mainPage=currentPage;
        mainPage++;

        if (itemsPerSite*mainPage<currentCount) {
            this.setState({
                currentPage: currentPage+1
            })
        }
    }

    /**
     * If user click on the listet item, then
     * gave the user the object back as 
     * callback parameter
     */
    clickCallback(e, object){
        const { liOnClickCallback } = this.state;

        if(liOnClickCallback){
            (liOnClickCallback)(e, object);
        }
    }

    /**
     * Return values as generated li items
     */
    getList() {
        let { keysToRender, displayCount, currentPage, itemsPerSite, filteredData, resetCountOnEachPage }=this.state;
        
        currentPage = parseInt(currentPage);
        itemsPerSite = parseInt(itemsPerSite);

        const start=(currentPage)*itemsPerSite;
        const end=start+itemsPerSite;

        if (isNaN(start) || isNaN(end)) {

            if ('dev'==this.state.env) {
                console.log(`Invalid value passed as key: currentPage. The current page returned NaN - not a number`);
            }

            return null;
        }

        const itemsToRender = filteredData.slice(start, end)
        const jsxToReturn = [];

        itemsToRender.map((itemsObject, index) => {
            const childs=[];
            const i=index+1;
            let currentIndex = i; 


            if(currentPage && !resetCountOnEachPage){
                currentIndex += currentPage*itemsPerSite;
            }

            if(displayCount){
                childs.push(
                    <span
                        className={`index entry entry-1`}
                        key={ customKey() }
                    >
                        {
                            currentIndex
                        }
                    </span>
                );
            }

            /**
             * Access the array of keys to render from the object
             */
            let count = 0;
            const objectKeys = Object.keys(itemsObject);

            keysToRender.map( (keyToRender, loopIndex) => {
                /**
                 * Render the keys in inside the object from current itemsToRender loop index
                 */
                const value=itemsObject[ keyToRender ];

                if (objectKeys.includes(keyToRender)&&undefined!==value) {
                    count++;

                    childs.push(
                        <span
                            className={`value entry entry-${loopIndex + (displayCount ? 2 : 1)} value-${count}`}
                            key={ customKey() }
                        >
                            {
                                value
                            }
                        </span>
                    );
                }
            });

            /**
             * Append childs into the li
             */
            jsxToReturn.push(
                <li
                    onClick={ (e) => this.clickCallback(e, itemsObject) }
                    key={ customKey() }
                >
                    {
                        childs
                    }
                </li>
            )
        });

        return jsxToReturn;
    }

    /**
     * Filter data based on the current search value
     */
    filterData(forceSearch: boolean = false){
        const { fallbackLoadingTime } = this.state;
        
        this.setState({
            loading: true
        }, () => {
            setTimeout( () => {
                const { searchValue, data, searchSensisitve, searchOnKeys, env, searchOnKeyDown } = this.state;
                const filteredData = [];
        
                /**
                 * If the user 
                 */        
                if(searchOnKeyDown || forceSearch){
                    data.map( object => {
                        searchOnKeys.map( keyName => {
                            /**
                             * Search on the value based on searching keys 
                             * provided by the user
                             */
                            if(undefined !== object[keyName]){
                                if(typeof '888' === typeof object[keyName]){
                                    /**
                                     * Sensitive
                                     */
                                    if(searchSensisitve && '' !== searchValue && -1 !== object[keyName].indexOf(searchValue)){
                                        filteredData.push(object);
                                    }
                                    /**
                                     * Not sensitive
                                     */
                                    if(!searchSensisitve && '' !== searchValue && -1 !== object[keyName].toLowerCase().indexOf(searchValue.toLowerCase())){
                                        filteredData.push(object);
                                    }
        
                                    if('' == searchValue){
                                        filteredData.push(object);
                                    }
                                }
                                else{
                                    if('dev' === env){
                                        // masterlog('')
                                    }
                                }
                            }
                        });
                    });
            
                    this.setState({
                        filteredData,
                        dataLoaded: true,
                        loading: false
                    });
                }
                else{
                    this.setState({
                        dataLoaded: true,
                        loading: false
                    });
                }
            }, fallbackLoadingTime);
        });
    }

    /**
     * Set search parameter
     * @param e 
     */
    setSearchValue(e: any) {
        e.persist();
        const { data, inputOnChangeCallback } = this.state;
        const searchValue = e.target.value;

        this.setState({
            loading: true
        }, () => {
            if(inputOnChangeCallback){
                (inputOnChangeCallback)(e);
            }
    
            if (27==e.keyCode||27==e.which) {
                return this.setState({
                    searchValue: '',
                    currentPage: 0,
                    filteredData: data,
                    loading: false
                });
            }
    
            if (13==e.keyCode||13==e.which) {
                return this.setState({
                    searchValue,
                    currentPage: 0,
                }, () => {
                    this.filterData(true);
                });
            }
    
            this.setState({
                searchValue,
                currentPage: 0,
            }, () => {
                this.filterData();
            });
        })
    }

    render() {
        const { loading, fallbackLoading, alignPagination, displaySearch, searchIcon, searchPlaceholder, searchTitle, paginationTitle } = this.state;
        const jsxList = this.getList();

        return (
            <div className="Pagination">
                {
                    displaySearch &&
                    <h1 className="h1">
                        {
                            searchTitle
                        }
                    </h1>
                }
                {
                    displaySearch &&
                    <div className="input-holder">
                        <input
                            className="input"
                            type="text"
                            onKeyDownCapture={ (e) => this.setSearchValue(e) }
                            onChange={ (e) => this.setSearchValue(e) }
                            value={ this.state.searchValue }
                            placeholder={searchPlaceholder}
                        />
                        {
                            '' !== searchIcon && 
                            <span 
                                className="icon" 
                                onClick={ (e) => this.filterData(true)}
                            >
                                {
                                    searchIcon
                                }
                            </span>
                        }
                        {
                            '' == searchIcon &&
                            <span 
                                className="icon icon-search"
                                onClick={ (e) => this.filterData(true)}
                            ></span>
                        }
                    </div>
                }
                {
                    1 == alignPagination && paginationTitle &&
                    <h1 className="h1">
                        {
                            paginationTitle
                        }
                    </h1>
                }
                {
                    1 == alignPagination &&
                    <ul>
                        {
                            0 !== jsxList.length && jsxList
                        }
                        {
                            '' !== fallbackLoading && loading && fallbackLoading
                        }
                    </ul>
                }
                {
                    this.getPagerJsx()
                }
                {
                    1 !== alignPagination && paginationTitle &&
                    <h1 className="h1">
                        {
                            paginationTitle
                        }
                    </h1>
                }
                {
                    1 !== alignPagination &&
                    <ul>
                        {
                            0 !== jsxList.length && jsxList
                        }
                        {
                            '' !== fallbackLoading && loading && fallbackLoading
                        }
                    </ul>
                }
            </div>
        );   
    }
}

export default Pagination;