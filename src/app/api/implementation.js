import api from './api';

const BASE_URL = "/api/v1";

export default class Implementation extends api {
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
        return this.customFetch(this.url + "/auth/google_login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req)
        })
    }

    apiRestTest(token) {
        return fetch(this.url + "/rest/test", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: {}
        })
    }

    getGoogleDocList(userId) {
        return this.customFetch(this.url + BASE_URL + "/users/" + userId + "/google_docs", {
            method: 'GET'
        })
    }

    googleLogin2() {
        return fetch(this.url + "/oauth2/authorize/google?redirect_uri=http://localhost:3000/oauth2/redirect", {
            method: 'GET',
        })
    }


    getLinkedAccounts(userId) {
        return this.customFetch(this.url + BASE_URL + "/users/" + userId + "/word_press_accounts", {
            method: "GET",
        });
    }

    getAddWordpressAccount(body, userId) {
        return this.customFetch(this.url + BASE_URL + "/users/" + userId + "/word_press_accounts", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
    }

    updateWordpressAccount(info, userId) {
        return this.customFetch(this.url + BASE_URL + "/users/" + userId + "/word_press_accounts/" + info.id, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(info)
        });
    }


    getAllInfoUser(info) {
        let body = {
            user_email: info
        };
        return this.customFetch(this.url + BASE_URL + "/users", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
    }


    deleteWordpressAccount(info, userId) {
        return this.customFetch(this.url + BASE_URL + "/users/" + userId + "/word_press_accounts/" + info, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
    }

    exportAsPage(req) {
        return fetch(this.url + BASE_URL + "/users/" + req.user_id + "/word_press_accounts/" + req.wordpress_account_id + "/export_docs", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req)
        });
    }

    exportAsPost(req) {
        return fetch(this.url + BASE_URL + "/users/" + req.user_id + "/word_press_accounts/" + req.wordpress_account_id + "/export_docs", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req)
        });
    }

    exportsHistoryList(userId) {
        return this.customFetch(this.url + BASE_URL + "/users/" + userId + "/export_docs?page=1&size=50", {
            method: 'GET',
        })
    }


    getUserInfoAfterLogin(token) {
        return this.customFetch(this.url + BASE_URL + "/user/me", {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + token,
            }
        })
    }


    brainTree() {
        return this.customFetch(this.url + BASE_URL + "/client_token", {
            method: 'GET',
        })
    }

    sendNonce(nonce) {
        let finalRequest = {
            amount: 100,
            payment_method_nonce: nonce,
        };
        return fetch(this.url + BASE_URL + "/payment/braintree", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalRequest)
        });
    }




}