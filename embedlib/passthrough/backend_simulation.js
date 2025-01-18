////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// This simulates calls of your backend to our API

$(document).ready(function () {
  // We will do a PUT call to create (or update) a conversation with the ID the user typed.
  // We'll also include a participant (client) named "Marie".
  $("#addConvoBtn").click(function () {
    if (!tenantId) {
      $("#log").append(
        "<li>Please setup your tenant first (no tenantId yet).</li>"
      );
      return;
    }

    const conversationId = $("#convoId").val().trim();
    if (!conversationId) {
      $("#log").append("<li>Error: Please enter a conversation ID.</li>");
      return;
    }

    // Before we PUT, check if the row already exists in the table.
    // If so, skip adding (per your requirement).
    const existingRow = $("table tbody tr").filter(function () {
      return $(this).find("td").eq(0).text() === conversationId;
    });
    if (existingRow.length > 0) {
      $("#log").append(
        `<li>Conversation "${conversationId}" already exists in table. Skipping.</li>`
      );
      return;
    }

    // Make a real PUT call to create/update a conversation with a single 'CLIENT' participant
    $.ajax({
      url: API_BASE_URL + "/api/v1/conversations/" + conversationId,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": $("#apiKey").val().trim(),
      },
      data: JSON.stringify({
        conversation_type_id: CONVERSATION_TYPE,
        id: conversationId,
        conversation_data: {
          title: "New conversation with ID: " + conversationId,
        },
        participants: [
          {
            id: "client",
            kind: "CLIENT",
            display_name: "Marie",
          },
        ],
      }),
      success: function (response) {
        $("#log").append(
          `<li>Conversation created/updated: ${conversationId}</li>`
        );
        console.log("PUT conversation success:", response);

        // After successful creation, let's fetch the full conversation list again
        // so we can refresh the CRM table consistently from the backend data.
        reloadConversations();
      },
      error: function (error) {
        $("#log").append(
          "<li>Error creating/updating conversation. Check console.</li>"
        );
        console.error("PUT conversation failed:", error);
      },
    });
  });

  // Called after tenant is set up (in setup.js).
  // It retrieves all conversations from the backend and displays them in the CRM table.
  window.reloadConversations = function () {
    if (!tenantId) {
      $("#log").append("<li>Cannot load conversations: no tenantId yet.</li>");
      return;
    }

    $.ajax({
      url: API_BASE_URL + "/api/v1/conversations?limit=100",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": $("#apiKey").val().trim(),
      },
      success: function (response) {
        $("#log").append("<li>Conversations retrieved.</li>");
        console.log("GET conversations success:", response);

        // Clear out the table body first.
        const $tbody = $("table tbody");
        $tbody.empty();

        const conversations = response.conversations || [];

        if (conversations.length === 0) {
          // If none exist, show a placeholder row.
          $tbody.append(`
            <tr>
              <td colspan="4">
                No conversations yet, click Add above to create a conversation by simulating a backend call.
              </td>
            </tr>
          `);
          return;
        }

        // Otherwise, add rows for each conversation
        conversations.forEach(function (convo) {
          const conversationId = convo.id;
          // You might also look for the actual client's name in participants,
          // but for now we just hardcode "Marie" for demonstration.
          // Or you can parse convo.participants to find "CLIENT" and show the real display_name.
          $tbody.append(`
            <tr>
              <td>${conversationId}</td>
              <td>Marie</td>
              <td>${convo.conversation_data?.title || "N/A"}</td>
              <td><button class="chat-button" onClick="yourFrontendsOpenChatFunction('${conversationId}')">Chat</button></td>
            </tr>
          `);
        });
      },
      error: function (error) {
        $("#log").append(
          "<li>Error loading conversations. Check console.</li>"
        );
        console.error("GET conversations failed:", error);
      },
    });
  };
});
