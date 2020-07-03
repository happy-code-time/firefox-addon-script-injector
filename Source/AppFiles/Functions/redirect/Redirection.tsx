class Redirection 
{
    constructor(){
        this.setRedirect = this.setRedirect.bind(this);
        this.getRedirect = this.getRedirect.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    /**
     * Set redirection
     */
    setRedirect = (redirect) => {
        try{
            sessionStorage.setItem('redirect', redirect);
        }
        catch(e){
            sessionStorage.clear();
            sessionStorage.setItem('redirect', redirect);
        }
    }

    /**
     * Get redirection
     */
    getRedirect = () => {
        return sessionStorage.getItem('redirect');
    }

    /**
     * Redirect user and clear redirection
     */
    redirect(){
        const path = this.getRedirect();

        if(null !== path){
            const route = path;
            sessionStorage.removeItem('redirect');
            window.location.assign('#/' + route);
        }
    }
}

export default Redirection;