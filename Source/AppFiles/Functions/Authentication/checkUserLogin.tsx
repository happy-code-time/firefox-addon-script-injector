import Redirection from "../redirect/Redirection";

import Encryption from "../../Cryption/encryption";

/**
 * Check user data, if something wrong then set redirecter and reload website
 */
const checkUserLogin = () => {
    const redirect = new Redirection();
    const encryption = new Encryption();
    const salt = process.env.SALT;
    let data = null;
    
    try{
        const encrypted = localStorage.getItem('authentication');
        data = encryption.decrypt(encrypted, salt);
    
        if(null == encrypted || undefined == encrypted || !encrypted.length || null == data || undefined == data || !data.length){
            data = null;
            localStorage.removeItem('authentication');
            redirect.setRedirect('');
            window.location.reload();
        }

    } catch(error){
        data = null;
        localStorage.removeItem('authentication');
        redirect.setRedirect('');
        window.location.reload();
    }
};

export default checkUserLogin;