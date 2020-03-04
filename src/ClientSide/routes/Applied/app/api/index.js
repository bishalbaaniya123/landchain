import env from "../config/index";
import {envType} from "../config/index";
import MockApi from "./MockApi";
import Implementation from "./implementation";

let a="da";

let api;

switch (env) {
    case envType.LOCAL:
        // api = new Implementation('http://192.168.1.18:8080');
        api = new Implementation('http://localhost:8080');
        // api = new Implementation('https://core.docpress.io');

        break;
    case envType.DEV:
        api = new Implementation('http://ec2-34-207-220-193.compute-1.amazonaws.com:8080');
        break;
    case envType.PROD:
        api = new Implementation('http://example.com/api');
        break;
    case envType.MOCK:
    default:
        api = new MockApi();
}

export default api;