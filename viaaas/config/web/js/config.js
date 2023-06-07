// See https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-app-registration
// You'll need to add the page as a Redirect URL to Azure as a Single Page Application
// noinspection ES6ConvertVarToLetConst - TODO fix this

// Azure Client ID
const azureClientId = "fced2066-19b4-4184-8407-bd809d66ad95";
// Origins that we'll not use https://viaversion.github.io/VIAaaS/ as redirect URL
const whitelistedOrigin = [
    window.location.origin
];
// Default CORS Proxy config
var defaultCorsProxy = window.location.origin + "/cors/";
// var defaultCorsProxy = "https://cors.re.yt.nom.br/";
// Default instance suffix, in format "viaaas.example.com[:25565]", null to use the page hostname;
var defaultInstanceSuffix = null;
