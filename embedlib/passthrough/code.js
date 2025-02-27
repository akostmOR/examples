////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// This file contains code that you would usually have in your frontend.

// This is the API endpoint, usually you want to run this example
// against our production API.
const API_BASE_URL = "https://api.production.clientwire.net";

// The conversation type to use through this example.
// You would use this value in your backend to create a conversation.
// Every tenant comes with a 'default' conversation type, so we use that one.
// If you have removed it, you need to specify a different conversation type here.
const CONVERSATION_TYPE = 'default';

// This is where we store the tenant ID based on your API key.
// If you are using this in production, you would set the tenant ID in your code.
let tenantId = null;

// Here we store your access token, which is used for the passthrough signin.
// Normally you would probably have your access token stored in local storage or a cookie.
let accessTokenOfYourSystem = null;

// We'll keep a reference to the Clientwire object after init.
let clientwire = null;

// Lets define a function you would setup in your frontend to call when someone
// clicks on the Chat button of a case in your system.
// Look at the backend_simulation.js file to see how this function is called.
window.yourFrontendsOpenChatFunction = function (conversationId) {
  $('#log').append(`<li>Showing the chat for: ${conversationId}</li>`);

  $('#clientwire-wrapper').show();
  clientwire.openConversation(conversationId);
};

// This is a function you would setup in your frontend to call when someone
// clicks on the Close button of the chat window.
window.yourCloseClientWireChatFunction = function () {
  $('#clientwire-wrapper').hide();

  // Optionally, you can also call clientwire.closeConversation() if you want
  // to properly detach from the conversation session. Usually, simply hiding
  // the container is enough, but if you want to fully close it:
  if (clientwire) {
    clientwire.closeConversation();
  }
};

// Init Clientwire SDK
// In a real app, you might call this on page load, we call it when you click on the Setup button.
window.initClientWire = function () {
  // You would NOT include this in your frontend code, but for this example,
  // we protect against re-initializing the Clientwire SDK.
  if (clientwire) {
    alert(
      'Clientwire SDK already initialized, please reload the page if you changed your Tenant/API key.'
    );
    return;
  }

  clientwire = new ClientWire();
  clientwire.init({
    // This is the tenant ID of your Clientwire account.
    // You can find it in the Clientwire dashboard settings.
    // For this example we retrieve it with the API key.
    // In a real app, you would set it in your code
    // eg: tenantId: "ace00000-ace0-ace0-ace0-ace000000000"
    tenantId: tenantId,
    // Here you need to provide a function that returns the access token of your system.
    // Clientwire will call this function to get the access token when
    // it needs to sign in a user.
    accessToken: function () {
      return accessTokenOfYourSystem;
    },
    // accessToken: accessTokenOfYourSystem,
    // This is the ID of the HTML element where the Clientwire SDK will render.
    containerId: 'clientwire-container',
    // This is the base URL of the Clientwire API.
    // In your production app, you can remove it and we use the default production endpoint.
    // We added it here so you can run this example to make more easy to run this example
    // against different Clientwire environments.
    apiBaseUrl: API_BASE_URL,
  });
  $('#log').append('<li>Clientwire SDK initialized.</li>');
};
