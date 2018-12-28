import qs from 'qs';
import { isEmptyObject } from './general';
import axios from 'axios';

export const getJson = (body, url, params = {}) =>{
    return fetchJson( body, url, 'GET', params );
}

export const postJson = (body, url, params = {}) =>{
    return fetchJson(body, url, 'POST', params);
}

export const putJson = (body, url, params = {}) =>{
    return fetchJson( body, url, 'PUT', params );
}

export const deleteJson = (body, url, params = {}) =>{
    return fetchJson(body, url, 'DELETE', params);
}

export const patchJson = (body, url, params = {}) => {
    return fetchJson(body, url, 'PATCH', params);
}

/**
 * @description 
 * general JSON fetch function
 * @param {object} body
 * @param {string} url
 * @param {string} method - GET|POST|PUT|DELETE
 * @param {object} params - optional fetch parameters
 * @return {Promise} parsed JSON object
 */
const fetchJson = (body = {}, url = '', method = 'GET', params = {}) =>{

    const { headers = {}, ..._params } = params;

    let _headers = Object.assign({
        "Content-Type": "application/json; charset=utf-8"
    }, headers);

    const hasBody = !isEmptyObject( body );

    const _url = method === 'GET' && hasBody ? `${url}?${qs.stringify( body )}` : url;
    let fetchParams = {
        url:_url,
        method,
        headers:_headers,
        ..._params
    };
 
    if ( hasBody && method !== 'GET' ){
        fetchParams.data = body;
    }

    return new Promise( (resolve, reject) =>{
        axios
        .request( fetchParams )
        .then( ({ data }) =>{
            resolve(data)
        })
        .catch( rejected =>{

            if ( rejected.response && rejected.response.status === 400 ){
                resolve(rejected.response.data);
            }else if ( rejected.message ){
                reject( rejected.message );
            }
            else 
            reject(rejected.response);
        });
    });;
}