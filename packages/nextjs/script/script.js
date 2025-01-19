console.log("scripting...AbortController.apply.")


var cspMetaTag = document.createElement('meta');
    cspMetaTag.setAttribute('http-equiv', 'Content-Security-Policy');
    cspMetaTag.setAttribute('content', "connect-src 'self';");
    document.querySelector('head').appendChild(cspMetaTag);