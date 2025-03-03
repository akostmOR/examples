////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// Prepartion for the example, you would normally not have this code in
// your production code.

$(document).ready(function () {
  // The setup just initializes your tenant with your user info endpoint
  $('#setupBtn').click(function () {
    const tenantId = $('#tenant_id').val().trim();
    const email = $('#email').val().trim();
    const password = $('#password').val().trim();

    if (!tenantId || !email || !password) {
      $('#log').append(
        '<li>Please enter a tenant ID, e-mail and password.</li>'
      );
      return;
    }

    initClientWire(tenantId, email, password);
  });

  // Update the conversation IDs in the CRM table when the input fields change
  $('#conversation_id_1, #conversation_id_2').on('input', function() {
    updateConversationIds();
  });

  // Initial update in case fields already have values
  updateConversationIds();
});

// Function to update the conversation IDs in the CRM table and click handlers
function updateConversationIds() {
  const conversationId1 = $('#conversation_id_1').val().trim() || 'Enter an ID above';
  const conversationId2 = $('#conversation_id_2').val().trim() || 'Enter an ID above';
  
  // Update the case IDs displayed in the table
  $('.case-id-1').text(conversationId1);
  $('.case-id-2').text(conversationId2);
  
  // Update the onclick attributes of the Chat buttons
  $('#chat-button-1').attr('onclick', `yourFrontendsOpenChatFunction('${conversationId1}')`);
  $('#chat-button-2').attr('onclick', `yourFrontendsOpenChatFunction('${conversationId2}')`);
  
  $('#log').append(`<li>Updated conversation IDs: ${conversationId1}, ${conversationId2}</li>`);
}

