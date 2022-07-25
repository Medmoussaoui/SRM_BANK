export function postMethode(postPayload: any) {
    postPayload.headers['Content-Type'] = 'application/json';
    return {
        method: 'POST',
        body: JSON.stringify(postPayload.body),
        headers: postPayload.headers
    }
}