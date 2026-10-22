import { createRoot } from 'react-dom/client'
import App from './App.tsx'

export let BACKEND_URL = "/backend"

fetch(`${BACKEND_URL}/manifest.json`).then(resp => {
    let connectionSuccess = false;

    if (resp.ok && isJson(resp)) {
        connectionSuccess = true;
        createApp(connectionSuccess)
    } else {
        console.log("Failed to contact server. Trying local host...")
        BACKEND_URL = "http://localhost:8000"

        fetch(`${BACKEND_URL}/manifest.json`).then(resp => {
            if (resp.ok && isJson(resp)) {
                connectionSuccess = true;
            }
            createApp(connectionSuccess)
        });
    }


})

function createApp(connectionSuccess:boolean):void {
    if(connectionSuccess){
        createRoot(document.getElementById('root')!).render(
            <App />
        )
    }else {
        createRoot(document.getElementById('root')!).render(
            <h1>ERROR: Could not contact backend</h1>

        )
    }
}

function isJson(response: Response):boolean {
    const contentType = response.headers.get("content-type") ?? "";
    console.log(contentType);
    return contentType === "application/json"
}