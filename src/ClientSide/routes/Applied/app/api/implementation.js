import api from './api';

const BASE_URL = "/api/v1";
const ADMIN_BASE_URL = "/admin/api/v1";

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

    customDownload(input, init = null) {
        return fetch(input, init).then((response) => {
            if (response.ok) {
                return response.blob();
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

    getGoogleDocList(token, isFirstCall) {
        return this.customFetch(this.url + BASE_URL + "/users/google_docs?is_first_call=true", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })
    }

    googleLogin2() {
        return fetch(this.url + "/oauth2/authorize/google?redirect_uri=http://localhost:3000/oauth2/redirect", {
            method: 'GET',
        })
    }


    getLinkedAccounts(token) {
        return this.customFetch(this.url + BASE_URL + "/users/word_press_accounts", {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        });
    }

    getAddWordpressAccount(body, token) {
        return fetch(this.url + BASE_URL + "/users/word_press_accounts", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(body)
        });
    }

    updateWordpressAccount(info, token) {
        return fetch(this.url + BASE_URL + "/users/word_press_accounts/" + info.id, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
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


    deleteWordpressAccount(info, token) {
        return this.customFetch(this.url + BASE_URL + "/users/word_press_accounts/" + info, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        });
    }


    exportDocument(req, token) {
        return this.customFetch(this.url + BASE_URL + "/users/word_press_accounts/" + req.wordpress_account_id + "/export_docs", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(req)
        });
    }

    markdownDownload(req, token) {
        return this.customDownload(this.url + BASE_URL + "/users/download?file_id=" + req.id + "&doc_name=" + req.fileName  , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        });
    }

    exportsHistoryList(token) {
        return this.customFetch(this.url + BASE_URL + "/users/export_docs", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
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

    getLatestActivePlan(token) {
        return this.customFetch(this.url + BASE_URL + "/users/latest_plan", {
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

    handlePayment = (planId, userId) => {
        let data = {
            plan_id: planId,
            user_id: userId,
            payment_method: "paypal",
        };
        return this.customFetch(this.url + BASE_URL + "/payment/paypal/setup_payment", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
    }

    handleExecutePaypalPayment = (paymentDetails) => {
        return this.customFetch(this.url + BASE_URL + "/payment/paypal/execute_payment", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentDetails)
        });
    }


    handleExecuteStripePayment = (paymentDetails, token) => {
        return fetch(this.url + BASE_URL + "/payment/stripe", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(paymentDetails)
        });
    }


    handleFrontEndPaypalPayment = (paymentDetails, token) => {
        return fetch(this.url + BASE_URL + "/payment/paypal", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(paymentDetails)
        });
    };


/*
    listAllPlans = (token) => {
        return this.customFetch(this.url + "/admin/api/v1/plans", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
        });
    };
*/



    listAllPlans = (token) => {
        return this.customFetch(this.url + "/admin/api/v1/plans", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
        });
    };



    makePlanActive = (token, planId) => {
        return this.customFetch(this.url + "/admin/api/v1/plans?id_plan=" + planId, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
        });
    };


    getLatestPlan(token) {
        return this.customFetch(this.url + BASE_URL + "/users/latest_user_plans", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })
    }

    newPaymentStripe(paymentDetails, token) {
        return fetch(this.url + BASE_URL + "/payment/stripe", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(paymentDetails)
        });
    }

    newPaymentPaypal(token) {
        return this.customFetch(this.url + BASE_URL + "/payment/paypal/agreement", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
    }

    newPaymentPaypalSendToken(paypalToken, token) {
        return fetch(this.url + BASE_URL + "/payment/paypal", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(paypalToken)
        });
    }

    deleteAccount = (token) => {
        return fetch(this.url + BASE_URL + "/users", {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

    };

    cancelSubscription = (token) => {
        return fetch(this.url + BASE_URL + "/payment/cancel",
            {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + token,
                }
            });
    };



    // admin apis
    adminLogin = (body) => {
        return this.customFetch(this.url + "/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
    };


    fetchAllStats(token, start_year, end_year) {
        if (end_year === null || end_year === undefined) {
            return this.customFetch(this.url + ADMIN_BASE_URL + "/data?start_year=" + start_year, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
        } else {
            return this.customFetch(this.url + ADMIN_BASE_URL + "/data?start_year=" + start_year + "&end_year=" + end_year, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
        }
    }


    listAllUsers(page, token) {
        return this.customFetch(this.url + ADMIN_BASE_URL + "/users?page=" + page + "&size=10", {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
    }


    deleteUserAdmin(token, email) {
        return fetch(this.url + ADMIN_BASE_URL + "/users?email=" + email, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
    }


    unsubscribeUserAdmin(token, email) {
        return fetch(this.url + ADMIN_BASE_URL + "/users/cancel?email=" + email, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
    }

    changeUserTypeAdmin(token, body) {
        return fetch(this.url + ADMIN_BASE_URL + "/users", {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
    }

    addPlan = (body, token) => {
        return fetch(this.url + ADMIN_BASE_URL + "/plans", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify(body)
        });
    };
/*

    addPlan = (body) => {
        return fetch(this.url + ADMIN_BASE_URL + "/plans", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwicm9sZXMiOiJVU0VSIiwiaWF0IjoxNTQ3OTY0NDEzLCJleHAiOjE1NDg4Mjg0MTN9.O_OW7nj_vVLyqakt93TMR9yzKr5LmsNU_jeynET1UjKypky2hwrOsA_IaAOLTMvMewrKqtzL4UXutfJok1VTqw'
            },
            body: JSON.stringify(body)
        });
    };
*/

    adminSearchUser = (token, query, page, size) => {
        return this.customFetch(this.url + ADMIN_BASE_URL + "/users/search?query=" + query
            + "&size=" + size + "&page=" + page,
            {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json',
                }
            });
    };



    // end admin apis


}