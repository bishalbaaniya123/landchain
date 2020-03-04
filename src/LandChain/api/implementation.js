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


    login(body) {
        return this.customFetch(this.url + "/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
    }

    getAllLands(body, token) {
        return this.customFetch(this.url + "/api/v1/lands?show_only_public_land=false", {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + token
            },
        })
    }


    getCurrentOwnerDetails(landUuid, token) {
        return this.customFetch(this.url + "/api/v1/lands/owner?land_uuid=" + landUuid, {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + token
            },
        })
    }


    getPreviousOwners(landUuid, token) {
        return this.customFetch(this.url + "/api/v1/lands/owner_history?land_uuid=" + landUuid, {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + token
            },
        })
    }


    getTransactionDataList(landUuid, token) {
        return this.customFetch(this.url + "/api/v1/land_transactions?land_uuid=" + landUuid +
            "&is_complete=false", {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + token
            },
        })
    }


    transferLand(landTransactionId, token) {
        return this.customFetch(this.url + "/api/v1/land_transfer?land_transaction_id=" + landTransactionId, {
            method: 'POST',
            headers: {
                Authorization: "Bearer " + token
            },
        })
    }


    getAllUsers(token) {
        return this.customFetch(this.url + "/api/v1/admin/users",
            {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + token
                },
            })
    }


    addLand(body, token) {
        return this.customFetch(this.url + "/api/v1/lands", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(body)
        })
    }

    makePdf(transactionId, token) {
        return this.customFetch(this.url + "/api/v1/land_agreement?land_transaction_id="+ transactionId+  "&view=false", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token
            }
        })
    }

    changeUserStatus(phone, identificationNo, currentStatus, token) {
        let body = {
            mob_no: phone,
            identification_no: identificationNo,
            current_status: currentStatus
        };
        return this.customFetch(this.url + "/api/v1/admin/users/verify", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(body)
        })
    }



    updateVerificationList(verificationStep, transactionNumber, token) {
        let body = {
            is_complete: true,
            verification_step: verificationStep,
        };
        return this.customFetch(this.url + "/api/v1/land_transactions/"+ transactionNumber +"/tracking_process", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(body)
        })
    }

    getPdfLink = (transactionId) => {
        return this.url + "/api/v1/land_agreement?land_transaction_id=" + transactionId + "&view=true";
    };


    sendPapersToBoth(transactionId, token) {
        return this.customFetch(this.url + "/api/v1/land_agreement?land_transaction_id=" + transactionId + "&view=false",
            {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + token
                },
            })
    }


    haltTransaction(body, token) {
        return fetch(this.url + "/api/v1/lands/halt",
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify(body)
            })
    }


}
