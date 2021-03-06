
import Promise = require('bluebird');

export interface NetworkResponse {
  Success: boolean
  Message?: string
}

let authToken: string = '';

export function updateToken(token: string) {
  authToken = token;
}

export function performCall(method: string, route: string, args?: any): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, route, true);
    xhr.onload = () => {
      if (xhr.status !== 200) {
        if (xhr.status === 404)
          reject(new Error('Request failed.  Does not exist'));
        else
          reject(new Error('Request failed: server error'));
      } else {
        let res: NetworkResponse = JSON.parse(xhr.response);
        if (res.Success) {
          resolve(res);
        } else {
          reject(new Error(res.Message));
        }
      }
    };
    if (authToken) {
      xhr.setRequestHeader('x-access-token', authToken);
    }
    if (args) {
      let fd = new FormData();
      for (let key in args) {
        fd.append(key, args[key]);
      }
      xhr.send(fd);
    } else {
      xhr.send();
    }
  });
}

export function downloadFile(route: string): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', route, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.status !== 200) {
        reject(new Error('Request failed'));
      } else {
        resolve(xhr.response);
      }
    };
    xhr.setRequestHeader('x-access-token', authToken);
    xhr.send();
  });
}