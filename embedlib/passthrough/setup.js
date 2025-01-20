////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// Prepartion for the example, you would normally not have this code in
// your production code.

$(document).ready(function () {
  // The setup just initializes your tenant with your user info endpoint
  $('#setupBtn').click(function () {
    const apiKeyValue = $('#apiKey').val().trim();
    const userInfoEndpointValue = $('#userInfoEndpoint').val().trim();
    accessTokenOfYourSystem = $('#token').val().trim();

    if (!apiKeyValue || !userInfoEndpointValue || !accessTokenOfYourSystem) {
      $('#log').append(
        '<li>Please enter an API Key, a /userInfo endpoint and an access token.</li>'
      );
      return;
    }

    // Lets find out our tenant ID and test if the API key works
    $.ajax({
      url: API_BASE_URL + '/api/v1/tenant',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKeyValue,
      },
      success: function (response) {
        $('#log').append('<li>Tenant retrieved. Tenant ID: ' + response.id + '</li>');
        tenantId = response.id;
        $('#tenantName').text(response.name);

        // Now patch the tenant with the user info endpoint
        $.ajax({
          url: API_BASE_URL + '/api/v1/tenant',
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKeyValue,
          },
          data: JSON.stringify({
            passthrough_userinfo_url: userInfoEndpointValue,
          }),
          success: function (patchResponse) {
            $('#log').append(
              '<li>Tenant updated with passthrough_userinfo_url: ' + userInfoEndpointValue + '</li>'
            );
            console.log('Tenant patch success:', patchResponse);

            // We simulate loading conversations here, you would do this in your backend.
            reloadConversations();

            // Now we can initialize the Clientwire SDK
            // Normally you would call this on page load, but we do it here for the example.
            initClientWire();
          },
          error: function (error) {
            $('#log').append('<li>Setup patch failed. Check console.</li>');
            console.error('Setup failed:', error);
          },
        });
      },
      error: function (error) {
        $('#log').append('<li>Setup (GET tenant) failed. Check console.</li>');
        console.error('Setup failed:', error);
      },
    });
  });

  // Here we just send a direct XHR call to /api/v1/auth/{tenant_id}/oauth2/token
  // to test if the token is valid and your userInfo endpoint is working.
  // The real login will happen via the Clientwire SDK in practice.
  $('#testBtn').click(function () {
    if (!tenantId) {
      $('#log').append('<li>Please setup your tenant first (no tenantId yet).</li>');
      return;
    }
    if (!accessTokenOfYourSystem) {
      $('#log').append('<li>Please enter a token.</li>');
      return;
    }

    console.log('Testing passthrough with token:', accessTokenOfYourSystem);

    $.ajax({
      url: API_BASE_URL + '/api/v1/auth/' + tenantId + '/oauth2/token',
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      data:
        'grant_type=urn:ietf:params:oauth:grant-type:token-exchange&subject_token=' +
        accessTokenOfYourSystem +
        '&subject_token_type=urn:ietf:params:oauth:token-type:access_token',
      success: function (response) {
        $('#log').append('<li>Passthrough test successful. Received tokens.</li>');
        console.log('Passthrough call successful:', response);
      },
      error: function (error) {
        $('#log').append('<li>Passthrough test failed. Check console.</li>');
        console.error('Test call failed:', error);
      },
    });
  });
});

window.showNotARealConversationAlert = function () {
  alert(
    'This is just a static entry to illustrate how your CRM could look. Add a conversation to start a real chat.'
  );
};
