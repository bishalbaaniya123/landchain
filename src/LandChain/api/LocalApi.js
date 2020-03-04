import Api from "./api";

export default class LocalApi extends Api {
    constructor(url) {
        super();
        this.url = url;
    }

    customFetch(input, init = null) {
        return fetch(input, init).then((response) => {
            if (response.ok) {
                return response.json();
            } else throw response;
        });
    }

    googleLogin(req) {
        return fetch(this.url + "/login", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'id_token': req.tokenId
            },
            body: {}
        });
    }

}
